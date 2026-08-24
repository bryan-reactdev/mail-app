import type { ReactNode } from 'react'
import { Toaster } from 'sonner'

export { toast } from 'sonner'

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster theme="dark" richColors position="bottom-right" closeButton />
    </>
  )
}
