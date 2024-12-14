export interface Monitor {
    uptimePercentage: any;
    uptime_stats: any;
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
    [x: string]: any;
    ID?: string;
    id?: string;
    Name?: string;
    name?: string;
    Status: number;
    Uptime?: number;
    Last_Check?: string;
    lastCheck?: string;
    Type?: string;
    type?: string;
    Response_Time?: number;
    Location?: string;
}

export interface HetrixResponse {
    status: string;
    monitors: Monitor[];
}
