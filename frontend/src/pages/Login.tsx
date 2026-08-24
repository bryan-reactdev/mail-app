import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { AuthCard } from '@/components/auth/AuthCard'
import {
  AuthPageLayout,
  authInputClass,
  authLabelClass,
  authSubmitClass,
} from '@/components/auth/AuthPageLayout'
import { BlurFadeItem, BlurFadeStagger } from '@/components/magicui/blur-fade'
import { useUserStore } from '@/stores/useUserStore'
import { getHomePathForRole } from '@/lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useUserStore((s) => s.login)
  const isLogging = useUserStore((s) => s.isLogging)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await login({ email, password })
    if (ok) {
      const user = useUserStore.getState().currentUser
      const home = getHomePathForRole(user?.role)
      const target =
        from && from !== '/dashboard' && from !== '/dashboard/perfil' ? from : home
      navigate(target, { replace: true })
    }
  }

  return (
    <AuthPageLayout>
      <AuthCard
        title="Iniciar sesión"
        description="Accede al panel de tu aplicación"
        footer={
          <p className="text-center text-sm text-white/50">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="font-medium text-white/85 transition-colors hover:text-white"
            >
              Regístrate
            </Link>
          </p>
        }
      >
        <BlurFadeStagger stagger={0.08} delayChildren={0.05} once={false} amount={0.5} margin="0px">
          <form onSubmit={handleSubmit} className="space-y-4">
            <BlurFadeItem direction="up" yOffset={12}>
              <div>
                <label htmlFor="email" className={authLabelClass}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={authInputClass}
                  placeholder="tu@email.com"
                />
              </div>
            </BlurFadeItem>

            <BlurFadeItem direction="up" yOffset={12}>
              <div>
                <label htmlFor="password" className={authLabelClass}>
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={authInputClass}
                  placeholder="••••••••"
                />
              </div>
            </BlurFadeItem>

            <BlurFadeItem direction="up" yOffset={14}>
              <motion.button
                type="submit"
                className={authSubmitClass}
                disabled={isLogging}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLogging ? 'Ingresando…' : 'Ingresar'}
              </motion.button>
            </BlurFadeItem>
          </form>
        </BlurFadeStagger>
      </AuthCard>
    </AuthPageLayout>
  )
}
