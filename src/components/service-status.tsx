import { Monitor } from '@/types/monitor'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { formatDistanceToNow, format } from 'date-fns'

interface DailyStatus {
  date: string
  status: 'operational' | 'degraded' | 'down' | 'unknown'
  responseTime?: number
}

type ServiceStatusProps = Pick<Monitor, 'name' | 'status' | 'lastCheck'> & {
  uptime: number
  history?: DailyStatus[]
}

export function ServiceStatus({ name, status = 'operational', uptime, lastCheck, history = [] }: ServiceStatusProps) {
  const [dailyStatuses, setDailyStatuses] = useState<DailyStatus[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const allDates = new Map<string, DailyStatus>()
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateKey = format(d, 'yyyy-MM-dd')
      allDates.set(dateKey, {
        date: format(d, 'MMM d, yyyy'),
        status: 'operational',
        responseTime: 0
      })
    }

    if (Array.isArray(history)) {
      history.forEach(entry => {
        const date = new Date(entry.date)
        const dateKey = format(date, 'yyyy-MM-dd')
        if (allDates.has(dateKey)) {
          allDates.set(dateKey, {
            ...entry,
            date: format(date, 'MMM d, yyyy')
          })
        }
      })
    }
    
    setDailyStatuses(Array.from(allDates.values()))
  }, [history])

  const statusColor = {
    operational: 'bg-green-500',
    degraded: 'bg-yellow-500',
    down: 'bg-red-500',
    unknown: 'bg-gray-300'
  }

  const statusText = {
    operational: 'Operational',
    degraded: 'Degraded',
    down: 'Down',
    unknown: 'Unknown'
  }

  const getStatusDescription = (status: string, responseTime?: number) => {
    if (status === 'operational') {
      return responseTime 
        ? `System operational (${responseTime}ms)`
        : 'System operational'
    }
    if (status === 'degraded') {
      return responseTime 
        ? `Performance issues (${responseTime}ms)`
        : 'Performance issues detected'
    }
    if (status === 'down') {
      return 'System outage detected'
    }
    return 'No data available'
  }

  const lastCheckDate = lastCheck ? new Date(lastCheck) : null;

  // Only show relative time after component is mounted
  const lastCheckFormatted = mounted && lastCheckDate
    ? formatDistanceToNow(lastCheckDate, { addSuffix: true })
    : lastCheckDate
    ? format(lastCheckDate, 'MMM d, yyyy HH:mm:ss')
    : 'No last check available';

  return (
    <div 
      className="space-y-2 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'h-2.5 w-2.5 rounded-full transition-all',
            statusColor[status],
            isHovered ? 'scale-110' : ''
          )} />
          <span className="text-base font-medium text-gray-800">{name}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500" title={`Last checked ${lastCheckFormatted}`}>
            {uptime.toFixed(2)}% uptime
          </div>
          <div className={cn(
            'text-sm font-medium transition-all',
            status === 'operational' ? 'text-green-600' :
            status === 'degraded' ? 'text-yellow-600' :
            status === 'down' ? 'text-red-600' : 'text-gray-600'
          )}>
            {statusText[status]}
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex w-full gap-[1px] mb-1">
          {dailyStatuses.map((day, index) => (
            <div
              key={`${format(new Date(day.date), 'yyyy-MM-dd')}-${index}`}
              className={cn(
                'group relative h-4 flex-1 cursor-help rounded-full transition-all',
                statusColor[day.status]
              )}
            >
              <div className="invisible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100 z-10">
                <div className="whitespace-nowrap">
                  <div className="font-medium">{day.date}</div>
                  <div className="text-gray-300">
                    {getStatusDescription(day.status, day.responseTime)}
                  </div>
                </div>
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  )
}
