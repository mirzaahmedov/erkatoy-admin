import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '../store'

export const AuthGuard = () => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />
}
