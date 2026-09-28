import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Mail } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import './AuthNavbar.css'

const navEase = [0.21, 0.47, 0.32, 0.98] as const

export function AuthNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`auth-navbar ${scrolled ? 'auth-navbar-scrolled' : ''}`}
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: navEase }}
    >
      <div className="auth-navbar-inner">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: navEase }}
        >
          <Link to="/login" className="auth-navbar-brand">
            <span className="auth-navbar-brand-icon">
              <Mail className="size-4 text-white" />
            </span>
            <span className="auth-navbar-brand-text">Mail App</span>
          </Link>
        </motion.div>

        <motion.div
          className="auth-navbar-actions"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: navEase }}
        >
          <ThemeToggle />
          <Link to="/login" className="auth-navbar-link hidden sm:inline-flex">
            Iniciar sesión
          </Link>
          <Link to="/register" className="auth-navbar-signup">
            Registrarse
          </Link>
        </motion.div>
      </div>
    </motion.header>
  )
}
