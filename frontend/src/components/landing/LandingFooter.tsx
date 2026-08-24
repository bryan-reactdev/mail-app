import { Link } from 'react-router-dom'
import { LayoutDashboard, Mail } from 'lucide-react'
import './LandingFooter.css'

const navLinks = [
  { label: 'Características', href: '/#features' },
  { label: 'Acerca de', href: '/#about' },
] as const

const portalLinks = [
  { label: 'Iniciar sesión', to: '/login' },
  { label: 'Crear cuenta', to: '/register' },
] as const

export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer id="about" className="landing-footer">
      <div className="landing-footer-inner">
        <div className="landing-footer-top">
          <div className="landing-footer-brand">
            <Link to="/" className="landing-footer-brand-link">
              <span className="landing-footer-brand-icon">
                <LayoutDashboard className="size-4 text-white" />
              </span>
              <span className="landing-footer-brand-text">Base App</span>
            </Link>
            <p className="landing-footer-tagline">
              Plantilla base con autenticación, panel y gestión de usuarios.
            </p>
          </div>

          <div className="landing-footer-columns">
            <div>
              <p className="landing-footer-col-title">Navegación</p>
              <ul className="landing-footer-links">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="landing-footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="landing-footer-col-title">Portal</p>
              <ul className="landing-footer-links">
                {portalLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="landing-footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="landing-footer-col-title">Contacto</p>
              <ul className="landing-footer-links">
                <li>
                  <div className="landing-footer-contact-item">
                    <Mail className="size-3.5" />
                    <a href="mailto:hello@example.com">hello@example.com</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <p className="landing-footer-copy">
            © {year} Base App. Todos los derechos reservados.
          </p>
          <ul className="landing-footer-legal">
            <li>
              <a href="#">Aviso de privacidad</a>
            </li>
            <li>
              <a href="#">Términos de uso</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
