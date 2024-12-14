import { Monitor } from "@/types/monitor"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MonitorCardProps {
  monitor: Monitor
}

export function MonitorCard({ monitor }: MonitorCardProps) {
  const statusConfig = {
    operational: {
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      label: "Operational"
    },
    degraded: {
      icon: AlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      label: "Degraded"
    },
    down: {
      icon: Activity,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      label: "Down"
    }
  }

  const config = statusConfig[monitor.status]
  const Icon = config.icon

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
              config.bgColor,
              "group-hover:scale-110"
            )}>
              <Icon className={cn("h-5 w-5", config.color)} />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium leading-none">{monitor.name}</h3>
              <Badge 
                variant="outline" 
                className={cn(
                  "border transition-colors",
                  config.borderColor,
                  config.color
                )}
              >
                {config.label}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className={cn(
              "text-2xl font-bold",
              config.color
            )}>
              {monitor.uptime.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Uptime
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}