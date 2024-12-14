"use client";

import { useEffect, useState } from "react";
import { ServiceStatus } from "./service-status";
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw } from 'lucide-react'

type Monitor = {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'down' | 'unknown';
  uptime: number;
};

export function UptimeMonitor() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [lastMonitors, setLastMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonitors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/monitors");
      if (!response.ok) {
        throw new Error("Failed to fetch monitors");
      }
      const data = await response.json();
      setMonitors(data.monitors);
      setLastMonitors(data.monitors); // Update last successful data
      localStorage.setItem('monitors', JSON.stringify(data.monitors)); // Cache the data in local storage
    } catch (err) {
      setError("Failed to fetch monitors");
      setMonitors(lastMonitors); // Revert to last successful data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedMonitors = localStorage.getItem('monitors');
    if (cachedMonitors) {
      setMonitors(JSON.parse(cachedMonitors)); // Load from local storage if available
    }
    fetchMonitors();
    const interval = setInterval(fetchMonitors, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-8 animate-in fade-in duration-300">
        <p className="text-sm text-red-800 font-medium">{error}</p>
        <Button
          onClick={fetchMonitors}
          variant="destructive"
          size="sm"
          className="mt-4"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">System Status</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Real-time monitoring dashboard</p>
        </div>
        <Button
          onClick={fetchMonitors}
          disabled={loading}
          variant="outline"
          size="sm"
          className="transition-all duration-300 hover:shadow"
        >
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && monitors.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton 
              key={`skeleton-${i}`} 
              className="h-[120px] rounded-xl bg-gray-200 dark:bg-gray-700"
            />
          ))
        ) : (
          monitors.map((monitor) => (
            <ServiceStatus
              key={monitor.id}
              name={monitor.name}
              status={monitor.status}
              uptime={monitor.uptime}
            />
          ))
        )}
      </div>
    </div>
  );
}
