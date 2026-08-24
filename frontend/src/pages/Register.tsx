import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

export default function Register() {
  const navigate = useNavigate()
  const register = useUserStore((s) => s.register)
  const isRegistering = useUserStore((s) => s.isRegisteringUser)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await register({ firstName, lastName, email, password })
    if (ok) navigate('/login', { replace: true })
  }

  return (
    <AuthPageLayout>
      <AuthCard
        title="Crear cuenta"
        description="Regístrate en la aplicación"
        footer={
          <p className="text-center text-sm text-white/50">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="font-medium text-white/85 transition-colors hover:text-white"
            >
              Inicia sesión
            </Link>
          </p>
        }
      >
        <BlurFadeStagger stagger={0.07} delayChildren={0.05} once={false} amount={0.5} margin="0px">
          <form onSubmit={handleSubmit} className="space-y-4">
            <BlurFadeItem direction="up" yOffset={12}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className={authLabelClass}>
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={authInputClass}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={authLabelClass}>
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={authInputClass}
                  />
                </div>
              </div>
            </BlurFadeItem>

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
                  autoComplete="new-password"
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
                disabled={isRegistering}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isRegistering ? 'Registrando…' : 'Registrarse'}
              </motion.button>
            </BlurFadeItem>
          </form>
        </BlurFadeStagger>
      </AuthCard>
    </AuthPageLayout>
  )
}
