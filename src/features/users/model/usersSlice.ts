import { client } from '@/api/client'
import { createAppSlice } from '@/app/createAppSlice'

type User = {
  id: string
  name: string
}

const initialState: Array<User> = []

export const usersSlice = createAppSlice({
  name: 'users',
  initialState,
  reducers: (create) => ({
    fetchUsers: create.asyncThunk(
      async () => {
        const response = await client.get<User[]>('/fakeApi/users')
        return response.data
      },
      {
        fulfilled: (state, action) => {
          return action.payload
        },
      },
    ),
  }),
  selectors: {
    selectAllUsers: (state) => state,
  },
})

export const { reducer: usersSliceReducer, name } = usersSlice
export const { fetchUsers } = usersSlice.actions
export const { selectAllUsers } = usersSlice.selectors
