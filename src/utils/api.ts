import { Monitor, RawHetrixMonitor } from '../types/hetrix';

const HETRIX_API_TOKEN = process.env.NEXT_PUBLIC_HETRIX_API_TOKEN;
const HETRIX_API_URL = 'https://api.hetrixtools.com/v3';

export async function fetchMonitors(): Promise<{ monitors: Monitor[] }> {
    if (!HETRIX_API_TOKEN) {
        throw new Error('HetrixTools API token not found');
    }

    try {
        // Using the v3 Uptime Monitors API endpoint with Bearer token
        const response = await fetch(`${HETRIX_API_URL}/uptime-monitors`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${HETRIX_API_TOKEN}`
            },
            method: 'GET'
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log('API Error Response:', errorText); // Debug log
            throw new Error(`Failed to fetch monitors: ${errorText}`);
        }

        const data = await response.json();
        const monitors: Monitor[] = data.monitors.map((monitor: RawHetrixMonitor) => ({
            id: monitor.id,
            name: monitor.name,
            status: monitor.uptime_status,
            uptime: parseFloat(monitor.uptime),
            lastCheck: new Date(monitor.last_check * 1000).toISOString(),
            type: monitor.type,
            responseTime: monitor.Response_Time || 0
        }));

        return { monitors };
    } catch (error) {
        console.error('Error fetching monitors:', error);
        throw error;
    }
}
