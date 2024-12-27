import { fetchMonitors } from '@/utils/api';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const preferredRegion = 'fra1';

export async function GET() {
    try {
        const { monitors } = await fetchMonitors();

        // Set cache headers
        const headers = new Headers();
        headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300');
        headers.set('CDN-Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300');
        headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300');

        return NextResponse.json(
            { monitors },
            {
                headers,
                status: 200
            }
        );
    } catch (error) {
        // Log error but don't expose details to client
        console.log('API Error:', error);
        
        return NextResponse.json(
            { monitors: [] },
            { 
                status: 200,
                headers: {
                    'Cache-Control': 'no-store'
                }
            }
        );
    }
}
