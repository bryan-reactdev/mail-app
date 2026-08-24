import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardStatCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  className?: string
}

export function DashboardStatCard({ title, value, description, icon: Icon, className }: DashboardStatCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-5 shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
          {description ? (
            <p className="text-muted-foreground mt-1 text-xs">{description}</p>
          ) : null}
        </div>
        <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  )
}
