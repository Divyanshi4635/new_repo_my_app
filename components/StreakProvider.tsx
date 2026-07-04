"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getStreak, recordActivity, type StreakState } from "@/lib/db/actions";
import { useSound } from "@/components/SoundProvider";
import { playSuccess } from "@/lib/sound";
import { fireBigConfetti } from "@/lib/confetti";

const EMPTY_STREAK: StreakState = {
  currentStreak: 0,
  longestStreak: 0,
  badges: [],
  newlyEarned: [],
};

type StreakContextValue = {
  streak: StreakState;
  loading: boolean;
  bump: () => Promise<StreakState["newlyEarned"]>;
};

const StreakContext = createContext<StreakContextValue>({
  streak: EMPTY_STREAK,
  loading: true,
  bump: async () => [],
});

export function StreakProvider({ children }: { children: React.ReactNode }) {
  const { enabled } = useSound();
  const [streak, setStreak] = useState<StreakState>(EMPTY_STREAK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getStreak()
      .then((s) => {
        if (!cancelled) setStreak(s);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const bump = useCallback(async () => {
    const result = await recordActivity();
    setStreak(result);
    if (result.newlyEarned.length > 0) {
      fireBigConfetti(["#fbbf24", "#f472b6", "#38bdf8"]);
      if (enabled) playSuccess();
    }
    return result.newlyEarned;
  }, [enabled]);

  return (
    <StreakContext.Provider value={{ streak, loading, bump }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreak() {
  return useContext(StreakContext);
}
