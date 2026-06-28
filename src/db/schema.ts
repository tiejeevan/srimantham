import { pgTable, serial, varchar, integer, boolean, timestamp, text, date, bigint } from 'drizzle-orm/pg-core';

export const rsvps = pgTable('rsvps', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }),
  phone: varchar('phone', { length: 50 }),
  status: boolean('status').notNull().default(true), // true = Attending, false = Declined
  guestsCount: integer('guests_count').notNull().default(1),
  foodPreference: varchar('food_preference', { length: 50 }).notNull().default('veg'), // veg, non-veg
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const blessings = pgTable('blessings', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  message: text('message').notNull(),
  isApproved: boolean('is_approved').default(true).notNull(), // for simple moderation
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const settings = pgTable('settings', {
  key: varchar('key', { length: 256 }).primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const pageViews = pgTable('page_views', {
  date: date('date').primaryKey(),
  totalVisits: integer('total_visits').notNull().default(0),
  returningVisits: integer('returning_visits').notNull().default(0),
  totalTimeSpentSeconds: bigint('total_time_spent_seconds', { mode: 'number' }).notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
