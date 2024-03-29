import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5174
  },
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: '../../data/www/jettype-front-build',
  },
})
