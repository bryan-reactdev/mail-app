import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 4173,
    host: true,
    allowedHosts: ['domain.com', 'www.domain.com'],
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: ['domain.com', 'www.domain.com'],
  },
})
