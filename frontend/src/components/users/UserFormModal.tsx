import { Loader2, UserRound } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  GlobalModal,
  GlobalModalFooter,
  GlobalModalHeader,
  GlobalModalTitle,
} from '@/components/ui/GlobalModal'
import { Button } from '@/components/ui/button'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { mediaUrl } from '@/lib/media'
import type { StaffRole } from '@/lib/roles'
import type { User } from '@/types/entities'

export interface UserFormValues {
  fullName: string
  phone: string
  email: string
  password: string
  role: StaffRole
}

interface RoleOption {
  value: StaffRole
  label: string
}

interface UserFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initialUser?: User | null
  saving: boolean
  roleOptions: RoleOption[]
  defaultRole: StaffRole
  onSubmit: (formData: FormData) => Promise<boolean>
}

const inputClass =
  'border-input bg-background w-full rounded-xl border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'

const labelClass = 'text-muted-foreground mb-1.5 block text-xs font-medium uppercase tracking-wide'

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className={labelClass}>
      {children}
      {required && <span className="text-destructive"> *</span>}
    </label>
  )
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
      <h3 className="text-foreground text-sm font-semibold">{title}</h3>
      {children}
    </section>
  )
}

const emptyValues = (defaultRole: StaffRole): UserFormValues => ({
  fullName: '',
  phone: '',
  email: '',
  password: '',
  role: defaultRole,
})

function valuesFromUser(user: User, defaultRole: StaffRole): UserFormValues {
  return {
    fullName: user.fullName ?? `${user.firstName} ${user.lastName}`.trim(),
    phone: user.phone ?? '',
    email: user.email ?? '',
    password: '',
    role: (user.role as StaffRole) ?? defaultRole,
  }
}

function buildFormData(values: UserFormValues, photo: File | null) {
  const fd = new FormData()
  fd.append('fullName', values.fullName.trim())
  fd.append('phone', values.phone.trim())
  fd.append('email', values.email.trim())
  fd.append('password', values.password)
  fd.append('role', values.role)
  if (photo) fd.append('photo', photo)
  return fd
}

export function UserFormModal({
  open,
  onOpenChange,
  mode,
  initialUser,
  saving,
  roleOptions,
  defaultRole,
  onSubmit,
}: UserFormModalProps) {
  const [values, setValues] = useState<UserFormValues>(emptyValues(defaultRole))
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setValues(
      mode === 'edit' && initialUser ? valuesFromUser(initialUser, defaultRole) : emptyValues(defaultRole)
    )
    setPhoto(null)
    setPhotoPreview(
      mode === 'edit' && initialUser ? mediaUrl(initialUser.profilePhotoThumb ?? initialUser.profilePhoto) : null
    )
  }, [open, mode, initialUser, defaultRole])

  useEffect(() => {
    if (!photo) return
    const url = URL.createObjectURL(photo)
    setPhotoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  const set = <K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const canSubmit = useMemo(() => {
    if (!values.fullName.trim()) return false
    if (!values.phone.trim()) return false
    if (mode === 'create' && !values.password.trim()) return false
    return true
  }, [values, mode])

  const handleSubmit = async () => {
    if (!canSubmit || saving) return
    const ok = await onSubmit(buildFormData(values, photo))
    if (ok) onOpenChange(false)
  }

  return (
    <GlobalModal
      open={open}
      onOpenChange={onOpenChange}
      size="2xl"
      preventClose={saving}
      className="max-h-[90vh] overflow-y-auto"
    >
      <GlobalModalHeader>
        <GlobalModalTitle>{mode === 'create' ? 'Nuevo usuario' : 'Editar usuario'}</GlobalModalTitle>
      </GlobalModalHeader>

      <div className="space-y-4">
        <FormSection title="Datos personales">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel required>Nombre completo</FieldLabel>
              <input
                value={values.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                className={inputClass}
                disabled={saving}
                placeholder="Ej. Juan Carlos Martínez"
              />
            </div>
            {roleOptions.length > 0 && (
              <div className="sm:col-span-2">
                <FieldLabel required>Rol</FieldLabel>
                <select
                  value={values.role}
                  onChange={(e) => set('role', e.target.value as StaffRole)}
                  className={inputClass}
                  disabled={saving}
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </FormSection>

        <div className="grid gap-4 lg:grid-cols-2">
          <FormSection title="Contacto">
            <div className="space-y-3">
              <div>
                <FieldLabel required>Teléfono</FieldLabel>
                <PhoneInput
                  value={values.phone}
                  onChange={(phone) => set('phone', phone)}
                  disabled={saving}
                  placeholder="7000-0000"
                />
              </div>
              <div>
                <FieldLabel>Correo</FieldLabel>
                <input
                  type="email"
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                  className={inputClass}
                  disabled={saving}
                  placeholder="usuario@email.com"
                />
              </div>
              <div>
                <FieldLabel required={mode === 'create'}>
                  {mode === 'create' ? 'Contraseña' : 'Nueva contraseña (opcional)'}
                </FieldLabel>
                <input
                  type="password"
                  value={values.password}
                  onChange={(e) => set('password', e.target.value)}
                  className={inputClass}
                  disabled={saving}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Foto de perfil">
            <div className="flex flex-col items-center justify-center gap-4 py-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => fileRef.current?.click()}
                className="bg-muted hover:bg-muted/80 focus-visible:ring-ring group relative flex size-32 items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-border transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:size-36"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="" className="size-full object-cover" />
                ) : (
                  <UserRound className="text-muted-foreground size-12 transition-transform group-hover:scale-105" />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={saving}
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={saving}
                onClick={() => fileRef.current?.click()}
              >
                {photoPreview ? 'Cambiar foto' : 'Subir foto'}
              </Button>
            </div>
          </FormSection>
        </div>
      </div>

      <GlobalModalFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving} className="rounded-xl">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={saving || !canSubmit} className="rounded-xl gap-2">
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Guardando…
            </>
          ) : mode === 'create' ? (
            'Crear usuario'
          ) : (
            'Guardar cambios'
          )}
        </Button>
      </GlobalModalFooter>
    </GlobalModal>
  )
}
