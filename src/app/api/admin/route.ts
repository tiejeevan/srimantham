import { NextResponse } from 'next/server';
import { db, rsvps } from '@/db';
import { desc } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const adminPassword = process.env.ADMIN_PASSWORD || 'shreemantam2026';

    if (token !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    // Fetch all RSVPs
    const allRsvps = await db
      .select()
      .from(rsvps)
      .orderBy(desc(rsvps.createdAt));

    // Calculate stats
    let totalResponses = allRsvps.length;
    let totalAttendingGuests = 0;
    let vegCount = 0;
    let nonVegCount = 0;
    let declinedCount = 0;

    allRsvps.forEach((r) => {
      if (r.status) {
        totalAttendingGuests += r.guestsCount;
        if (r.foodPreference === 'veg') {
          vegCount += r.guestsCount;
        } else {
          nonVegCount += r.guestsCount;
        }
      } else {
        declinedCount += 1;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalResponses,
        totalAttendingGuests,
        vegCount,
        nonVegCount,
        declinedCount,
      },
      rsvps: allRsvps,
    });
  } catch (error: any) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
