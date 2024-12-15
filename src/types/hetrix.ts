export interface Monitor {
    uptimePercentage: number;
    uptime_stats: {
        day: number;
        week: number;
        month: number;
        [key: string]: number;
    };
    last_check_time: string | undefined;
    id: string;
    name: string;
    status: 'up' | 'down' | 'maintenance';
    uptime: number;
    lastCheck: string;
    type: string;
    responseTime: number;
    location: string;
}

export interface RawHetrixMonitor {
    ID?: string;
    id?: string;
    Name?: string;
    name?: string;
    Status: number;
    uptime_status: 'up' | 'down' | 'maintenance';
    uptime: string | number;
    last_check: number;
    type?: string;
    locations?: {
        [key: string]: {
            response_time?: number;
        };
    };
}

export interface HetrixResponse {
    status: string;
    monitors: Monitor[];
}
