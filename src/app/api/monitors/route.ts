import { NextResponse } from 'next/server'
import { Monitor, RawHetrixMonitor } from '@/types/hetrix'

// Cache storage
let cachedData: { monitors: Monitor[] } | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds in milliseconds

const HETRIX_API_KEY = process.env.HETRIX_API_KEY;
const HETRIX_API_URL = 'https://api.hetrixtools.com/v3';

async function fetchHetrixMonitors() {
  // Check if we have valid cached data
  const now = Date.now();
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('Returning cached monitors data');
    return cachedData;
  }

  try {
    // Fetch all monitors
    const url = `${HETRIX_API_URL}/uptime-monitors`;
    console.log('Fetching monitors from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HETRIX_API_KEY}`
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Error fetching monitors:', response.status, response.statusText);
      // If fetch fails and we have cached data, return it
      if (cachedData) {
        console.log('Fetch failed, returning cached data');
        return cachedData;
      }
      throw new Error(`Failed to fetch monitors: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Map the response to our Monitor type
    const mappedMonitors = data.monitors.map((monitor: RawHetrixMonitor) => {
      const status = monitor.uptime_status === 'up' ? 'operational' : 
                    monitor.uptime_status === 'down' ? 'down' : 'degraded';

      // Get the raw uptime value
      const uptimeValue = monitor.uptime || '0';
      console.log(`Monitor ${monitor.name} uptime:`, {
        raw_uptime: monitor.uptime,
        final_value: uptimeValue
      });

      return {
        id: monitor.id || '',
        name: monitor.name || '',
        status,
        uptime: parseFloat(uptimeValue.toString()),
        lastCheck: typeof monitor.last_check === 'number' 
          ? new Date(monitor.last_check * 1000).toISOString()
          : new Date(monitor.last_check).toISOString(),
        type: monitor.type || 'http',
        responseTime: Object.values(monitor.locations || {}).reduce((avg: number, loc: { response_time?: number }) => 
          avg + (loc.response_time || 0), 0) / Object.keys(monitor.locations || {}).length || 0,
        history: []
      };
    });

    // Update cache
    cachedData = { monitors: mappedMonitors };
    lastFetchTime = now;

    return cachedData;
  } catch (error) {
    console.error('Error in fetchHetrixMonitors:', error);
    // If we have cached data, return it on error
    if (cachedData) {
      console.log('Error occurred, returning cached data');
      return cachedData;
    }
    throw error;
  }
}

export async function GET() {
  try {
    const monitors = await fetchHetrixMonitors();
    
    // Return response with cache headers
    return new NextResponse(JSON.stringify(monitors), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitors' },
      { status: 500 }
    );
  }
}
