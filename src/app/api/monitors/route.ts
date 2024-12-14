import { NextResponse } from 'next/server'

const HETRIX_API_KEY = process.env.HETRIX_API_KEY
const HETRIX_API_URL = 'https://api.hetrixtools.net/v3'

// Cache duration and structure
const CACHE_DURATION = 60 * 1000 // 1 minute in milliseconds
interface CacheEntry {
  data: any
  timestamp: number
}

const cache = new Map<string, CacheEntry>()

async function fetchWithCache(url: string, options: RequestInit, cacheKey: string): Promise<any> {
  const now = Date.now()
  const cached = cache.get(cacheKey)

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  const response = await fetch(url, options)
  
  if (!response.ok) {
    const errorText = await response.text()
    if (response.status === 429 && cached) {
      return cached.data // Return stale data on rate limit if available
    }
    throw new Error(`API request failed: ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  cache.set(cacheKey, { data, timestamp: now })
  return data
}

async function fetchHetrixMonitors() {
  if (!HETRIX_API_KEY) {
    throw new Error('HETRIX_API_KEY is not configured')
  }

  try {
    // Fetch all monitors
    const url = `https://api.hetrixtools.com/v3/uptime-monitors`;
    console.log('Fetching monitors from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${HETRIX_API_KEY}`
      },
      cache: 'no-store'
    });

    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    if (!response.ok) {
      console.error('API Response Error:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        responseText: responseText
      });
      throw new Error(`Failed to fetch monitors: ${response.status} ${response.statusText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed API response:', data);
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error('Invalid JSON response from API');
    }

    if (!data) {
      console.error('No data in response');
      throw new Error('No data received from API');
    }

    // Map the response to our Monitor type
    const mappedMonitors = data.monitors.map((monitor: any) => ({
      id: monitor.id || '',
      name: monitor.name || '',
      status: monitor.uptime_status === 'up' ? 'operational' : 
             monitor.uptime_status === 'down' ? 'down' : 'degraded',
      uptime: parseFloat(monitor.uptime) || 100,
      lastCheck: new Date(monitor.last_check * 1000).toISOString(),
      type: monitor.type || 'http',
      responseTime: Object.values(monitor.locations || {}).reduce((avg: number, loc: any) => 
        avg + (loc.response_time || 0), 0) / Object.keys(monitor.locations || {}).length || 0,
      history: []
    }));

    console.log('Processed monitors:', mappedMonitors);
    return mappedMonitors;
  } catch (error) {
    console.error('Error fetching monitors:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const monitors = await fetchHetrixMonitors()
    return NextResponse.json({ monitors })
  } catch (error) {
    console.error('Error in GET handler:', error)
    return NextResponse.json(
      { error: 'Failed to fetch monitors' },
      { status: 500 }
    )
  }
}
