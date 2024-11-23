import { Outlet } from 'react-router-dom'
import { Header } from '../common/components/Header'

export const App = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
