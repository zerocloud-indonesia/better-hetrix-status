import { Monitor, RawHetrixMonitor } from '../types/hetrix';

const HETRIX_API_TOKEN = process.env.HETRIX_API_KEY;
const HETRIX_API_URL = 'https://api.hetrixtools.com/v3';
const CACHE_DURATION = 30 * 1000; // 30 seconds

let cachedData: { monitors: Monitor[]; timestamp: number } | null = null;

export async function fetchMonitors(): Promise<{ monitors: Monitor[] }> {
    if (!HETRIX_API_TOKEN) {
        throw new Error('HetrixTools API token not found');
    }

    // Return cached data if valid
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return { monitors: cachedData.monitors };
    }

    try {
        const response = await fetch(`${HETRIX_API_URL}/uptime-monitors`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${HETRIX_API_TOKEN}`
            },
            method: 'GET',
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch monitors: ${response.statusText}`);
        }

        const data = await response.json();
        const monitors: Monitor[] = data.monitors.map((monitor: RawHetrixMonitor) => {
            // Map the API status to our status types
            let status: Monitor['status'];
            switch (monitor.uptime_status) {
                case 'up':
                    status = 'operational';
                    break;
                case 'down':
                    status = 'down';
                    break;
                case 'maintenance':
                    status = 'degraded';
                    break;
                default:
                    status = 'unknown';
            }

            return {
                id: monitor.id || '',
                name: monitor.name || '',
                status,
                uptime: parseFloat(monitor.uptime?.toString() || '0'),
                lastCheck: typeof monitor.last_check === 'number' 
                    ? new Date(monitor.last_check * 1000).toISOString()
                    : new Date(monitor.last_check).toISOString(),
                type: monitor.type || 'http',
                responseTime: monitor.Response_Time || 0
            };
        });

        // Update cache with timestamp
        cachedData = { monitors, timestamp: Date.now() };
        return { monitors };
    } catch (error) {
        console.error('Error fetching monitors:', error);
        // Return cached data if available, otherwise throw
        if (cachedData) {
            return { monitors: cachedData.monitors };
        }
        throw error;
    }
}
