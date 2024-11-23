import { useAppSelector } from '@/common/hooks/useAppSelector'
import { selectUserPosts } from '@/features/posts/model/selectors'
import { Link, useParams } from 'react-router-dom'
import { selectUserById } from '../../model/selectors'

export const SingleUserPage = () => {
  const { userId } = useParams<{ userId: string }>()
  const user = useAppSelector((state) => selectUserById(state, userId!))!
  const userPosts = useAppSelector((state) => selectUserPosts(state, user.id))

  const JSXUserPosts = userPosts.map((post) => {
    return (
      <li key={post.id}>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </li>
    )
  })
  return (
    <div>
      <h2>{user.name}</h2>
      <ul>{JSXUserPosts}</ul>
    </div>
  )
}
