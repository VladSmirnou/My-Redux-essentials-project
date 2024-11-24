import { logoutUser } from '@/features/auth/model/authSlice'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import {
  fetchNotifications,
  selectUnreadNotificationsCount,
} from '@/features/notifications/model/notificationSlice'
import { selectLoggerInUserName } from '@/features/users/model/usersSlice'

export const Navbar = () => {
  const dispatch = useAppDispatch()

  const loggedInUserName = useAppSelector(selectLoggerInUserName)
  const numUnreadNotifications = useAppSelector(selectUnreadNotificationsCount)

  const handleClick = () => dispatch(logoutUser())

  const fetchNewNotifications = () => dispatch(fetchNotifications())

  let unreadNotificationsBadge: React.ReactNode | undefined

  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = (
      <span className="badge">{numUnreadNotifications}</span>
    )
  }

  return loggedInUserName ? (
    <nav>
      <div className="navContent">
        <div className="navLinks">
          <Link to={'/'}>Posts</Link>
          <Link to={'/users'}>Users</Link>
          <Link to="/notifications">
            Notifications {unreadNotificationsBadge}
          </Link>
          <button className="button small" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>

        <div>
          <span style={{ color: 'white' }}>{loggedInUserName}</span>
          <button onClick={handleClick}>Logout</button>
        </div>
      </div>
    </nav>
  ) : null
}
