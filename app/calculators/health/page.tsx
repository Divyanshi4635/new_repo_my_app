"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { MascotBubble } from "@/components/Mascot";
import { NumberField } from "@/components/calc/NumberField";
import { ResultCard, TabBar } from "@/components/calc/ResultCard";
import { getTheme } from "@/lib/theme";

const theme = getTheme("health");

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Light & Lean", emoji: "🪶" };
  if (bmi < 25) return { label: "Right in the Zone", emoji: "🌟" };
  if (bmi < 30) return { label: "Sturdy & Strong", emoji: "💪" };
  return { label: "Extra Sturdy", emoji: "🐻" };
}

function BmiTab() {
  const [weight, setWeight] = useState("40");
  const [height, setHeight] = useState("140");

  const w = parseFloat(weight) || 0;
  const hCm = parseFloat(height) || 0;
  const hM = hCm / 100;
  const bmi = hM > 0 ? w / (hM * hM) : 0;
  const cat = bmiCategory(bmi);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="⚖️ Weight" value={weight} onChange={setWeight} suffix="kg" />
        <NumberField label="📏 Height" value={height} onChange={setHeight} suffix="cm" />
      </div>
      <ResultCard
        theme={theme}
        label="Your BMI"
        value={bmi ? bmi.toFixed(1) : "—"}
        detail={`${cat.emoji} ${cat.label}`}
      />
      <p className="text-xs text-slate-500">
        This is just a fun size check, not a report card — a doctor or school
        nurse is always the best person to ask about growth. 🩺
      </p>
    </div>
  );
}

function AgeTab() {
  const [birthDate, setBirthDate] = useState("2015-06-15");

  const stats = useMemo(() => {
    const today = new Date();
    const dob = new Date(birthDate);
    if (Number.isNaN(dob.getTime())) return null;

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.floor((today.getTime() - dob.getTime()) / msPerDay);

    const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBirthday.getTime() < today.getTime()) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / msPerDay);

    return { years, months, days, totalDays, daysToBirthday };
  }, [birthDate]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-slate-600">🎂 Birthday</span>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-lg font-semibold text-slate-800 outline-none focus:border-slate-400"
        />
      </label>

      {stats ? (
        <>
          <ResultCard
            theme={theme}
            label="You are"
            value={`${stats.years}y ${stats.months}m ${stats.days}d`}
          />
          <div className="grid grid-cols-2 gap-3">
            <ResultCard theme={theme} label="Days alive" value={stats.totalDays.toLocaleString()} />
            <ResultCard
              theme={theme}
              label="Next birthday"
              value={`${stats.daysToBirthday} days`}
              detail="🎉 Get the balloons ready!"
            />
          </div>
        </>
      ) : (
        <p className="text-sm text-rose-500">Pick a valid birthday to see the magic ✨</p>
      )}
    </div>
  );
}

function EnergyTab() {
  const [weight, setWeight] = useState("40");
  const [height, setHeight] = useState("140");
  const [age, setAge] = useState("10");
  const [activity, setActivity] = useState("moderate");

  const w = parseFloat(weight) || 0;
  const hCm = parseFloat(height) || 0;
  const a = parseFloat(age) || 0;

  const bmr = 10 * w + 6.25 * hCm - 5 * a + 5;
  const multipliers: Record<string, number> = {
    low: 1.2,
    moderate: 1.55,
    high: 1.8,
  };
  const calories = bmr * multipliers[activity];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="⚖️ Weight" value={weight} onChange={setWeight} suffix="kg" />
        <NumberField label="📏 Height" value={height} onChange={setHeight} suffix="cm" />
        <NumberField label="🎂 Age" value={age} onChange={setAge} suffix="yrs" />
      </div>

      <div className="flex gap-2">
        {[
          { key: "low", label: "Chill 🛋️" },
          { key: "moderate", label: "Active 🚴" },
          { key: "high", label: "Super Active 🏃" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setActivity(opt.key)}
            className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${
              activity === opt.key
                ? `bg-gradient-to-r ${theme.gradient} text-white`
                : "bg-white/70 text-slate-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <ResultCard
        theme={theme}
        label="Energy needed per day"
        value={`${Math.round(calories).toLocaleString()} kcal`}
        detail="A fun estimate of your body's daily fuel! ⛽"
      />
    </div>
  );
}

export default function BodyHealth() {
  const [tab, setTab] = useState("bmi");

  const mascotMsg =
    tab === "bmi"
      ? "Every body is different and amazing — let's just check some numbers! ❤️"
      : tab === "age"
      ? "Let's count every single day of your wonderful life! 🎂"
      : "Food is fuel — let's see how much your body needs! ⛽";

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
            onChange={setTab}
            tabs={[
              { key: "bmi", label: "BMI", emoji: "⚖️" },
              { key: "age", label: "Age", emoji: "🎂" },
              { key: "energy", label: "Energy", emoji: "⛽" },
            ]}
          />
          {tab === "bmi" && <BmiTab />}
          {tab === "age" && <AgeTab />}
          {tab === "energy" && <EnergyTab />}
        </div>
      </div>
    </PageShell>
  );
}
