import { client } from '@/api/client'
import { createAppSlice } from '@/app/createAppSlice'

type State = {
  loggedInUserId: string | null
}

const initialState: State = {
  loggedInUserId: null,
}

const authSlice = createAppSlice({
  name: 'auth',
  initialState,
  reducers: (create) => ({
    loginUser: create.asyncThunk(
      async (username: string) => {
        const res = await client.post<{ success: boolean }>('/fakeApi/login', {
          username,
        })
        if (res.data.success) {
          return username
        }
      },
      {
        fulfilled: (state, action) => {
          if (action.payload) {
            state.loggedInUserId = action.payload
          }
        },
      },
    ),
    logoutUser: create.asyncThunk(
      async () => {
        const res = await client.post<{ success: boolean }>(
          '/fakeApi/logout',
          {},
        )
        return res.data.success
      },
      {
        fulfilled: (state, action) => {
          if (action.payload) {
            state.loggedInUserId = null
          }
        },
      },
    ),
  }),
  selectors: {
    selectLoggedInUserId: (state) => state.loggedInUserId,
  },
})

export const { reducer: authSliceReducer, name } = authSlice
export const { loginUser, logoutUser } = authSlice.actions
export const { selectLoggedInUserId } = authSlice.selectors
