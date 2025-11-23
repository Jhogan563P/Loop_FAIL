import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import { RouterProvider } from 'react-router'
import ControlContextProvider from './context/ControlContexProvider'
import { routes } from './router/routes'
import PlayerProvider from './context/PlayContextProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ControlContextProvider>
      <PlayerProvider>
        <RouterProvider router={routes}/>
      </PlayerProvider>
    </ControlContextProvider>
  </StrictMode>,
)
