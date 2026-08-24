import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Users, UserCircle } from 'lucide-react'
import { useUserStore } from '@/stores/useUserStore'
import { isAdmin, roleLabel } from '@/lib/auth'
import { DashboardStatCard } from '@/dashboard/components/DashboardStatCard'

export default function Dashboard() {
  const currentUser = useUserStore((s) => s.currentUser)
  const users = useUserStore((s) => s.users)
  const getUsers = useUserStore((s) => s.getUsers)
  const admin = isAdmin(currentUser?.role)
  const displayName = currentUser?.fullName ?? `${currentUser?.firstName ?? ''} ${currentUser?.lastName ?? ''}`.trim()

  useEffect(() => {
    if (admin) void getUsers()
  }, [admin, getUsers])

  return (
    <div className="mx-auto max-w-5xl px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {admin ? 'Panel principal' : `Hola, ${currentUser?.firstName ?? 'Usuario'}`}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {admin
            ? 'Resumen general de la aplicación.'
            : `${displayName} · ${roleLabel(currentUser?.role)}`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardStatCard
          title="Tu rol"
          value={roleLabel(currentUser?.role)}
          description="Permisos actuales en el sistema"
          icon={UserCircle}
        />
        {admin ? (
          <DashboardStatCard
            title="Usuarios activos"
            value={String(users.length || '—')}
            description="Usuarios registrados sin archivar"
            icon={Users}
          />
        ) : null}
        <DashboardStatCard
          title="Estado"
          value="Activo"
          description="Sesión iniciada correctamente"
          icon={LayoutDashboard}
        />
      </div>

      {admin ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">Accesos rápidos</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Administra usuarios y revisa la configuración del sistema.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/dashboard/usuarios"
              className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Gestionar usuarios
            </Link>
            <Link
              to="/dashboard/perfil"
              className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium"
            >
              Mi perfil
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
