#!/usr/bin/env node
/**
 * Start Vite with HTTPS for local testing (e.g. mobile devices on LAN).
 * Uses /api proxy to backend (avoids mixed content). Reads backend PORT from backend/.env.
 */
import { readFileSync, existsSync } from 'fs'
import { spawn, spawnSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const frontendRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(frontendRoot, '..')

function readBackendPort() {
  const envPath = path.join(repoRoot, 'backend', '.env')
  if (!existsSync(envPath)) return '3005'
  const match = readFileSync(envPath, 'utf8').match(/^PORT=(\d+)/m)
  return match?.[1] || '3005'
}

const ensure = spawnSync('node', ['scripts/ensure-dev-cert.js'], {
  cwd: frontendRoot,
  stdio: 'inherit',
})
if (ensure.status !== 0) process.exit(ensure.status ?? 1)

const port = readBackendPort()
const child = spawn('vite', [], {
  cwd: frontendRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    HTTPS: '1',
    VITE_API_URL: '/api',
    VITE_BACKEND_PORT: port,
  },
  shell: true,
})

child.on('exit', (code) => process.exit(code ?? 0))
