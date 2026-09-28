import { Navigate } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'
import { getHomePathForRole } from '@/lib/auth'

export function HomeRedirect() {
  const currentUser = useUserStore((s) => s.currentUser)
  const isAuthenticating = useUserStore((s) => s.isAuthenticating)

  if (isAuthenticating) {
    return (
      <div className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-[#1b1e27]">
        <p className="text-sm text-white/55">Cargando…</p>
      </div>
    )
  }

  if (currentUser) {
    return <Navigate to={getHomePathForRole(currentUser.role)} replace />
  }

  return <Navigate to="/login" replace />
}
