import { fetchMonitors } from '@/utils/api';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const preferredRegion = 'fra1';

export async function GET() {
    try {
        if (!process.env.HETRIX_API_TOKEN) {
            console.error('HETRIX_API_TOKEN is not defined');
            throw new Error('API token not configured');
        }

        const { monitors } = await fetchMonitors();
        
        if (!monitors || monitors.length === 0) {
            console.log('No monitors returned from API');
        }

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
        // Enhanced error logging
        console.error('API Error:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        
        return NextResponse.json(
            { 
                monitors: [],
                error: process.env.NODE_ENV === 'development' 
                    ? error instanceof Error ? error.message : 'Unknown error'
                    : 'Internal server error'
            },
            { 
                status: 500
            }
        );
    }
}
