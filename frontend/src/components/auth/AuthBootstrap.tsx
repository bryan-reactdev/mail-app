import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const authenticate = useUserStore((s) => s.authenticate)
  const { pathname } = useLocation()
  const initialPathRef = useRef(pathname)

  useEffect(() => {
    if (initialPathRef.current === '/sso/callback') return
    void authenticate().catch(() => undefined)
  }, [authenticate])

  return children
}
