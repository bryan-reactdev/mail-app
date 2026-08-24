export const CLIENT_ROLE = 'user' as const
export const ADMIN_ROLE = 'admin' as const

export const STAFF_ROLES = ['admin', 'supervisor', 'staff'] as const

export type StaffRole = (typeof STAFF_ROLES)[number]
export type UserRole = StaffRole | typeof CLIENT_ROLE

export const ALL_ROLES = [...STAFF_ROLES, CLIENT_ROLE] as const

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  supervisor: 'Supervisor',
  staff: 'Personal',
  user: 'Usuario',
}

export const STAFF_ROLE_OPTIONS: { value: StaffRole; label: string }[] = STAFF_ROLES.map(
  (role) => ({
    value: role,
    label: ROLE_LABELS[role],
  })
)

export function roleLabel(role?: string | null): string {
  if (!role) return 'Usuario'
  return ROLE_LABELS[role] ?? role
}

export function isClientRole(role?: string | null): boolean {
  return role === CLIENT_ROLE
}

export function isStaffRole(role?: string | null): boolean {
  return !!role && STAFF_ROLES.includes(role as StaffRole)
}

export function isAdminRole(role?: string | null): boolean {
  return role === 'admin'
}

export function getHomePathForRole(_role?: string | null): string {
  return '/dashboard'
}
