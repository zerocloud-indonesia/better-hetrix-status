export interface Monitor {
    id: string;
    name: string;
    status: 'operational' | 'degraded' | 'down' | 'unknown';
    uptime: number;
    lastCheck: string;
    type: string;
    responseTime: number;
}

export interface RawHetrixMonitor {
    ID?: string;
    id?: string;
    Name?: string;
    name?: string;
    Status: number;
    uptime_status: 'up' | 'down' | 'maintenance';
    monitor_status: 'active' | 'maintenance' | 'inactive';
    uptime: string | number;
    last_check: number | string;
    type?: string;
    category?: string;
    Response_Time?: number;
    locations?: {
        [key: string]: {
            response_time?: number;
            uptime_status: string;
            last_check: number;
        };
    };
}

export interface HetrixResponse {
    status: string;
    monitors: RawHetrixMonitor[];
}
