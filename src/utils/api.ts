import { Monitor, RawHetrixMonitor } from '../types/hetrix';

const HETRIX_API_TOKEN = process.env.HETRIX_API_TOKEN;
const HETRIX_API_URL = 'https://api.hetrixtools.com/v3';

// In-memory cache for monitors data
let monitorsCache: {
    data: Monitor[] | null;
    timestamp: number;
} = {
    data: null,
    timestamp: 0
};

const CACHE_DURATION = 30 * 1000; // 30 seconds
const STALE_WHILE_REVALIDATE = 5 * 60 * 1000; // 5 minutes

export async function fetchMonitors(): Promise<{ monitors: Monitor[] }> {
    const now = Date.now();
    const isCacheValid = monitorsCache.data && (now - monitorsCache.timestamp) < CACHE_DURATION;
    const isCacheStale = monitorsCache.data && (now - monitorsCache.timestamp) < STALE_WHILE_REVALIDATE;

    // Return valid cache
    if (isCacheValid && monitorsCache.data) {
        return { monitors: monitorsCache.data };
    }

    try {
        if (!HETRIX_API_TOKEN) {
            throw new Error('HETRIX_API_TOKEN environment variable is not configured');
        }

        const response = await fetch(`${HETRIX_API_URL}/uptime-monitors`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${HETRIX_API_TOKEN}`
            },
            method: 'GET',
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data || !Array.isArray(data.monitors)) {
            throw new Error('Invalid API response format');
        }

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
                id: monitor.id?.toString() || '',
                name: monitor.name || 'Unknown Monitor',
                status,
                uptime: parseFloat(monitor.uptime?.toString() || '0'),
                lastCheck: typeof monitor.last_check === 'number' 
                    ? new Date(monitor.last_check * 1000).toISOString()
                    : new Date(monitor.last_check).toISOString(),
                type: monitor.type || 'http',
                category: monitor.category || '',
                responseTime: monitor.Response_Time || 0
            };
        });

        // Update cache
        monitorsCache = {
            data: monitors,
            timestamp: now
        };

        return { monitors };

    } catch (error) {
        console.error('Error fetching monitors:', error);
        
        // If rate limited or other error and we have stale cache, use it
        if (isCacheStale && monitorsCache.data) {
            console.log('Using stale cache due to API error');
            return { monitors: monitorsCache.data };
        }

        // Re-throw the error to be handled by the caller
        throw error;
    }
}
