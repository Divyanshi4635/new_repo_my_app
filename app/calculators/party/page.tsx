"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { MascotBubble } from "@/components/Mascot";
import { NumberField } from "@/components/calc/NumberField";
import { ResultCard, TabBar } from "@/components/calc/ResultCard";
import { getTheme } from "@/lib/theme";
import { useSound } from "@/components/SoundProvider";
import { useStreak } from "@/components/StreakProvider";
import { playSuccess } from "@/lib/sound";
import { fireBigConfetti } from "@/lib/confetti";

const theme = getTheme("party");

function PizzaTab() {
  const [friends, setFriends] = useState("6");
  const [slicesPerPizza, setSlicesPerPizza] = useState("8");
  const [pizzas, setPizzas] = useState("2");

  const f = parseInt(friends) || 1;
  const spp = parseInt(slicesPerPizza) || 1;
  const p = parseInt(pizzas) || 0;
  const totalSlices = spp * p;
  const perPerson = Math.floor(totalSlices / f);
  const leftover = totalSlices - perPerson * f;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="👧 Friends" value={friends} onChange={setFriends} />
        <NumberField label="🍕 Slices/pizza" value={slicesPerPizza} onChange={setSlicesPerPizza} />
        <NumberField label="🥡 Pizzas" value={pizzas} onChange={setPizzas} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ResultCard theme={theme} label="Slices per friend" value={`${perPerson}`} />
        <ResultCard theme={theme} label="Leftover slices" value={`${leftover}`} />
      </div>
    </div>
  );
}

function CandyTab() {
  const [candies, setCandies] = useState("50");
  const [friends, setFriends] = useState("4");

  const c = parseInt(candies) || 0;
  const f = parseInt(friends) || 1;
  const each = Math.floor(c / f);
  const leftover = c - each * f;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="🍬 Total candies" value={candies} onChange={setCandies} />
        <NumberField label="👧 Friends" value={friends} onChange={setFriends} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ResultCard theme={theme} label="Candies each" value={`${each}`} />
        <ResultCard theme={theme} label="Leftover candies" value={`${leftover}`} />
      </div>
    </div>
  );
}

function CountdownTab() {
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });

  const daysLeft = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(eventDate);
    target.setHours(0, 0, 0, 0);
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((target.getTime() - today.getTime()) / msPerDay);
  }, [eventDate]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-slate-600">🎉 Party date</span>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-lg font-semibold text-slate-800 outline-none focus:border-slate-400"
        />
      </label>
      <ResultCard
        theme={theme}
        label={daysLeft >= 0 ? "Days until the party" : "Days since the party"}
        value={`${Math.abs(daysLeft)} days`}
        detail={daysLeft === 0 ? "IT'S TODAY! 🥳🎈" : daysLeft > 0 ? "Start the countdown! ⏳" : "Hope it was a blast! 🎊"}
      />
    </div>
  );
}

export default function PartyPlanner() {
  const { enabled } = useSound();
  const { bump } = useStreak();
  const [tab, setTab] = useState("pizza");
  const [celebrated, setCelebrated] = useState(false);
  const bumpedRef = useRef(false);

  useEffect(() => {
    if (bumpedRef.current) return;
    bumpedRef.current = true;
    bump();
  }, [bump]);

  function handleTabChange(next: string) {
    setTab(next);
    if (!celebrated) {
      setCelebrated(true);
      if (enabled) playSuccess();
      fireBigConfetti();
    }
  }

  const mascotMsg =
    tab === "pizza"
      ? "Never argue over the last slice again! 🍕"
      : tab === "candy"
      ? "Sweet math for the sweetest treats! 🍭"
      : "Tick tock, the countdown is on! ⏰";

  return (
    <PageShell theme={theme}>
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <MascotBubble text={mascotMsg} mood="excited" />
        </div>

        <div className="rounded-3xl bg-white/60 p-5 shadow-xl backdrop-blur">
          <TabBar
            theme={theme}
            active={tab}
            onChange={handleTabChange}
            tabs={[
              { key: "pizza", label: "Pizza Split", emoji: "🍕" },
              { key: "candy", label: "Candy Split", emoji: "🍬" },
              { key: "countdown", label: "Countdown", emoji: "🎉" },
            ]}
          />
          {tab === "pizza" && <PizzaTab />}
          {tab === "candy" && <CandyTab />}
          {tab === "countdown" && <CountdownTab />}
        </div>
      </div>
    </PageShell>
  );
}
