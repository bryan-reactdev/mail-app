import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'
import { isAdmin } from '@/lib/auth'
import { ProtectedRoute } from './ProtectedRoute'

export function AdminRoute({ children }: { children?: React.ReactNode }) {
  const currentUser = useUserStore((s) => s.currentUser)

  return (
    <ProtectedRoute>
      {currentUser && isAdmin(currentUser.role) ? (
        children ?? <Outlet />
      ) : (
        <Navigate to="/dashboard" replace />
      )}
    </ProtectedRoute>
  )
}
