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

        console.log('Fetching monitors from HetrixTools API...');
        const response = await fetch(`${HETRIX_API_URL}/uptime-monitors`, {
            headers: {
                'Authorization': `Bearer ${HETRIX_API_TOKEN}`
            },
            method: 'GET',
            cache: 'no-store'
        });

        console.log('API Response Status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Parsed API Response:', JSON.stringify(data, null, 2));

        // HetrixTools API returns monitors in the monitors array
        const monitorsData = data.monitors || [];

        if (!Array.isArray(monitorsData)) {
            throw new Error(`Invalid API response format. Expected array, got ${typeof monitorsData}`);
        }

        const monitorsWithRequiredFields = monitorsData.map((monitor: RawHetrixMonitor) => ({
            lastCheck: monitor.last_check || 'unknown',
            type: monitor.type || 'defaultType',
            responseTime: monitor.locations ? 
                Object.values(monitor.locations).reduce((acc, loc) => acc + (loc.response_time || 0), 0) / 
                Object.keys(monitor.locations).length : 0,
            status: (monitor.uptime_status === 'up' ? 'operational' : 
                    monitor.uptime_status === 'down' ? 'down' : 
                    monitor.uptime_status === 'maintenance' || monitor.monitor_status === 'maintenance' ? 'degraded' : 
                    'unknown') as 'operational' | 'degraded' | 'down' | 'unknown',
            id: String(monitor.id || ''),
            name: String(monitor.name || 'Unknown Monitor'),
            uptime: Number(parseFloat(monitor.uptime?.toString() || '0').toFixed(2)),
            category: monitor.category || 'Uncategorized'
        })) as Monitor[];

        // Update cache
        monitorsCache = {
            data: monitorsWithRequiredFields,
            timestamp: now
        };

        return { monitors: monitorsWithRequiredFields };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error in fetchMonitors:', errorMessage);
        
        if (isCacheStale && monitorsCache.data) {
            console.log('Using stale cache due to API error');
            return { monitors: monitorsCache.data };
        }

        throw new Error(`Failed to fetch monitors: ${errorMessage}`);
    }
}
