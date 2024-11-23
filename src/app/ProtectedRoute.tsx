import { useAppSelector } from '@/common/hooks/useAppSelector'
import { selectLoggedInUserId } from '@/features/auth/model/authSlice'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const loggedInUserId = useAppSelector(selectLoggedInUserId)
  return loggedInUserId ? <Outlet /> : <Navigate to={'login'} />
}
