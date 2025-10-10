import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import './index.css'
import App from './App.tsx'
import '@mantine/core/styles.css'
import { Notifications } from '@mantine/notifications'

const theme = createTheme({
  primaryColor: 'green',
  colors: {
    green: [
      '#F1F8E9',  // Más sutil para fondos
      '#DCEDC8',
      '#C5E1A5',
      '#9CCC65',
      '#7CB342',
      '#558B2F',  // Color principal
      '#33691E',
      '#2E5A1C',  // Más oscuro para elementos importantes
      '#1B5E20',
      '#0A2F0A',  // Casi negro verdoso
    ],
  },
  defaultGradient: {
    from: '#558B2F',
    to: '#33691E',
    deg: 45,
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <App />
    </MantineProvider>
  </StrictMode>,
)
