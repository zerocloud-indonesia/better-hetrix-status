import { NextResponse } from 'next/server'
import { fetchMonitors } from '@/utils/api'

export async function GET() {
  try {
    const data = await fetchMonitors();
    
    // Return response with cache headers
    return new NextResponse(JSON.stringify(data), {
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
