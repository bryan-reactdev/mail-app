import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import './LandingNavbar.css'

const navEase = [0.21, 0.47, 0.32, 0.98] as const

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`landing-navbar ${scrolled ? 'landing-navbar-scrolled' : ''}`}
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: navEase }}
    >
      <div className="landing-navbar-inner">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: navEase }}
        >
          <Link to="/" className="landing-navbar-brand">
            <span className="landing-navbar-brand-icon">
              <LayoutDashboard className="size-4 text-white" />
            </span>
            <span className="landing-navbar-brand-text">Base App</span>
          </Link>
        </motion.div>

        <motion.nav
          className="landing-navbar-links"
          aria-label="Landing"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: navEase }}
        >
          <a href="/#features" className="landing-navbar-link">
            Características
          </a>
          <a href="/#about" className="landing-navbar-link">
            Acerca
          </a>
        </motion.nav>

        <motion.div
          className="landing-navbar-actions"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: navEase }}
        >
          <ThemeToggle />
          <Link to="/login" className="landing-navbar-link hidden sm:inline-flex">
            Iniciar sesión
          </Link>
          <Link to="/register" className="landing-navbar-signup">
            Registrarse
          </Link>
        </motion.div>
      </div>
    </motion.header>
  )
}
