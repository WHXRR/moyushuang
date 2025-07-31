import { createBrowserRouter } from 'react-router-dom'
import WithSuspense from '@/components/WithSuspense'
import { lazy } from 'react'
import PrivateRoute from '@/components/PrivateRoute'

const Login = lazy(() => import('@/pages/Login'))
const Chatroom = lazy(() => import('@/pages/Chatroom'))
const Home = lazy(() => import('@/pages/Home'))
const NotFound = lazy(() => import('@/pages/404'))

export const routes = [
  {
    path: '/',
    element: <PrivateRoute>{WithSuspense(<Login />)}</PrivateRoute>,
  },
  {
    path: '/chatroom/:id',
    element: <PrivateRoute>{WithSuspense(<Chatroom />)}</PrivateRoute>,
  },
  {
    path: '/home',
    element: <PrivateRoute>{WithSuspense(<Home />)}</PrivateRoute>,
  },
  {
    path: '*',
    element: WithSuspense(<NotFound />),
  },
]

export const router = createBrowserRouter(routes)
