import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'
import { getHomePathForRole } from '@/lib/auth'

export default function SsoCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const ssoLogin = useUserStore((s) => s.ssoLogin)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setError('No se recibió el token de acceso.')
      return
    }

    let cancelled = false
    void ssoLogin(token)
      .then(() => {
        if (cancelled) return
        const user = useUserStore.getState().currentUser
        navigate(getHomePathForRole(user?.role), { replace: true })
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo abrir la aplicación desde el portal.')
      })

    return () => {
      cancelled = true
    }
  }, [navigate, searchParams, ssoLogin])

  return (
    <div className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center shadow-xl">
        {!error ? (
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        ) : null}
        <h1 className="text-xl font-bold tracking-tight">Iniciando sesión</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error || 'Validando tu acceso desde el centro de aplicaciones.'}
        </p>
        {error ? (
          <Link className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline" to="/login">
            Volver al inicio de sesión
          </Link>
        ) : null}
      </div>
    </div>
  )
}
