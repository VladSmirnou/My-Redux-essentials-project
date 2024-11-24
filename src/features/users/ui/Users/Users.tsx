import { useAppSelector } from '@/common/hooks/useAppSelector'
import { User } from './User/User'
import { selectUserIds } from '../../model/usersSlice'

export const Users = () => {
  const userIds = useAppSelector(selectUserIds)

  const JSXUsers = userIds.map((userId) => {
    return <User key={userId} userId={userId} />
  })

  return (
    <div>
      <ul>{JSXUsers}</ul>
    </div>
  )
}
