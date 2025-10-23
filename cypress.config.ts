import { defineConfig } from 'cypress'

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  scrollBehavior: 'center',

  e2e: {
    baseUrl: 'http://localhost:5173',
  },
})