import { UserDirectoryPage } from '@/components/users/UserDirectoryPage'
import { STAFF_ROLE_OPTIONS, type StaffRole } from '@/lib/roles'

export default function UsersPage() {
  return (
    <UserDirectoryPage
      title="Usuarios"
      subtitle="Gestión de usuarios del sistema"
      emptyMessage="No hay usuarios registrados."
      archivedEmptyMessage="No hay usuarios archivados."
      deleteModalTitle="Eliminar usuario"
      defaultRole={'staff' satisfies StaffRole}
      roleOptions={STAFF_ROLE_OPTIONS.filter((option) => option.value !== 'admin')}
    />
  )
}
