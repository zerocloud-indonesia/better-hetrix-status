'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { ServerStats as ServerStatsType } from '@/types/hetrix';
import { AlertCircle } from 'lucide-react';

interface ServerStatsProps {
    monitorId: string;
}

export function ServerStats({ monitorId }: ServerStatsProps) {
    const [stats, setStats] = useState<ServerStatsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryIn, setRetryIn] = useState(0);

    useEffect(() => {
        let mounted = true;
        let retryTimeout: NodeJS.Timeout;

        async function fetchStats() {
            try {
                const response = await fetch(`/api/monitors/${monitorId}/stats`);
                const data = await response.json();
                
                if (mounted) {
                    if (response.status === 429) {
                        setError('rate-limited');
                        // Retry in 60 seconds if rate limited
                        setRetryIn(60);
                        retryTimeout = setTimeout(fetchStats, 60000);
                    } else if (response.status === 404 && data.error === 'no-agent') {
                        setError('no-agent');
                    } else if (response.ok && data?.data) {
                        setStats(data);
                        setError(null);
                        setRetryIn(0);
                    } else {
                        setError(data?.error || 'Failed to fetch stats');
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
                if (mounted) {
                    setError('Failed to fetch stats');
                    setLoading(false);
                }
            }
        }

        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        
        return () => {
            mounted = false;
            clearInterval(interval);
            clearTimeout(retryTimeout);
        };
    }, [monitorId]);

    // If there's no agent, don't show anything
    if (error === 'no-agent') {
        return null;
    }

    // Default values
    const currentStats = {
        cpu: stats?.data?.cpu ?? 0,
        ram: stats?.data?.ram ?? 0,
        disk: stats?.data?.disk ?? 0
    };

    const getProgressColor = (value: number) => {
        if (value >= 90) return "bg-red-500";
        if (value >= 75) return "bg-orange-500";
        if (value >= 50) return "bg-yellow-500";
        return "bg-green-500";
    };

    const metrics = [
        { label: 'CPU', value: currentStats.cpu },
        { label: 'RAM', value: currentStats.ram },
        { label: 'Disk', value: currentStats.disk }
    ];

    // If rate limited, show a message
    if (error === 'rate-limited') {
        return (
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                <span>Rate limited. Retrying in {retryIn}s...</span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-2 text-[10px]">
            {metrics.map(({ label, value }) => (
                <div key={label}>
                    <div className="flex items-center justify-between mb-0.5">
                        <span className="text-muted-foreground">{label}</span>
                        <span>{value.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                            className={cn(
                                "h-full transition-all duration-500",
                                loading ? "bg-muted animate-pulse" : getProgressColor(value)
                            )}
                            style={{ width: loading ? '100%' : `${value}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
