import useStore from '@/store'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface PrivateRouteProps {
  children: ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { userInfo } = useStore()
  const location = useLocation()

  if (!userInfo.token && location.pathname !== '/')
    return <Navigate to="/" replace />
  if (userInfo.token && location.pathname === '/')
    return <Navigate to="/home" replace />

  return <>{children}</>
}
