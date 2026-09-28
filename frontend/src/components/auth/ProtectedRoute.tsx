import { Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useUserStore((s) => s.currentUser)
  const isAuthenticating = useUserStore((s) => s.isAuthenticating)
  const location = useLocation()

  if (isAuthenticating && !currentUser) {
    return (
      <div className="flex min-h-screen min-h-[100dvh] items-center justify-center">
        <p className="text-muted-foreground text-sm">Cargando sesión…</p>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
