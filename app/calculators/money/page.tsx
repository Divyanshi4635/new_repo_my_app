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
import { fireConfetti } from "@/lib/confetti";

const theme = getTheme("money");

const money = (n: number) =>
  Number.isFinite(n)
    ? n.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : "—";

function SavingsGoalTab() {
  const [goal, setGoal] = useState("500");
  const [saved, setSaved] = useState("120");
  const [weekly, setWeekly] = useState("15");

  const goalN = parseFloat(goal) || 0;
  const savedN = parseFloat(saved) || 0;
  const weeklyN = parseFloat(weekly) || 0;
  const remaining = Math.max(goalN - savedN, 0);
  const weeksLeft = weeklyN > 0 ? Math.ceil(remaining / weeklyN) : Infinity;
  const progress = goalN > 0 ? Math.min((savedN / goalN) * 100, 100) : 0;

  return (
    <div className="space-y-4">
      <NumberField label="🎯 My goal" value={goal} onChange={setGoal} suffix="₹/$" />
      <NumberField label="🐷 Already saved" value={saved} onChange={setSaved} suffix="₹/$" />
      <NumberField label="📅 Saved per week" value={weekly} onChange={setWeekly} suffix="₹/$" />

      <div className="h-4 w-full overflow-hidden rounded-full bg-white/70">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} transition-all`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <ResultCard
        theme={theme}
        label="Weeks until goal"
        value={weeksLeft === Infinity ? "∞" : `${weeksLeft} weeks`}
        detail={`You're ${progress.toFixed(0)}% of the way to ${money(goalN)}! 🌟`}
      />
    </div>
  );
}

function AllowanceTab() {
  const [amount, setAmount] = useState("100");
  const [savePct, setSavePct] = useState("50");
  const [spendPct, setSpendPct] = useState("30");
  const [givePct, setGivePct] = useState("20");

  const amt = parseFloat(amount) || 0;
  const s = parseFloat(savePct) || 0;
  const sp = parseFloat(spendPct) || 0;
  const g = parseFloat(givePct) || 0;
  const total = s + sp + g;

  return (
    <div className="space-y-4">
      <NumberField label="💵 Allowance amount" value={amount} onChange={setAmount} suffix="₹/$" />
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="🐷 Save %" value={savePct} onChange={setSavePct} />
        <NumberField label="🛍️ Spend %" value={spendPct} onChange={setSpendPct} />
        <NumberField label="🎁 Give %" value={givePct} onChange={setGivePct} />
      </div>
      {total !== 100 ? (
        <p className="text-sm font-bold text-rose-500">
          Percentages add up to {total}% — try making them total 100%!
        </p>
      ) : null}
      <div className="grid grid-cols-3 gap-3">
        <ResultCard theme={theme} label="Save" value={money((amt * s) / 100)} />
        <ResultCard theme={theme} label="Spend" value={money((amt * sp) / 100)} />
        <ResultCard theme={theme} label="Give" value={money((amt * g) / 100)} />
      </div>
    </div>
  );
}

function InterestTab() {
  const [principal, setPrincipal] = useState("1000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("3");
  const [compound, setCompound] = useState(true);

  const p = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const t = parseFloat(years) || 0;

  const finalAmount = compound ? p * Math.pow(1 + r, t) : p * (1 + r * t);
  const interestEarned = finalAmount - p;

  return (
    <div className="space-y-4">
      <NumberField label="💰 Starting amount" value={principal} onChange={setPrincipal} suffix="₹/$" />
      <NumberField label="📈 Interest rate" value={rate} onChange={setRate} suffix="% / yr" />
      <NumberField label="⏳ Years" value={years} onChange={setYears} suffix="yrs" />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCompound(false)}
          className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${
            !compound ? `bg-gradient-to-r ${theme.gradient} text-white` : "bg-white/70 text-slate-600"
          }`}
        >
          Simple
        </button>
        <button
          type="button"
          onClick={() => setCompound(true)}
          className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${
            compound ? `bg-gradient-to-r ${theme.gradient} text-white` : "bg-white/70 text-slate-600"
          }`}
        >
          Compound
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard theme={theme} label="Interest earned" value={money(interestEarned)} />
        <ResultCard theme={theme} label="Final amount" value={money(finalAmount)} />
      </div>
    </div>
  );
}

export default function MoneyMachine() {
  const { enabled } = useSound();
  const { bump } = useStreak();
  const [tab, setTab] = useState("goal");
  const [celebrated, setCelebrated] = useState(false);
  const bumpedRef = useRef(false);

  useEffect(() => {
    if (bumpedRef.current) return;
    bumpedRef.current = true;
    bump();
  }, [bump]);

  const mascotMsg = useMemo(() => {
    if (tab === "goal") return "Every coin counts toward your dream! Let's plan it. 🐷";
    if (tab === "allowance") return "Save some, spend some, share some — smart money moves! 💵";
    return "Watch your money grow like magic beans! 🌱";
  }, [tab]);

  function handleTabChange(next: string) {
    setTab(next);
    if (!celebrated) {
      setCelebrated(true);
      if (enabled) playSuccess();
      fireConfetti(["#fbbf24", "#f59e0b", "#facc15"]);
    }
  }

  return (
    <PageShell theme={theme}>
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <MascotBubble text={mascotMsg} mood="happy" />
        </div>

        <div className="rounded-3xl bg-white/60 p-5 shadow-xl backdrop-blur">
          <TabBar
            theme={theme}
            active={tab}
            onChange={handleTabChange}
            tabs={[
              { key: "goal", label: "Savings Goal", emoji: "🎯" },
              { key: "allowance", label: "Allowance", emoji: "💵" },
              { key: "interest", label: "Interest", emoji: "📈" },
            ]}
          />

          {tab === "goal" && <SavingsGoalTab />}
          {tab === "allowance" && <AllowanceTab />}
          {tab === "interest" && <InterestTab />}
        </div>
      </div>
    </PageShell>
  );
}
