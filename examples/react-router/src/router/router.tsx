import React, { PropsWithChildren } from 'react'

import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Welcome from './welcome/Welcome.tsx';
import Dashboard from './dashboard/Dashboard.tsx';
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Welcome />,
      errorElement: <h1>Error page</h1>,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
  ]);

const Router: React.FC<PropsWithChildren> = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default Router