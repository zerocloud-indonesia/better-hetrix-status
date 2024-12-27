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
    uptime: string | number;
    last_check: number | string;
    type?: string;
    category?: string;
    Response_Time?: number;
    locations?: {
        [key: string]: {
            response_time?: number;
        };
    };
}

export interface HetrixResponse {
    status: string;
    monitors: RawHetrixMonitor[];
}
