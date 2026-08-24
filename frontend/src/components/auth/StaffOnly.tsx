import { Navigate } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'
import { getHomePathForRole, isClientRole } from '@/lib/auth'

export function StaffOnly({ children }: { children: React.ReactNode }) {
  const currentUser = useUserStore((s) => s.currentUser)

  if (currentUser && isClientRole(currentUser.role)) {
    return <Navigate to={getHomePathForRole(currentUser.role)} replace />
  }

  return children
}
