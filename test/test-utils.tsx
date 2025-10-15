import { render as rtlRender } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

export function render(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route)

  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        <MantineProvider>
          {children}
        </MantineProvider>
      </BrowserRouter>
    ),
  })
}

export function mockLocalStorage() {
  const store: { [key: string]: string } = {}
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
  }
}

export * from '@testing-library/react'
