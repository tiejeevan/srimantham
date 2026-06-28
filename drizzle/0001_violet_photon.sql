CREATE TABLE "page_views" (
	"date" date PRIMARY KEY NOT NULL,
	"total_visits" integer DEFAULT 0 NOT NULL,
	"returning_visits" integer DEFAULT 0 NOT NULL,
	"total_time_spent_seconds" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" varchar(256) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
