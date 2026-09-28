import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, Lock, LockOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/context/SidebarContext'
import { filterNavSections, isNavItemActive, type NavItem } from '@/lib/navigation'
import { useUserStore } from '@/stores/useUserStore'
import { BorderBeam } from '@/components/magicui/border-beam'
import './app-shell.css'

function NavTooltip({
  label,
  show,
  top,
  left,
}: {
  label: string
  show: boolean
  top: number
  left: number
}) {
  if (!show) return null
  return (
    <span
      role="tooltip"
      className="app-shell-menu pointer-events-none fixed z-50 -translate-y-1/2 whitespace-nowrap px-2.5 py-1 text-xs font-medium"
      style={{ top, left }}
    >
      {label}
    </span>
  )
}

function SidebarLink({
  item,
  collapsed,
  index,
}: {
  item: NavItem
  collapsed: boolean
  index: number
}) {
  const location = useLocation()
  const active = isNavItemActive(item.href, location.pathname)
  const Icon = item.icon
  const [hovered, setHovered] = useState(false)
  const linkRef = useRef<HTMLDivElement>(null)
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null)

  const updateTooltipPos = () => {
    if (!linkRef.current) return
    const rect = linkRef.current.getBoundingClientRect()
    setTooltipPos({ top: rect.top + rect.height / 2, left: rect.right + 12 })
  }

  const content = (
    <motion.div
      ref={linkRef}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative"
      onMouseEnter={() => {
        setHovered(true)
        updateTooltipPos()
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          'group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-200',
          item.disabled && 'cursor-not-allowed opacity-45',
          !item.disabled && !active && 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground dark:hover:bg-white/[0.06] dark:hover:text-white/90',
          active && 'app-shell-nav-link-active'
        )}
      >
        {active && <BorderBeam size={120} duration={10} borderWidth={1} />}
        <span
          className={cn(
            'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
            active
              ? 'app-shell-icon-active'
              : 'bg-foreground/[0.04] text-muted-foreground group-hover:scale-105 group-hover:text-foreground dark:bg-white/[0.06]'
          )}
        >
          <Icon className={cn('size-[1.1rem]', active && 'scale-105')} />
        </span>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="relative z-10 flex flex-1 items-center justify-between overflow-hidden whitespace-nowrap"
            >
              <span>{item.title}</span>
              {item.badge ? (
                <span className="rounded-full border border-border/50 bg-foreground/[0.04] px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-muted-foreground dark:border-white/10 dark:bg-white/[0.06]">
                  {item.badge}
                </span>
              ) : null}
            </motion.span>
          )}
        </AnimatePresence>
        {active && !collapsed && (
          <motion.span
            layoutId="sidebar-active-pill"
            className="sidebar-active-pill absolute right-2 size-1.5 rounded-full"
          />
        )}
      </div>
      <NavTooltip
        label={item.title}
        show={collapsed && hovered}
        top={tooltipPos?.top ?? 0}
        left={tooltipPos?.left ?? 0}
      />
    </motion.div>
  )

  if (item.disabled) {
    return content
  }

  return (
    <Link to={item.href} aria-current={active ? 'page' : undefined} className="block outline-none">
      {content}
    </Link>
  )
}

function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const currentUser = useUserStore((s) => s.currentUser)
  const sections = filterNavSections(currentUser?.role)

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[4.5rem] shrink-0 items-center gap-3 border-b border-border/40 px-4 dark:border-white/[0.06]">
        <span className="app-shell-brand-icon shrink-0">
          <Mail className="size-4 text-primary" />
        </span>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="min-w-0"
            >
              <p className="app-shell-brand-text truncate">Mail App</p>
              <p className="truncate text-[0.7rem] text-muted-foreground">Panel</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="min-h-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto px-2.5 py-4" aria-label="Sidebar">
        {sections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-2 px-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                {section.label}
              </p>
            )}
            {collapsed && <div className="mx-auto mb-3 h-px w-8 bg-border/50 dark:bg-white/10" />}
            <div className="space-y-0.5">
              {section.items.map((item, i) => (
                <div key={item.title} onClick={onNavigate}>
                  <SidebarLink item={item} collapsed={collapsed} index={i} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}

export function AppSidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar()
  const desktopRef = useRef<HTMLElement>(null)
  const [hoverExpanded, setHoverExpanded] = useState(false)

  const effectiveCollapsed = collapsed && !hoverExpanded

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setMobileOpen])

  const sidebarSurfaceClass = cn(
    'app-glass-panel border-r pt-[env(safe-area-inset-top)] backdrop-blur-xl',
    'border-border/40 dark:border-white/[0.06]'
  )

  return (
    <>
      <motion.aside
        ref={desktopRef}
        onMouseEnter={() => collapsed && setHoverExpanded(true)}
        onMouseLeave={() => setHoverExpanded(false)}
        animate={{ width: effectiveCollapsed ? 72 : 260 }}
        transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={cn(
          'fixed left-0 top-0 z-40 hidden h-screen lg:block',
          sidebarSurfaceClass
        )}
        aria-label="Navegación lateral"
      >
        <SidebarContent collapsed={effectiveCollapsed} />
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expandir sidebar' : 'Fijar sidebar colapsado'}
          className="app-glass-panel absolute -right-3 top-[4.75rem] z-50 flex size-6 items-center justify-center rounded-full text-muted-foreground transition-transform hover:scale-110 hover:text-foreground"
        >
          {collapsed ? (
            <LockOpen className="size-3.5" aria-hidden />
          ) : (
            <Lock className="size-3.5" aria-hidden />
          )}
        </button>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              className={cn(
                'fixed left-0 top-0 z-50 h-screen w-[min(280px,88vw)] lg:hidden',
                sidebarSurfaceClass,
                'app-glass-panel-scrolled'
              )}
            >
              <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
