import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Mail, ChevronDown, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScroll } from '@/hooks/useScroll'
import { useSidebar } from '@/context/SidebarContext'
import { usePageMeta } from '@/context/PageMetaContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { NavMenuBackButton } from '@/components/layout/NavMenuBackButton'
import { useUserStore } from '@/stores/useUserStore'
import { isClientRole, getHomePathForRole } from '@/lib/auth'
import './app-shell.css'

export function AppNavbar() {
  const scrolled = useScroll(8)
  const { collapsed, setMobileOpen } = useSidebar()
  const { title, description, backTo } = usePageMeta()
  const navigate = useNavigate()
  const currentUser = useUserStore((s) => s.currentUser)
  const logout = useUserStore((s) => s.logout)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isClient = isClientRole(currentUser?.role)
  const homePath = getHomePathForRole(currentUser?.role)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate('/')
  }

  const sidebarOffset = isClient ? '' : collapsed ? 'lg:pl-[84px]' : 'lg:pl-[272px]'

  return (
    <header
      className={cn(
        'pointer-events-none fixed left-0 right-0 top-0 z-30',
        'pt-[calc(12px+env(safe-area-inset-top))] pr-4 pl-4',
        sidebarOffset
      )}
      role="banner"
    >
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={cn(
          'app-glass-panel pointer-events-auto flex h-14 items-center gap-3 rounded-2xl px-3 sm:px-4',
          scrolled && 'app-glass-panel-scrolled'
        )}
      >
        {!isClient ? (
          <NavMenuBackButton backTo={backTo} onOpenMenu={() => setMobileOpen(true)} />
        ) : null}

        <Link to={homePath} className="app-shell-brand hidden shrink-0 sm:flex">
          <span className="app-shell-brand-icon">
            <Mail className="size-4 text-primary" />
          </span>
          <span className="app-shell-brand-text hidden md:inline">Mail App</span>
        </Link>

        <div className="hidden h-5 w-px bg-border/50 sm:block dark:bg-white/10" />

        <div className="min-w-0 flex-1">
          <motion.p
            key={title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-[0.9375rem]"
          >
            {title}
          </motion.p>
          {description ? (
            <motion.p
              key={description}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="truncate text-[0.6875rem] text-muted-foreground sm:text-xs"
            >
              {description}
            </motion.p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <ThemeToggle />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className={cn(
                'app-shell-nav-link border border-transparent',
                menuOpen && 'app-shell-nav-link-active border-border/40 dark:border-white/10'
              )}
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="size-4" />
              </span>
              <span className="hidden max-w-[7rem] truncate md:inline">
                {currentUser?.firstName}
              </span>
              <ChevronDown
                className={cn(
                  'size-4 text-muted-foreground transition-transform duration-300',
                  menuOpen && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                  role="menu"
                  className="app-shell-menu absolute right-0 top-[calc(100%+0.5rem)] z-50 w-52 p-1.5"
                >
                  {!isClient ? (
                    <Link
                      to="/dashboard/perfil"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="app-shell-menu-item text-foreground"
                    >
                      <User className="size-4 text-muted-foreground" />
                      Mi perfil
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="app-shell-menu-item text-destructive"
                  >
                    <LogOut className="size-4" />
                    Cerrar sesión
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </header>
  )
}
