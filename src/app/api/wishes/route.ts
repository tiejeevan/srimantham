import { NextResponse } from 'next/server';
import { db, blessings } from '@/db';
import { desc, eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET() {
  try {
    const list = await db
      .select()
      .from(blessings)
      .where(eq(blessings.isApproved, true))
      .orderBy(desc(blessings.createdAt));

    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    console.error('Error fetching blessings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Name is required.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Blessing message is required.' },
        { status: 400 }
      );
    }

    // Insert Blessing
    const newBlessing = await db.insert(blessings).values({
      name: name.trim(),
      message: message.trim(),
      isApproved: true, // Default to auto-approve for simplicity, can moderate in admin panel
    }).returning();

    return NextResponse.json({ success: true, data: newBlessing[0] });
  } catch (error: any) {
    console.error('Error adding blessing:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
