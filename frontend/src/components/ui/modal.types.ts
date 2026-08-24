import type { ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from '@/components/ui/button'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'

export type ModalActionVariant = NonNullable<
  VariantProps<typeof buttonVariants>['variant']
>

export interface ModalAction {
  label: string
  onClick: () => void | Promise<void>
  variant?: ModalActionVariant
  disabled?: boolean
  loading?: boolean
}

export interface GlobalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  size?: ModalSize
  children?: ReactNode
  showCloseButton?: boolean
  closeOnOutsideClick?: boolean
  closeOnEscape?: boolean
  preventClose?: boolean
  className?: string
  onOpenAutoFocus?: (event: Event) => void
}

export interface ConfirmModalOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => void | Promise<void>
}
