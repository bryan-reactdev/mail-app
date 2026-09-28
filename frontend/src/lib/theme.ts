const STORAGE_KEY = 'mail-app-theme'

export type Theme = 'light' | 'dark' | 'system'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'dark'
}

export function getResolvedTheme(): 'light' | 'dark' {
  const theme = getStoredTheme()
  return theme === 'system' ? getSystemTheme() : theme
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme)
  const resolved = theme === 'system' ? getSystemTheme() : theme
  applyTheme(resolved)
}

/** Call once on app init. Applies stored theme and listens for system changes when theme is "system". */
export function initTheme(): void {
  const theme = getStoredTheme()
  const resolved = theme === 'system' ? getSystemTheme() : theme
  applyTheme(resolved)

  if (theme === 'system' && typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      applyTheme(getSystemTheme())
    })
  }
}
