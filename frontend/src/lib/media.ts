import { API_BASE_IP } from '@/util/axiosWrapper'

export function mediaUrl(path?: string | null): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path

  const base = API_BASE_IP
  if (base.startsWith('http')) {
    return `${base.replace(/\/$/, '')}${path}`
  }

  return path
}
