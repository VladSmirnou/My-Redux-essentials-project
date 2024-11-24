import { client } from '@/api/client'
import { createAppSlice } from '@/app/createAppSlice'
import { RootState } from '@/app/store'
import { selectLoggedInUserId } from '@/features/auth/model/authSlice'
import { createEntityAdapter } from '@reduxjs/toolkit'

type User = {
  id: string
  name: string
}

const usersAdapter = createEntityAdapter<User>()

const initialState = usersAdapter.getInitialState()

export const usersSlice = createAppSlice({
  name: 'users',
  initialState,
  reducers: (create) => ({
    fetchUsers: create.asyncThunk(
      async () => {
        const response = await client.get<User[]>('/fakeApi/users')
        return response.data
      },
      { fulfilled: usersAdapter.setAll },
    ),
  }),
})

const selectors = usersAdapter.getSelectors((state: RootState) => state.users)

export const { reducer: usersSliceReducer, name } = usersSlice
export const { fetchUsers } = usersSlice.actions
export const {
  selectAll: selectAllUsers,
  selectIds: selectUserIds,
  selectById: selectUserById,
} = selectors

export const selectLoggerInUserName = (state: RootState) => {
  const userId = selectLoggedInUserId(state)
  if (userId) {
    return selectUserById(state, userId).name
  }
}
