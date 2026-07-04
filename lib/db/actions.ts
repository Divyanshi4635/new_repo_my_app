"use server";

import { cookies } from "next/headers";
import { and, desc, eq } from "drizzle-orm";
import { db } from "./client";
import { calculations, streaks } from "./schema";
import { MILESTONES } from "./milestones";

const DEVICE_COOKIE = "calcy_device_id";
const TWO_YEARS = 60 * 60 * 24 * 365 * 2;

async function ensureDeviceId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(DEVICE_COOKIE)?.value;
  if (existing) return existing;

  const id = crypto.randomUUID();
  store.set(DEVICE_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TWO_YEARS,
    path: "/",
  });
  return id;
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round(
    (new Date(`${a}T00:00:00Z`).getTime() - new Date(`${b}T00:00:00Z`).getTime()) /
      msPerDay
  );
}

export type StreakState = {
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  newlyEarned: (typeof MILESTONES)[number][];
};

export async function getStreak(): Promise<StreakState> {
  const deviceId = await ensureDeviceId();
  const [row] = await db
    .select()
    .from(streaks)
    .where(eq(streaks.deviceId, deviceId))
    .limit(1);

  if (!row) {
    return { currentStreak: 0, longestStreak: 0, badges: [], newlyEarned: [] };
  }
  return {
    currentStreak: row.currentStreak,
    longestStreak: row.longestStreak,
    badges: row.badges,
    newlyEarned: [],
  };
}

export async function recordActivity(): Promise<StreakState> {
  const deviceId = await ensureDeviceId();
  const today = todayUTC();

  const [existing] = await db
    .select()
    .from(streaks)
    .where(eq(streaks.deviceId, deviceId))
    .limit(1);

  if (!existing) {
    const badges = MILESTONES.filter((m) => m.days <= 1).map((m) => m.badge);
    await db.insert(streaks).values({
      deviceId,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: today,
      badges,
    });
    return {
      currentStreak: 1,
      longestStreak: 1,
      badges,
      newlyEarned: MILESTONES.filter((m) => badges.includes(m.badge)),
    };
  }

  if (existing.lastActiveDate === today) {
    return {
      currentStreak: existing.currentStreak,
      longestStreak: existing.longestStreak,
      badges: existing.badges,
      newlyEarned: [],
    };
  }

  const gap = existing.lastActiveDate
    ? daysBetween(today, existing.lastActiveDate)
    : null;
  const nextStreak = gap === 1 ? existing.currentStreak + 1 : 1;
  const nextLongest = Math.max(existing.longestStreak, nextStreak);
  const previousBadges = new Set(existing.badges);
  const nextBadges = MILESTONES.filter((m) => m.days <= nextStreak).map(
    (m) => m.badge
  );
  const newlyEarned = MILESTONES.filter(
    (m) => nextBadges.includes(m.badge) && !previousBadges.has(m.badge)
  );

  await db
    .update(streaks)
    .set({
      currentStreak: nextStreak,
      longestStreak: nextLongest,
      lastActiveDate: today,
      badges: nextBadges,
      updatedAt: new Date(),
    })
    .where(eq(streaks.deviceId, deviceId));

  return {
    currentStreak: nextStreak,
    longestStreak: nextLongest,
    badges: nextBadges,
    newlyEarned,
  };
}

export async function logCalculation(
  calculator: string,
  expression: string,
  result: string
): Promise<void> {
  const deviceId = await ensureDeviceId();
  await db.insert(calculations).values({ deviceId, calculator, expression, result });
}

export type CalculationEntry = {
  id: string;
  expression: string;
  result: string;
  createdAt: string;
};

export async function getHistory(
  calculator: string,
  limit = 10
): Promise<CalculationEntry[]> {
  const deviceId = await ensureDeviceId();
  const rows = await db
    .select()
    .from(calculations)
    .where(
      and(eq(calculations.deviceId, deviceId), eq(calculations.calculator, calculator))
    )
    .orderBy(desc(calculations.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    expression: r.expression,
    result: r.result,
    createdAt: r.createdAt.toISOString(),
  }));
}
