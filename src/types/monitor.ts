export interface DailyStatus {
  date: string
  status: 'operational' | 'degraded' | 'down' | 'unknown'
  responseTime?: number
}

export interface Monitor {
  id: string
  name: string
  status: 'operational' | 'degraded' | 'down'
  uptime: number
  lastCheck: string
  type: string
  responseTime: number
  history?: DailyStatus[]
}
