import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5174,

    proxy: {
      '/api/v1': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        ws: true,
      },
    }
  },
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: '../../data/www/jettype-front-build',
  },
})
