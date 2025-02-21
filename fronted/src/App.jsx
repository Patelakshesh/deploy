import React, { Children, useState } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import ChangePassword from './pages/ChangePassword'
import FaqManagement from './pages/FaqManagement'

const PrivateRoute = ({children}) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to={'/login'}/>
}

export default function App() {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <PrivateRoute><FaqManagement/> </PrivateRoute>
    },
    {
      path: '/login',
      element: <LoginPage/>
    },
    {
      path: '/register',
      element: <RegisterPage/>
    },
    {
      path: '/changepassword',
      element: <ChangePassword/>
    }
  ])
  return (
    <>
    <RouterProvider router={appRouter}/>
    </>
  )
}
