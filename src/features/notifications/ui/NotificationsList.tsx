import { PostMetadata } from '@/common/components/PostMetadata'
import { useAppDispatch } from '@/common/hooks/useAppDispatch'
import { useAppSelector } from '@/common/hooks/useAppSelector'
import { useLayoutEffect } from 'react'
import {
  allNotificationsRead,
  selectAllNotifications,
} from '../model/notificationSlice'
import classnames from 'classnames'

export const NotificationsList = () => {
  const notifications = useAppSelector(selectAllNotifications)
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map((notification) => {
    const notificationClassname = classnames('notification', {
      new: notification.isNew,
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>
            <PostMetadata
              userId={notification.user}
              timestamp={notification.date}
            />
          </b>{' '}
          {notification.message}
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
