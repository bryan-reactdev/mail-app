import type { LucideIcon } from 'lucide-react'
import { LayoutDashboard, UserCircle, Users } from 'lucide-react'
import { isAdminRole, isClientRole } from '@/lib/roles'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  description?: string
  adminOnly?: boolean
  clientOnly?: boolean
  disabled?: boolean
  badge?: string
}

export interface NavSection {
  label: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    label: 'Principal',
    items: [
      { title: 'Panel', href: '/dashboard', icon: LayoutDashboard, description: 'Resumen y accesos rápidos' },
    ],
  },
  {
    label: 'Administración',
    items: [
      {
        title: 'Usuarios',
        href: '/dashboard/usuarios',
        icon: Users,
        adminOnly: true,
        description: 'Gestión de usuarios del sistema',
      },
    ],
  },
  {
    label: 'Cuenta',
    items: [
      { title: 'Mi perfil', href: '/dashboard/perfil', icon: UserCircle, description: 'Tu información personal' },
    ],
  },
]

export function filterNavSections(role?: string | null): NavSection[] {
  const admin = isAdminRole(role)
  const client = isClientRole(role)

  if (client) return []

  return navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.adminOnly && !admin) return false
        if (item.clientOnly && !client) return false
        return true
      }),
    }))
    .filter((section) => section.items.length > 0)
}

export function isNavItemActive(href: string, pathname: string): boolean {
  if (href === '#') return false
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname === href || pathname.startsWith(`${href}/`)
}
