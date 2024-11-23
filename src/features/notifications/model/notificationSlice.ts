import { client } from '@/api/client'
import { createAppSlice } from '@/app/createAppSlice'
import type { RootState } from '@/app/store'

interface ClientResponse<T> {
  status: number
  data: T
  headers: Headers
  url: string
}

export interface ServerNotification {
  id: string
  date: string
  message: string
  user: string
}

export interface ClientNotification extends ServerNotification {
  read: boolean
  isNew: boolean
}

const initialState: ClientNotification[] = []

const notificationsSlice = createAppSlice({
  name: 'notifications',
  initialState,
  reducers: (create) => ({
    allNotificationsRead: create.reducer((state) => {
      state.forEach((notification) => {
        notification.read = true
      })
    }),
    fetchNotifications: create.asyncThunk(
      async (_, thunkApi) => {
        const allNotifications = selectAllNotifications(
          thunkApi.getState() as RootState,
        )
        const [latestNotification] = allNotifications
        const latestTimestamp = latestNotification
          ? latestNotification.date
          : ''
        const response: ClientResponse<ServerNotification[]> = await client.get(
          `/fakeApi/notifications?since=${latestTimestamp}`,
        )
        return response.data
      },
      {
        fulfilled: (state, action) => {
          const notificationsWithMetadata: ClientNotification[] =
            action.payload.map((notification) => ({
              ...notification,
              read: false,
              isNew: true,
            }))

          state.forEach((notification) => {
            // Any notifications we've read are no longer new
            notification.isNew = !notification.read
          })
          state.push(...notificationsWithMetadata)
          // Sort with newest first
          state.sort((a, b) => b.date.localeCompare(a.date))
        },
      },
    ),
  }),
})

export const { reducer: notificationsReducer, name } = notificationsSlice
export const { fetchNotifications, allNotificationsRead } =
  notificationsSlice.actions
export const selectAllNotifications = (state: RootState) => state.notifications

export const selectUnreadNotificationsCount = (state: RootState) => {
  const allNotifications = selectAllNotifications(state)
  const unreadNotifications = allNotifications.filter(
    (notification) => !notification.read,
  )
  return unreadNotifications.length
}
