"use client"

import { Monitor } from "@/types/monitor"
import { MonitorCard } from "./monitor-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMonitors } from "@/hooks/use-monitors"
import { RefreshButton } from "@/components/ui/refresh-button"

export function MonitorGrid() {
  const { monitors, loading, error, refresh } = useMonitors()

  if (error) {
    return (
      <div className="rounded-xl bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Monitors</h2>
          <p className="text-sm text-muted-foreground">
            Real-time status of all services
          </p>
        </div>
        <RefreshButton onClick={refresh} loading={loading} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && monitors.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton 
              key={`skeleton-${i}`} 
              className="h-[140px] rounded-xl"
            />
          ))
        ) : (
          monitors.map((monitor) => (
            <MonitorCard
              key={monitor.id}
              monitor={monitor}
            />
          ))
        )}
      </div>
    </div>
  )
}