import { NextRequest, NextResponse } from 'next/server';

const HETRIX_API_KEY = process.env.HETRIX_API_KEY;
const HETRIX_API_URL = 'https://api.hetrixtools.com/v3';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!HETRIX_API_KEY) {
    console.error('API key missing');
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { id } = params;
    const headers = {
      'X-Access-Token': HETRIX_API_KEY,
      Accept: 'application/json',
    };

    console.log('Fetching single monitor:', id);
    const response = await fetch(
      `${HETRIX_API_URL}/uptime/monitors/get/${id}/`,
      {
        headers,
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch monitor: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Raw monitor data:', data);
    
    if (!data || !data.data) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response format from Hetrix API');
    }

    // Transform the data to match our Monitor type
    const monitor = {
      id: data.data.id?.toString() || '',
      name: data.data.name || '',
      status: data.data.status === 1 ? 'operational' : data.data.status === 2 ? 'degraded' : 'down',
      uptime: parseFloat(data.data.uptime) || 100,
      lastCheck: new Date(data.data.last_check * 1000).toISOString(),
      type: data.data.type || 'http',
      responseTime: parseInt(data.data.response_time) || 0,
      history: [] // We'll implement history if needed
    };

    console.log('Processed monitor:', monitor);
    return NextResponse.json(monitor);
  } catch (error) {
    console.error('Error fetching monitor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitor' },
      { status: 500 }
    );
  }
}
