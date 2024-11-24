import { client } from '@/api/client'
import { appStatusChanged } from '@/app/appSlice'
import { createAppSlice } from '@/app/createAppSlice'
import type { AppStartListening } from '@/app/listenerMiddleware'
import { RootState } from '@/app/store'
import {
  createEntityAdapter,
  createSelector,
  current,
  EntityState,
} from '@reduxjs/toolkit'

export type Reactions = {
  id: string
  thumbsUp: number
  tada: number
  heart: number
  rocket: number
  eyes: number
}

export type ReactionTypes = keyof Reactions

type Post = {
  id: string
  title: string
  date: string
  content: string
  reactions: Reactions
  comments: Array<string>
  user: string
}

type PostStatus = 'idle' | 'pending' | 'error' | 'success'

interface PostsState extends EntityState<Post, string> {
  status: PostStatus
  error: string | null
}

export const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState: PostsState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
})

const postsSlice = createAppSlice({
  name: 'posts',
  initialState,
  reducers: (create) => ({
    fetchPosts: create.asyncThunk(
      async () => {
        const res = await client.get<Array<Post>>('/fakeApi/posts')
        return res.data
      },
      {
        options: {
          condition(arg, thunkApi) {
            const postStatus = selectPostsStatus(
              thunkApi.getState() as RootState,
            )
            if (postStatus !== 'idle') {
              return false
            }
          },
        },
        pending: (state) => {
          state.status = 'pending'
        },
        fulfilled: (state, action) => {
          postsAdapter.setAll(state, action.payload)
          // console.log(current(state))
          state.status = 'success'
        },
      },
    ),
    createPost: create.asyncThunk(
      async (payload: { user: string; title: string; content: string }) => {
        const res = await client.post<Post>('/fakeApi/posts', payload)
        return res.data
      },
      {
        pending: (state) => {
          state.status = 'pending'
        },
        rejected: (state) => {
          state.status = 'error'
        },
        fulfilled: (state, action) => {
          state.status = 'success'
          postsAdapter.addOne(state, action.payload)
        },
      },
    ),
    updatePost: create.asyncThunk(
      async (payload: { postId: string; title: string; content: string }) => {
        const { postId, ...rest } = payload
        const res = await client.patch<Post>(`/fakeApi/posts/${postId}`, rest)
        return res.data
      },
      {
        pending: (state) => {
          state.status = 'pending'
        },
        fulfilled: (state, action) => {
          const { id, title, content } = action.payload
          postsAdapter.updateOne(state, { id, changes: { title, content } })
          state.status = 'success'
        },
      },
    ),
    updatePostReactions: create.reducer<{
      postId: string
      reaction: ReactionTypes
    }>((state, action) => {
      const { postId, reaction } = action.payload
      const post = state.entities[postId]
      if (post) {
        post.reactions[reaction]++
      }
    }),
  }),
})

export const { reducer: postsSliceReducer, name } = postsSlice
export const { updatePostReactions, fetchPosts, createPost, updatePost } =
  postsSlice.actions

const selectors = postsAdapter.getSelectors((state: RootState) => state.posts)

export const {
  selectById: selectPostById,
  selectIds: selectSortedByDatePostIds,
  selectAll: selectAllPosts,
} = selectors

export const selectPostsStatus = (state: RootState) => state.posts.status

export const selectUserPosts = createSelector(
  [selectAllPosts, (_: RootState, userId: string) => userId],
  (posts, userId) => {
    return posts.filter(({ user }) => user === userId)
  },
)

export const addPostsListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    actionCreator: createPost.fulfilled,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(
        appStatusChanged({
          status: 'success',
          statusText: 'post added!',
        }),
      )
    },
  })
  startAppListening({
    actionCreator: createPost.rejected,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(
        appStatusChanged({
          status: 'error',
          statusText: action.error.message,
        }),
      )
    },
  })
}
