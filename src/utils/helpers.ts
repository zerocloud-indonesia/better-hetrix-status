import { Monitor } from '@/types/hetrix'

export function groupMonitorsByCategory(monitors: Monitor[]) {
  return monitors.reduce((acc, monitor) => {
    const category = monitor.type || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(monitor)
    return acc
  }, {} as Record<string, Monitor[]>)
}

