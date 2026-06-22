import { NextResponse } from 'next/server';
import { db, rsvps } from '@/db';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, status, guestsCount, foodPreference, notes } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Name is required.' },
        { status: 400 }
      );
    }

    const count = parseInt(guestsCount, 10);
    if (isNaN(count) || count < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid guests count.' },
        { status: 400 }
      );
    }

    // Insert RSVP
    const newRsvp = await db.insert(rsvps).values({
      name: name.trim(),
      email: email ? email.trim() : null,
      phone: phone ? phone.trim() : null,
      status: status !== false, // defaults to true (attending)
      guestsCount: status === false ? 0 : count, // 0 if not attending
      foodPreference: foodPreference || 'veg',
      notes: notes ? notes.trim() : null,
    }).returning();

    return NextResponse.json({ success: true, data: newRsvp[0] });
  } catch (error: any) {
    console.error('Error handling RSVP POST:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
