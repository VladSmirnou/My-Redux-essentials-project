import { PostMetadata } from '@/common/components/PostMetadata'
import { Reactions } from '@/common/components/Reactions'
import { useAppSelector } from '@/common/hooks/useAppSelector'
import { selectLoggedInUserId } from '@/features/auth/model/authSlice'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { selectPostById } from '../../model/selectors'
import { UpdatePostForm } from './UpdatePostForm/UpdatePostForm'

export const SinglePostPage = () => {
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  const { postId } = useParams<{ postId: string }>()

  const currentlyLoggedInUserId = useAppSelector(selectLoggedInUserId)

  const post = useAppSelector((state) => selectPostById(state, postId!))!

  const { content, title, user: userId, date, reactions } = post

  const hideUpdateFormHandler = () => {
    setShowUpdateForm(false)
  }

  const showUpdateFormHandler = () => {
    setShowUpdateForm(true)
  }

  const editButton =
    currentlyLoggedInUserId === post.user ? (
      <button onClick={showUpdateFormHandler}>edit post</button>
    ) : null

  return showUpdateForm ? (
    <UpdatePostForm
      postId={post.id}
      title={title}
      content={content}
      onFormClose={hideUpdateFormHandler}
    />
  ) : (
    <div>
      <h2>{title}</h2>
      <PostMetadata userId={userId} timestamp={date} showPrefix />
      <p>{content}</p>
      <Reactions reactions={reactions} />
      {editButton}
    </div>
  )
}
