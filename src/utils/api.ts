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
        const response = await fetch(`${HETRIX_API_URL}/uptime-monitors`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${HETRIX_API_TOKEN}`
            },
            method: 'GET',
            cache: 'no-store'
        });

        // If rate limited or other error and we have stale cache, use it silently
        if (!response.ok && isCacheStale && monitorsCache.data) {
            // Log the error but don't throw it
            console.log(`API ${response.status} ${response.statusText}, using cache silently`);
            return { monitors: monitorsCache.data };
        }

        // Only throw if we have no cache to fall back to
        if (!response.ok && (!isCacheStale || !monitorsCache.data)) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
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
        // On any error, return stale cache if available
        if (isCacheStale && monitorsCache.data) {
            console.log('Error fetching data, using cache silently:', error);
            return { monitors: monitorsCache.data };
        }
        // Only throw if we have no cache
        throw error;
    }
}
