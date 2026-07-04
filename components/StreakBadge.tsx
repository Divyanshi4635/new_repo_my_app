"use client";

import { useStreak } from "@/components/StreakProvider";

export function StreakBadge() {
  const { streak, loading } = useStreak();

  if (loading || streak.currentStreak === 0) return null;

  const latest = streak.newlyEarned[streak.newlyEarned.length - 1];

  return (
    <div className="relative">
      <div
        className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-bold text-slate-700 shadow-md backdrop-blur"
        title={`Longest streak: ${streak.longestStreak} day${streak.longestStreak === 1 ? "" : "s"}`}
      >
        <span aria-hidden>🔥</span>
        {streak.currentStreak}-day streak
      </div>
      {latest ? (
        <div
          key={latest.badge}
          className="animate-badge-pop absolute right-0 top-full z-10 mt-2 w-56 rounded-xl bg-white p-3 text-sm font-bold text-slate-700 shadow-xl"
        >
          <span className="mr-1">{latest.emoji}</span>
          New badge: {latest.label}!
        </div>
      ) : null}
    </div>
  );
}
