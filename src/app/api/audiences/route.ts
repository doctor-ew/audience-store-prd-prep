import { NextResponse } from 'next/server';
import { getAudiencesForSale } from '@/lib/data';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: Request) {
  try {
    const audiences = await getAudiencesForSale();
    return NextResponse.json(audiences);
  } catch (error) {
    console.error('Failed to fetch audiences:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
