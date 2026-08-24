import { Navigate } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'
import { getHomePathForRole } from '@/lib/auth'

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useUserStore((s) => s.currentUser)
  const isAuthenticating = useUserStore((s) => s.isAuthenticating)

  if (isAuthenticating) {
    return (
      <div className="flex min-h-screen min-h-[100dvh] items-center justify-center">
        <p className="text-muted-foreground text-sm">Cargando…</p>
      </div>
    )
  }

  if (currentUser) {
    return <Navigate to={getHomePathForRole(currentUser.role)} replace />
  }

  return children
}
