import { NextResponse } from 'next/server'
import { getAudiencesForSale } from '@/lib/data'

export async function GET() {
  try {
    const audiences = await getAudiencesForSale()
    return NextResponse.json(audiences)
  } catch (error) {
    console.error('Error fetching audiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audiences' },
      { status: 500 }
    )
  }
}