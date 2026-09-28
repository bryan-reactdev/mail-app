#!/usr/bin/env node
/**
 * Generate a self-signed dev certificate for HTTPS testing on mobile/LAN.
 * Writes .dev-certs/cert.pem and .dev-certs/key.pem. Add .dev-certs/ to .gitignore.
 *
 * Run: npm run gen-cert
 * Then: npm run dev:https  (or HTTPS=1 npm run dev)
 */

import fs from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import { generate } from 'selfsigned'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, '.dev-certs')

function getLocalIPs() {
  const ips = new Set(['127.0.0.1', '::1'])
  const ifaces = os.networkInterfaces()
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) ips.add(iface.address)
      if (iface.family === 'IPv6' && !iface.internal) ips.add(iface.address)
    }
  }
  return [...ips]
}

async function main() {
  const altNames = [
    { type: 2, value: 'localhost' },
    { type: 7, ip: '127.0.0.1' },
    { type: 7, ip: '::1' },
    ...getLocalIPs().map((ip) => ({ type: 7, ip })),
  ]

  const pems = await generate(
    [{ name: 'commonName', value: 'MailApp Dev' }],
    {
      keySize: 2048,
      days: 365,
      algorithm: 'sha256',
      extensions: [
        { name: 'basicConstraints', cA: false },
        { name: 'keyUsage', digitalSignature: true, keyEncipherment: true },
        { name: 'extKeyUsage', serverAuth: true },
        { name: 'subjectAltName', altNames },
      ],
    }
  )

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'cert.pem'), pems.cert)
  fs.writeFileSync(path.join(outDir, 'key.pem'), pems.private)
  console.log('Wrote .dev-certs/cert.pem and .dev-certs/key.pem')
  const ips = getLocalIPs().filter((ip) => ip !== '127.0.0.1' && ip !== '::1')
  if (ips.length) console.log('LAN IPs in cert:', ips.join(', '))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
