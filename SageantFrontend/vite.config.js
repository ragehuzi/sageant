import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // In dev the browser calls /api on this server, and Vite forwards it to the real API.
        // That avoids CORS. Default target is the local API; set VITE_API_TARGET in
        // .env.development.local to point dev at the Azure API instead.
        '/api': {
          target: env.VITE_API_TARGET || 'https://localhost:7232',
          changeOrigin: true,
          secure: false, // the local .NET dev certificate is self-signed
        },
      },
    },
  }
})
