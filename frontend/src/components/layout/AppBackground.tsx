import { useEffect, useState } from 'react'
import Aurora from '@/components/Aurora'

/** Dashboard aurora — visible but restrained */
const DARK_AURORA_STOPS = ['#3a2f72', '#4a8870', '#453068'] as const

function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  )

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark'))
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}

export function AppBackground() {
  const isDark = useIsDarkTheme()

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {isDark && <div className="absolute inset-0 bg-background" />}

      {isDark && (
        <Aurora
          colorStops={[...DARK_AURORA_STOPS]}
          amplitude={0.78}
          blend={0.48}
          speed={0.75}
        />
      )}

      <div
        className={
          isDark
            ? 'absolute inset-0 z-[2] bg-gradient-to-b from-background/15 via-background/40 to-background/78'
            : 'absolute inset-0 z-[2] bg-gradient-to-b from-background/15 via-background/45 to-background/85'
        }
      />
    </div>
  )
}
