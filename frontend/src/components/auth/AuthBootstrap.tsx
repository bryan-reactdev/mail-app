import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const authenticate = useUserStore((s) => s.authenticate)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/sso/callback') return
    void authenticate().catch(() => undefined)
  }, [authenticate, location.pathname])

  return children
}
