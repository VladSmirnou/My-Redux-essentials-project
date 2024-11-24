import { useAppSelector } from '@/common/hooks/useAppSelector'
import { selectUserById } from '@/features/users/model/usersSlice'
import { Link } from 'react-router-dom'

type Props = {
  userId: string
}

export const User = (props: Props) => {
  const { userId } = props

  const user = useAppSelector((state) => selectUserById(state, userId))!

  return (
    <li>
      <Link to={`/users/${userId}`}>{user.name}</Link>
    </li>
  )
}
