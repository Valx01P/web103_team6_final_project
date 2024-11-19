import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

const Protected = () => {
  const {isAuthenticated, isLoading} = useAppSelector((state) => state.auth)

  if (isLoading) {
    return <h1>Loading...</h1>
  }
  
  if (!isAuthenticated) {
    // if not authenticated, redirect to the /auth page for login/signup
    return <Navigate to="/auth" replace />
  }

  // if authenticated, render the nested routes
  return <Outlet />
}

export default Protected