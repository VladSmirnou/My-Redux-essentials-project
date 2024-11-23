import { LoginPage } from '@/features/auth/ui/LoginPage'
import { SinglePostPage } from '@/features/posts/ui/SinglePostPage/SinglePostPage'
import { SingleUserPage } from '@/features/users/ui/SingleUserPage/SingleUserPage'
import { Users } from '@/features/users/ui/Users/Users'
import { createBrowserRouter } from 'react-router-dom'
import { App } from './App'
import { Main } from './Main'
import { ProtectedRoute } from './ProtectedRoute'
import { NotificationsList } from '@/features/notifications/ui/NotificationsList'

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Main />,
          },
          {
            path: 'posts/:postId',
            element: <SinglePostPage />,
          },
          {
            path: 'users',
            element: <Users />,
          },
          {
            path: 'users/:userId',
            element: <SingleUserPage />,
          },
          {
            path: 'notifications',
            element: <NotificationsList />,
          },
        ],
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
])
