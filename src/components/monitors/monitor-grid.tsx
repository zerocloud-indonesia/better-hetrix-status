"use client"

import { Monitor } from "@/types/monitor"
import { MonitorCard } from "./monitor-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMonitors } from "@/hooks/use-monitors"
import { RefreshButton } from "@/components/ui/refresh-button"
import { motion, AnimatePresence } from "framer-motion"
import { groupMonitorsByCategory, CategoryStats } from "@/utils/helpers"
import { ChevronDown, FolderIcon, CheckCircle, AlertTriangle, Activity } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

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
      <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4">
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
          <h2 className="text-2xl font-bold tracking-tight">Monitors</h2>
          <p className="text-sm text-muted-foreground">
            Real-time status of all services
          </p>
        </div>
        <RefreshButton onClick={refresh} loading={loading} />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="relative h-[180px] rounded-xl border bg-gradient-to-br from-muted/50 to-muted/30 p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
              <div className="absolute right-6 top-6 text-right">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-1 h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const stats = groupedMonitors[category]
            const uptimeColor = stats.averageUptime >= 99 
              ? "text-green-500" 
              : stats.averageUptime >= 95 
                ? "text-yellow-500" 
                : "text-red-500"

            return (
              <motion.div 
                key={category} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-lg border bg-gradient-to-br from-card to-card/50"
                layout
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center justify-between p-4 font-medium hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FolderIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg">{category}</span>
                    <div className="flex items-center gap-2">



                      {/* <Badge variant="secondary" className="gap-1">
                        <span>{stats.monitors.length}</span>
                        <span className="text-muted-foreground">monitors</span>
                      </Badge>*/}



                      <Badge variant="outline" className={cn("gap-1", uptimeColor)}>
                        <span>{stats.averageUptime.toFixed(2)}%</span>
                        <span className="text-muted-foreground">uptime</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-1">
                      {stats.operationalCount > 0 && (
                        <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-500">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {stats.operationalCount}
                        </Badge>
                      )}
                      {stats.degradedCount > 0 && (
                        <Badge variant="outline" className="border-yellow-500/20 bg-yellow-500/10 text-yellow-500">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          {stats.degradedCount}
                        </Badge>
                      )}
                      {stats.downCount > 0 && (
                        <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-500">
                          <Activity className="mr-1 h-3 w-3" />
                          {stats.downCount}
                        </Badge>
                      )}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-200",
                        openCategories.includes(category) ? "rotate-180" : ""
                      )}
                    />
                  </div>
                </button>
                <AnimatePresence mode="wait">
                  {openCategories.includes(category) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t bg-background/50 backdrop-blur-sm"
                      layout
                    >
                      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                        {stats.monitors.map((monitor) => (
                          <MonitorCard key={monitor.id} monitor={monitor} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}