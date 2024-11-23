import { createSelector } from '@reduxjs/toolkit'
import { selectAllUsers } from './usersSlice'
import { RootState } from '@/app/store'

export const selectUserIds = createSelector(selectAllUsers, (users) =>
  users.map(({ id }) => id),
)

export const selectUserById = (state: RootState, id: string) => {
  return state.users.find(({ id: userId }) => userId === id)
}

export const selectLoggerInUserName = createSelector(
  (state: RootState) => state.users,
  (state: RootState) => state.auth.loggedInUserId,
  (users, loggedInUserId) => {
    return users.find((user) => user.id === loggedInUserId)?.name
  },
)
