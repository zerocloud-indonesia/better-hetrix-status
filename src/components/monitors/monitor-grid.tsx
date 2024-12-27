"use client"

import { Monitor } from "@/types/monitor"
import { UptimeMonitor } from "@/components/uptime-monitor"
import { Skeleton } from "@/components/ui/skeleton"
import { useMonitors } from "@/hooks/use-monitors"
import { RefreshButton } from "@/components/ui/refresh-button"
import { ChevronDown, FolderIcon } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { groupMonitorsByCategory } from "@/utils/helpers"

const STORAGE_KEY = 'openCategories'

export function MonitorGrid() {
  const { monitors, loading, error, refresh } = useMonitors()
  const [openCategories, setOpenCategories] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Save open categories to localStorage
  useEffect(() => {
    if (openCategories.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(openCategories))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [openCategories])

  const toggleCategory = useCallback((category: string) => {
    setOpenCategories(prev => {
      const newState = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
      return newState
    })
  }, [])

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  const groupedMonitors = groupMonitorsByCategory(monitors)
  const categories = Object.keys(groupedMonitors).sort()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">System Status</h2>
          <p className="text-sm text-muted-foreground">
            Monitor status and server metrics
          </p>
        </div>
        <RefreshButton onClick={refresh} loading={loading} />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-[120px] rounded-lg" 
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const stats = groupedMonitors[category]

            return (
              <div 
                key={category} 
                className="overflow-hidden rounded-lg border bg-card"
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FolderIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{category}</span>
                    <Badge variant="outline" className="text-xs">
                      {stats.averageUptime.toFixed(2)}% uptime
                    </Badge>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      openCategories.includes(category) ? "rotate-180" : ""
                    )}
                  />
                </button>
                {openCategories.includes(category) && (
                  <div className="border-t bg-card/50">
                    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                      {stats.monitors.map((monitor: Monitor) => (
                        <UptimeMonitor 
                          key={monitor.id} 
                          monitor={monitor}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}