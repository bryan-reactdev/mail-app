#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', '.dev-certs')

if (!fs.existsSync(path.join(outDir, 'cert.pem')) || !fs.existsSync(path.join(outDir, 'key.pem'))) {
  console.log('No dev certs found, generating...')
  const result = spawnSync('node', ['scripts/gen-dev-cert.js'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}
