import { Loader2, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UserFormModal } from '@/components/users/UserFormModal'
import { Button } from '@/components/ui/button'
import {
  GlobalModal,
  GlobalModalDescription,
  GlobalModalFooter,
  GlobalModalHeader,
  GlobalModalTitle,
} from '@/components/ui/GlobalModal'
import { mediaUrl } from '@/lib/media'
import { isAdminRole, isStaffRole, roleLabel, type StaffRole } from '@/lib/roles'
import { useUserStore } from '@/stores/useUserStore'
import type { User } from '@/types/entities'

interface RoleOption {
  value: StaffRole
  label: string
}

interface UserDirectoryPageProps {
  title: string
  subtitle: string
  emptyMessage: string
  archivedEmptyMessage: string
  deleteModalTitle: string
  defaultRole: StaffRole
  roleOptions: RoleOption[]
}

export function UserDirectoryPage({
  title = 'Usuarios',
  subtitle,
  emptyMessage,
  archivedEmptyMessage,
  deleteModalTitle,
  defaultRole,
  roleOptions,
}: UserDirectoryPageProps) {
  const {
    users,
    archivedUsers,
    getUsers,
    getArchivedUsers,
    createUser,
    updateUser,
    archiveUser,
    restoreUser,
    isFetchingUsers,
    isFetchingArchivedUsers,
    isCreatingUser,
    isUpdatingUser,
    isArchivingUser,
    isRestoringUser,
  } = useUserStore()

  const [showArchived, setShowArchived] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [restoreConfirmId, setRestoreConfirmId] = useState<number | null>(null)

  const isSaving = isCreatingUser || isUpdatingUser || isArchivingUser || isRestoringUser
  const isLoading = showArchived ? isFetchingArchivedUsers : isFetchingUsers

  useEffect(() => {
    getUsers()
    getArchivedUsers()
  }, [getUsers, getArchivedUsers])

  const filteredUsers = useMemo(() => users.filter((u) => isStaffRole(u.role)), [users])
  const filteredArchived = useMemo(
    () => archivedUsers.filter((u) => isStaffRole(u.role)),
    [archivedUsers]
  )
  const visibleUsers = showArchived ? filteredArchived : filteredUsers
  const restoreTarget = archivedUsers.find((u) => u.id === restoreConfirmId)

  const handleCreate = async (formData: FormData) => createUser(formData)

  const handleEdit = async (formData: FormData) => {
    if (!editTarget) return false
    return updateUser(editTarget.id, formData)
  }

  const handleDelete = async () => {
    if (!deleteConfirmId || isArchivingUser) return
    const ok = await archiveUser(deleteConfirmId)
    if (ok) {
      setDeleteConfirmId(null)
      getArchivedUsers()
    }
  }

  const handleRestore = async () => {
    if (!restoreConfirmId || isRestoringUser) return
    const ok = await restoreUser(restoreConfirmId)
    if (ok) setRestoreConfirmId(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-2">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {showArchived ? 'Archivados' : subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showArchived ? (
            <Button size="sm" variant="outline" onClick={() => setShowArchived(false)}>
              Activos
            </Button>
          ) : (
            <>
              {filteredArchived.length > 0 && (
                <Button size="sm" variant="outline" onClick={() => setShowArchived(true)}>
                  Archivados ({filteredArchived.length})
                </Button>
              )}
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                Nuevo
              </Button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando…</p>
      ) : visibleUsers.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {showArchived ? archivedEmptyMessage : emptyMessage}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-muted-foreground w-10 px-3 py-2.5 text-left text-xs font-medium">#</th>
                <th className="text-muted-foreground px-3 py-2.5 text-left text-xs font-medium">Nombre</th>
                <th className="text-muted-foreground px-3 py-2.5 text-left text-xs font-medium">Rol</th>
                <th className="text-muted-foreground px-3 py-2.5 text-left text-xs font-medium">Teléfono</th>
                <th className="text-muted-foreground px-3 py-2.5 text-left text-xs font-medium">Email</th>
                {showArchived && (
                  <th className="text-muted-foreground px-3 py-2.5 text-left text-xs font-medium">Archivado</th>
                )}
                <th className="text-muted-foreground px-3 py-2.5 text-right text-xs font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user, index) => {
                const thumb = mediaUrl(user.profilePhotoThumb ?? user.profilePhoto)
                const displayName =
                  user.fullName ?? `${user.firstName} ${user.lastName}`.trim()
                return (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="text-muted-foreground px-3 py-2.5 tabular-nums">{index + 1}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-muted flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border">
                          {thumb ? (
                            <img src={thumb} alt="" className="size-full object-cover" />
                          ) : (
                            <UserRound className="text-muted-foreground size-4" />
                          )}
                        </div>
                        <span className="font-medium">{displayName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">{roleLabel(user.role)}</td>
                    <td className="text-muted-foreground px-3 py-2.5">{user.phone ?? '—'}</td>
                    <td className="text-muted-foreground px-3 py-2.5">{user.email ?? '—'}</td>
                    {showArchived && (
                      <td className="text-muted-foreground px-3 py-2.5">
                        {user.archivedAt
                          ? new Date(user.archivedAt).toLocaleDateString('es')
                          : '—'}
                      </td>
                    )}
                    <td className="px-3 py-2.5">
                      <div className="flex justify-end gap-1.5">
                        {showArchived ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isSaving}
                            onClick={() => setRestoreConfirmId(user.id)}
                          >
                            Restaurar
                          </Button>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => setEditTarget(user)}>
                              Editar
                            </Button>
                            {!isAdminRole(user.role) && (
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={isSaving}
                                onClick={() => setDeleteConfirmId(user.id)}
                              >
                                Eliminar
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <UserFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        saving={isCreatingUser}
        roleOptions={roleOptions}
        defaultRole={defaultRole}
        onSubmit={handleCreate}
      />

      <UserFormModal
        open={editTarget !== null}
        onOpenChange={(open) => !open && setEditTarget(null)}
        mode="edit"
        initialUser={editTarget}
        saving={isUpdatingUser}
        roleOptions={roleOptions}
        defaultRole={defaultRole}
        onSubmit={handleEdit}
      />

      <GlobalModal
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        size="sm"
        preventClose={isArchivingUser}
      >
        <GlobalModalHeader>
          <GlobalModalTitle className="text-destructive">{deleteModalTitle}</GlobalModalTitle>
          <GlobalModalDescription>
            El usuario será suspendido y no podrá ingresar. Podrás restaurarlo desde Archivados.
          </GlobalModalDescription>
        </GlobalModalHeader>
        <GlobalModalFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteConfirmId(null)}
            disabled={isArchivingUser}
            className="rounded-xl"
          >
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isArchivingUser} className="rounded-xl gap-2">
            {isArchivingUser ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Eliminando…
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </GlobalModalFooter>
      </GlobalModal>

      <GlobalModal
        open={restoreConfirmId !== null}
        onOpenChange={(open) => !open && setRestoreConfirmId(null)}
        size="sm"
        preventClose={isRestoringUser}
      >
        <GlobalModalHeader>
          <GlobalModalTitle>Restaurar usuario</GlobalModalTitle>
          <GlobalModalDescription>
            ¿Restaurar a {restoreTarget?.fullName ?? restoreTarget?.firstName}? Podrá volver a ingresar.
          </GlobalModalDescription>
        </GlobalModalHeader>
        <GlobalModalFooter>
          <Button
            variant="outline"
            onClick={() => setRestoreConfirmId(null)}
            disabled={isRestoringUser}
            className="rounded-xl"
          >
            Cancelar
          </Button>
          <Button onClick={handleRestore} disabled={isRestoringUser} className="rounded-xl gap-2">
            {isRestoringUser ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Restaurando…
              </>
            ) : (
              'Restaurar'
            )}
          </Button>
        </GlobalModalFooter>
      </GlobalModal>
    </div>
  )
}
