import * as React from 'react'
import { useState } from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { AnimatePresence, motion } from 'motion/react'
import { Loader2, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  getModalContainerMotion,
  getModalContainerStyle,
  useVisualViewportLayout,
} from '@/hooks/useVisualViewportLayout'
import type { GlobalModalProps, ModalAction, ModalSize } from '@/components/ui/modal.types'

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
}

const modalSpring = { type: 'spring' as const, stiffness: 380, damping: 32, mass: 0.82 }
const overlayEase = [0.22, 1, 0.36, 1] as const

function focusFirstField(container: HTMLElement) {
  const field = container.querySelector<HTMLElement>(
    'textarea, input:not([type="hidden"]):not([disabled]), [contenteditable="true"]'
  )
  field?.focus({ preventScroll: true })
}

function GlobalModal({
  open,
  onOpenChange,
  size = 'md',
  children,
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  preventClose = false,
  className,
  onOpenAutoFocus,
}: GlobalModalProps) {
  const viewportLayout = useVisualViewportLayout(open)
  const containerStyle = getModalContainerStyle(viewportLayout)
  const containerMotion = getModalContainerMotion(viewportLayout)

  const handleOpenAutoFocus = (event: Event) => {
    if (onOpenAutoFocus) {
      onOpenAutoFocus(event)
      return
    }
    event.preventDefault()
    const container = event.currentTarget as HTMLElement
    window.requestAnimationFrame(() => focusFirstField(container))
  }

  const handleOpenChange = (next: boolean) => {
    if (preventClose && !next) return
    onOpenChange(next)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: overlayEase }}
                className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              forceMount
              onOpenAutoFocus={handleOpenAutoFocus}
              onPointerDownOutside={(e) => {
                if (!closeOnOutsideClick || preventClose) e.preventDefault()
              }}
              onEscapeKeyDown={(e) => {
                if (!closeOnEscape || preventClose) e.preventDefault()
              }}
            >
              <motion.div
                className="fixed inset-x-0 z-50 flex justify-center px-4 outline-none"
                style={containerStyle}
                initial={false}
                animate={containerMotion}
                transition={modalSpring}
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.97, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  transition={modalSpring}
                  className={cn(
                    'relative grid w-full gap-4 overflow-y-auto',
                    'rounded-2xl border border-white/10 bg-card/85 p-6 text-card-foreground backdrop-blur-xl',
                    'shadow-[0_8px_40px_oklch(0_0_0/0.45),0_0_0_1px_oklch(1_0_0/0.06)]',
                    'overscroll-contain',
                    'max-h-full',
                    sizeClasses[size],
                    className
                  )}
                >
                  {children}
                  {showCloseButton && (
                    <DialogPrimitive.Close
                      disabled={preventClose}
                      className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-lg p-1 text-muted-foreground opacity-70 transition-opacity hover:bg-white/5 hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
                    >
                      <XIcon className="size-4" />
                      <span className="sr-only">Cerrar</span>
                    </DialogPrimitive.Close>
                  )}
                </motion.div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

function GlobalModalHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function GlobalModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg leading-none font-semibold tracking-tight', className)}
      {...props}
    />
  )
}

function GlobalModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function GlobalModalFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

function GlobalModalActions({
  actions,
  className,
}: {
  actions: ModalAction[]
  className?: string
}) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null)
  const isBusy = loadingIndex !== null

  const handleClick = async (action: ModalAction, index: number) => {
    if (isBusy || action.disabled || action.loading) return
    setLoadingIndex(index)
    try {
      await action.onClick()
    } finally {
      setLoadingIndex(null)
    }
  }

  return (
    <GlobalModalFooter className={className}>
      {actions.map((action, index) => {
        const loading = action.loading || loadingIndex === index
        return (
          <Button
            key={`${action.label}-${index}`}
            type="button"
            variant={action.variant ?? 'default'}
            disabled={isBusy || action.disabled || loading}
            onClick={() => handleClick(action, index)}
            className="rounded-xl"
          >
            {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {action.label}
          </Button>
        )
      })}
    </GlobalModalFooter>
  )
}

export {
  GlobalModal,
  GlobalModalHeader,
  GlobalModalTitle,
  GlobalModalDescription,
  GlobalModalFooter,
  GlobalModalActions,
}
