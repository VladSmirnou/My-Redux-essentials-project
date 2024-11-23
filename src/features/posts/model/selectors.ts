import { RootState } from '@/app/store'
import { createSelector } from '@reduxjs/toolkit'

export const selectPostById = (state: RootState, id: string) =>
  state.posts.posts.find((post) => post.id === id)

export const selectSortedByDatePostIds = createSelector(
  (state: RootState) => state.posts.posts,
  (posts) =>
    posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(({ id }) => id),
)

export const selectPostsStatus = (state: RootState) => state.posts.postStatus

export const selectUserPosts = createSelector(
  (state: RootState) => state.posts.posts,
  (_: RootState, userId: string) => userId,
  (posts, userId) => {
    return posts.filter(({ user }) => user === userId)
  },
)
