import { selectUserById } from '@/features/users/model/usersSlice'
import { useAppSelector } from '../hooks/useAppSelector'
import { parseISO, formatDistanceToNow } from 'date-fns'

type Props = {
  userId: string
  timestamp: string
  showPrefix?: boolean
}

export const PostMetadata = (props: Props) => {
  const { userId, timestamp, showPrefix } = props
  const date = parseISO(timestamp)
  const timePeriod = formatDistanceToNow(date)
  const timeAgo = `${timePeriod} ago`

  const user = useAppSelector((state) => selectUserById(state, userId))!

  return (
    <>
      <span>
        {showPrefix ? 'by ' : null} {user.name}
      </span>
      <time dateTime={timestamp} title={timestamp}>
        &nbsp; <i>{timeAgo}</i>
      </time>
    </>
  )
}
