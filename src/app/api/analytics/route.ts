import { NextResponse } from 'next/server';
import { db, pageViews } from '@/db';
import { sql } from 'drizzle-orm';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const timeSpentSeconds = Math.max(0, Math.min(Number(body.timeSpentSeconds) || 0, 86400)); // cap at 24h
    const isReturning = Boolean(body.isReturning);

    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    await db
      .insert(pageViews)
      .values({
        date: today,
        totalVisits: 1,
        returningVisits: isReturning ? 1 : 0,
        totalTimeSpentSeconds: timeSpentSeconds,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: pageViews.date,
        set: {
          totalVisits: sql`${pageViews.totalVisits} + 1`,
          returningVisits: sql`${pageViews.returningVisits} + ${isReturning ? 1 : 0}`,
          totalTimeSpentSeconds: sql`${pageViews.totalTimeSpentSeconds} + ${timeSpentSeconds}`,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
