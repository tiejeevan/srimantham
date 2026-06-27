import { NextResponse } from 'next/server';
import { db, rsvps, settings } from '@/db';
import { desc } from 'drizzle-orm';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const adminPassword = process.env.ADMIN_PASSWORD || '087425';

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

    // Fetch settings
    const allSettings = await db.select().from(settings);
    const settingsMap = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

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
      settings: settingsMap,
    });
  } catch (error: any) {
    console.error('Error fetching admin data:', error);
    let errorMessage = error.message || 'Internal server error.';
    if (error.cause) {
      const causeMessage = error.cause instanceof Error ? error.cause.message : String(error.cause);
      errorMessage += ` (Cause: ${causeMessage})`;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const adminPassword = process.env.ADMIN_PASSWORD || '087425';

    if (token !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Support bulk updates
    if (body.settings && typeof body.settings === 'object') {
      for (const [key, value] of Object.entries(body.settings)) {
        await db
          .insert(settings)
          .values({ key, value: String(value) })
          .onConflictDoUpdate({
            target: settings.key,
            set: { value: String(value), updatedAt: new Date() },
          });
      }
      return NextResponse.json({ success: true });
    }

    // Support single update fallback
    const { key, value } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid setting key.' },
        { status: 400 }
      );
    }

    // Upsert setting
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: new Date() },
      });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
