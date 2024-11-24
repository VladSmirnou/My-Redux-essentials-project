import { Loader } from '@/common/components/Loader'
import { useAppDispatch } from '@/common/hooks/useAppDispatch'
import { useAppSelector } from '@/common/hooks/useAppSelector'
import { useEffect } from 'react'
import {
  fetchPosts,
  selectPostsStatus,
  selectSortedByDatePostIds,
} from '../../model/postsSlice'

import { Post } from './Post/Post'

export const Posts = () => {
  const dispatch = useAppDispatch()

  const postsStatus = useAppSelector(selectPostsStatus)

  const sortedPostIds = useAppSelector(selectSortedByDatePostIds)

  useEffect(() => {
    dispatch(fetchPosts())
  }, [])

  let content

  if (postsStatus === 'pending' && !sortedPostIds.length) {
    content = <Loader />
  } else if (postsStatus === 'pending' && sortedPostIds.length) {
    content = (
      <>
        <Loader />
        {sortedPostIds.map((postId) => (
          <Post key={postId} postId={postId} />
        ))}
      </>
    )
  } else {
    content = sortedPostIds.map((postId) => (
      <Post key={postId} postId={postId} />
    ))
  }

  return <div>{content}</div>
}
