import React from 'react'
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom';

import './App.scss'

import Layout from './layouts/layout';
import HomePage from './pages/homepage/homepage'
import ContactUs from './pages/contact/contact';

  

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <HomePage />
        },
        {
          path: '/contact',
          element: <ContactUs />
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App