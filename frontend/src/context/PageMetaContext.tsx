import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { resolvePageMeta, type PageMeta } from '@/lib/pageMeta'
import { useUserStore } from '@/stores/useUserStore'

type PageMetaOverride = Partial<PageMeta> | null

const PageMetaContext = createContext<{
  setOverride: (meta: PageMetaOverride) => void
} | null>(null)

export function PageMetaProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const currentUser = useUserStore((s) => s.currentUser)
  const [override, setOverride] = useState<PageMetaOverride>(null)

  const meta = useMemo(() => {
    const base = resolvePageMeta(location.pathname, currentUser)
    if (!override) return base
    return { ...base, ...override }
  }, [location.pathname, currentUser, override])

  return (
    <PageMetaContext.Provider value={{ setOverride }}>
      <PageMetaStateContext.Provider value={meta}>{children}</PageMetaStateContext.Provider>
    </PageMetaContext.Provider>
  )
}

const PageMetaStateContext = createContext<PageMeta | null>(null)

export function usePageMeta(): PageMeta {
  const meta = useContext(PageMetaStateContext)
  if (!meta) throw new Error('usePageMeta must be used within PageMetaProvider')
  return meta
}

export function usePageMetaOverride(meta: PageMetaOverride) {
  const ctx = useContext(PageMetaContext)
  if (!ctx) throw new Error('usePageMetaOverride must be used within PageMetaProvider')

  const { setOverride } = ctx
  const serialized = meta ? JSON.stringify(meta) : null

  useEffect(() => {
    setOverride(meta)
    return () => setOverride(null)
  }, [serialized, setOverride])
}
