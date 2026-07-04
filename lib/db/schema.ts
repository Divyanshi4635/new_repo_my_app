import type { AnyPgColumn } from "drizzle-orm/pg-core";
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

// Product roadmap, as a nested phase > task > subtask > microtask tree.
// Self-referencing adjacency list: parentId is null for top-level phases.
export const version1 = pgTable("version_1", {
  id: uuid("id").defaultRandom().primaryKey(),
  parentId: uuid("parent_id").references((): AnyPgColumn => version1.id, {
    onDelete: "cascade",
  }),
  level: text("level").$type<"phase" | "task" | "subtask" | "microtask">().notNull(),
  position: integer("position").notNull().default(0),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status")
    .$type<"planned" | "in_progress" | "done">()
    .notNull()
    .default("planned"),
  impact: text("impact").$type<"low" | "medium" | "high">(),
  complexity: text("complexity").$type<"low" | "medium" | "high">(),
  category: text("category"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
