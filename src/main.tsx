import React from 'react'
import { createRoot } from 'react-dom/client'

import { worker } from './api/server'

import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { appRouter } from './app/appRouter'
import { store } from './app/store'
import './index.css'
import './primitiveui.css'
import { fetchUsers } from './features/users/model/usersSlice'

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: 'bypass' })

  const root = createRoot(document.getElementById('root')!)

  store.dispatch(fetchUsers())

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={appRouter} />
      </Provider>
    </React.StrictMode>,
  )
}

start()
