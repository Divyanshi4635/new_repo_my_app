import {
  pgTable,
  uuid,
  text,
  integer,
  date,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export const calculations = pgTable("calculations", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceId: uuid("device_id").notNull(),
  calculator: text("calculator").notNull(),
  expression: text("expression").notNull(),
  result: text("result").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const streaks = pgTable("streaks", {
  deviceId: uuid("device_id").primaryKey(),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActiveDate: date("last_active_date"),
  badges: jsonb("badges").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
