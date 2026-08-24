import Prism from '@/components/Prism'
import { LandingNavbar } from '@/components/landing/LandingNavbar'

export const authInputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-[border-color,background-color,box-shadow] placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-primary/35 disabled:opacity-50'

export const authLabelClass = 'mb-1.5 block text-sm font-medium text-white/80'

export const authSubmitClass =
  'inline-flex h-11 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

interface AuthPageLayoutProps {
  children: React.ReactNode
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="relative min-h-screen min-h-[100dvh] overflow-x-hidden bg-[#1b1e27] text-white">
      <LandingNavbar />

      <div className="pointer-events-none absolute inset-0">
        <Prism
          animationType="rotate"
          timeScale={0.45}
          height={3.5}
          baseWidth={5.5}
          scale={3.2}
          glow={0.9}
          bloom={0.9}
          noise={0}
          hueShift={0}
          colorFrequency={1}
          transparent
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1b1e27]/25 to-[#1b1e27]" />
      </div>

      <div className="relative z-10 flex min-h-screen min-h-[100dvh] items-center justify-center px-4 py-28">
        {children}
      </div>
    </div>
  )
}
