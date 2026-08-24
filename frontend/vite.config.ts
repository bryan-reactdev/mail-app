import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function readBackendPort() {
  if (process.env.VITE_BACKEND_PORT) return process.env.VITE_BACKEND_PORT
  const envPath = path.resolve(__dirname, '../backend/.env')
  if (!fs.existsSync(envPath)) return '3005'
  const match = fs.readFileSync(envPath, 'utf8').match(/^PORT=(\d+)/m)
  return match?.[1] || '3005'
}

const backendTarget = `http://localhost:${readBackendPort()}`

function devHttps() {
  if (!process.env.HTTPS) return undefined
  const certPath = path.join(__dirname, '.dev-certs', 'cert.pem')
  const keyPath = path.join(__dirname, '.dev-certs', 'key.pem')
  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.warn('[vite] HTTPS=1 but missing .dev-certs — run: npm run gen-cert')
    return undefined
  }
  return {
    cert: fs.readFileSync(certPath, 'utf8'),
    key: fs.readFileSync(keyPath, 'utf8'),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 4175,
    strictPort: true,
    https: devHttps(),
    proxy: {
      // Avoid mixed content when frontend is HTTPS: proxy /api to backend (HTTP on same machine)
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/uploads': {
        target: backendTarget,
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 4175,
    strictPort: true,
  },
})
