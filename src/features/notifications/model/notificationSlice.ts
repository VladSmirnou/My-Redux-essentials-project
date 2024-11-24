import { client } from '@/api/client'
import { createAppSlice } from '@/app/createAppSlice'
import type { RootState } from '@/app/store'
import { createEntityAdapter } from '@reduxjs/toolkit'

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

const notificationsAdapter = createEntityAdapter<ClientNotification>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = notificationsAdapter.getInitialState()

const notificationsSlice = createAppSlice({
  name: 'notifications',
  initialState,
  reducers: (create) => ({
    allNotificationsRead: create.reducer((state) => {
      Object.values(state.entities).forEach((notification) => {
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

          Object.values(state.entities).forEach((notification) => {
            notification.isNew = !notification.read
          })

          notificationsAdapter.upsertMany(state, notificationsWithMetadata)
        },
      },
    ),
  }),
})

export const { reducer: notificationsReducer, name } = notificationsSlice
export const { fetchNotifications, allNotificationsRead } =
  notificationsSlice.actions

export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors((state: RootState) => state.notifications)

export const selectUnreadNotificationsCount = (state: RootState) => {
  const allNotifications = selectAllNotifications(state)
  const unreadNotifications = allNotifications.filter(
    (notification) => !notification.read,
  )
  return unreadNotifications.length
}
