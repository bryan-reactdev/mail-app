import { roleLabel } from '@/lib/auth'
import { isAdminRole } from '@/lib/roles'
import { isNavItemActive, navSections } from '@/lib/navigation'
import type { User } from '@/types/entities'

export interface PageMeta {
  title: string
  description: string
  backTo: string | null
}

function getBackTo(pathname: string): string | null {
  if (pathname === '/dashboard') return null
  if (pathname.startsWith('/dashboard/')) return '/dashboard'
  return null
}

export function resolvePageMeta(pathname: string, user?: User | null): PageMeta {
  if (pathname === '/dashboard') {
    return {
      title: isAdminRole(user?.role) ? 'Panel principal' : 'Mi panel',
      description: user ? `${user.firstName} · ${roleLabel(user.role)}` : '',
      backTo: null,
    }
  }

  for (const section of navSections) {
    for (const item of section.items) {
      if (isNavItemActive(item.href, pathname)) {
        return {
          title: item.title,
          description: item.description ?? '',
          backTo: getBackTo(pathname),
        }
      }
    }
  }

  return {
    title: 'Mail App',
    description: '',
    backTo: null,
  }
}
