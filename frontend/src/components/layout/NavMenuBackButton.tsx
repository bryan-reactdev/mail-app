import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface NavMenuBackButtonProps {
  backTo: string | null
  onOpenMenu: () => void
  className?: string
}

const buttonClass = 'app-shell-nav-link !p-2'

function IconSlot({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none relative flex size-5 items-center justify-center">
      {children}
    </span>
  )
}

export function NavMenuBackButton({ backTo, onOpenMenu, className }: NavMenuBackButtonProps) {
  const isBack = Boolean(backTo)

  const icon = (
    <IconSlot>
      <AnimatePresence mode="wait" initial={false}>
        {isBack ? (
          <motion.span
            key="back"
            initial={{ opacity: 0, x: 6, rotate: 90 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -6, rotate: -90 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <ArrowLeft className="size-5" />
          </motion.span>
        ) : (
          <motion.span
            key="menu"
            initial={{ opacity: 0, x: -6, rotate: -90 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: 6, rotate: 90 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Menu className="size-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </IconSlot>
  )

  if (isBack) {
    return (
      <Link
        to={backTo!}
        className={cn(buttonClass, className)}
        aria-label="Volver"
      >
        {icon}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={cn(buttonClass, 'lg:hidden', className)}
      aria-label="Abrir menú"
      onClick={onOpenMenu}
    >
      {icon}
    </button>
  )
}
