CREATE TABLE "blessings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"message" text NOT NULL,
	"is_approved" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256),
	"phone" varchar(50),
	"status" boolean DEFAULT true NOT NULL,
	"guests_count" integer DEFAULT 1 NOT NULL,
	"food_preference" varchar(50) DEFAULT 'veg' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
