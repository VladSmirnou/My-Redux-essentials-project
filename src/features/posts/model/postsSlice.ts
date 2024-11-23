import { client } from '@/api/client'
import { createAppSlice } from '@/app/createAppSlice'
import { RootState } from '@/app/store'
import { selectPostsStatus } from './selectors'

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

const initialState = {
  posts: [] as Array<Post>,
  postStatus: 'idle' as PostStatus,
}

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
          state.postStatus = 'pending'
        },
        fulfilled: (state, action) => {
          state.posts = action.payload
          state.postStatus = 'success'
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
          state.postStatus = 'pending'
        },
        rejected: (state) => {
          state.postStatus = 'error'
        },
        fulfilled: (state, action) => {
          state.postStatus = 'success'
          state.posts.push(action.payload)
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
          state.postStatus = 'pending'
        },
        fulfilled: (state, action) => {
          const post = state.posts.find(({ id }) => id === action.payload.id)
          if (post) {
            post.title = action.payload.title
            post.content = action.payload.content
          }
          state.postStatus = 'success'
        },
      },
    ),
    updatePostReactions: create.reducer<{
      reactionId: string
      reaction: ReactionTypes
    }>((state, action) => {
      const { reactionId, reaction } = action.payload

      const post = state.posts.find((post) => post.reactions.id === reactionId)
      if (post) {
        post.reactions[reaction]++
      }
    }),
  }),
})

export const { reducer: postsSliceReducer, name } = postsSlice
export const { updatePostReactions, fetchPosts, createPost, updatePost } =
  postsSlice.actions
