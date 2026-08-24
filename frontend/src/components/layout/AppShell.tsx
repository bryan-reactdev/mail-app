import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { isClientRole } from '@/lib/roles'
import { useUserStore } from '@/stores/useUserStore'
import { SidebarProvider, useSidebar } from '@/context/SidebarContext'
import { PageMetaProvider } from '@/context/PageMetaContext'
import { AppBackground } from '@/components/layout/AppBackground'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { AppSidebar } from '@/components/layout/AppSidebar'

function contentMaxWidth(pathname: string) {
  if (pathname === '/dashboard') return 'max-w-7xl'
  return 'max-w-5xl'
}

function AppShellInner() {
  const { collapsed } = useSidebar()
  const location = useLocation()
  const currentUser = useUserStore((s) => s.currentUser)
  const isClient = isClientRole(currentUser?.role)
  const maxWidthClass = contentMaxWidth(location.pathname)

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-background">
      <AppBackground />

      {!isClient ? <AppSidebar /> : null}
      <AppNavbar />

      <main
        className={cn(
          'relative z-10 transition-[padding] duration-350 ease-[cubic-bezier(0.21,0.47,0.32,0.98)]',
          'pt-[calc(5.25rem+env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]',
          isClient ? 'lg:pl-0' : collapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={cn(
              'will-change-[transform,opacity]',
              'mx-auto w-full px-4 sm:px-6 lg:px-8',
              maxWidthClass
            )}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export function AppShell() {
  return (
    <SidebarProvider>
      <PageMetaProvider>
        <AppShellInner />
      </PageMetaProvider>
    </SidebarProvider>
  )
}
