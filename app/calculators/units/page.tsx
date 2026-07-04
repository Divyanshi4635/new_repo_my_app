"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { MascotBubble } from "@/components/Mascot";
import { NumberField } from "@/components/calc/NumberField";
import { ResultCard, TabBar } from "@/components/calc/ResultCard";
import { getTheme } from "@/lib/theme";

const theme = getTheme("units");

type Category = "length" | "weight" | "volume" | "speed" | "temperature";

const UNITS: Record<Category, { key: string; label: string; toBase: number }[]> = {
  length: [
    { key: "mm", label: "Millimeters", toBase: 0.001 },
    { key: "cm", label: "Centimeters", toBase: 0.01 },
    { key: "m", label: "Meters", toBase: 1 },
    { key: "km", label: "Kilometers", toBase: 1000 },
    { key: "in", label: "Inches", toBase: 0.0254 },
    { key: "ft", label: "Feet", toBase: 0.3048 },
    { key: "mi", label: "Miles", toBase: 1609.344 },
  ],
  weight: [
    { key: "mg", label: "Milligrams", toBase: 0.000001 },
    { key: "g", label: "Grams", toBase: 0.001 },
    { key: "kg", label: "Kilograms", toBase: 1 },
    { key: "lb", label: "Pounds", toBase: 0.453592 },
    { key: "oz", label: "Ounces", toBase: 0.0283495 },
  ],
  volume: [
    { key: "ml", label: "Milliliters", toBase: 0.001 },
    { key: "l", label: "Liters", toBase: 1 },
    { key: "cup", label: "Cups", toBase: 0.24 },
    { key: "gal", label: "Gallons", toBase: 3.78541 },
  ],
  speed: [
    { key: "mps", label: "Meters/sec", toBase: 1 },
    { key: "kph", label: "Km/hour", toBase: 0.277778 },
    { key: "mph", label: "Miles/hour", toBase: 0.44704 },
    { key: "knot", label: "Knots", toBase: 0.514444 },
  ],
  temperature: [
    { key: "c", label: "Celsius", toBase: 1 },
    { key: "f", label: "Fahrenheit", toBase: 1 },
    { key: "k", label: "Kelvin", toBase: 1 },
  ],
};

const CATEGORY_TABS: { key: Category; label: string; emoji: string }[] = [
  { key: "length", label: "Length", emoji: "📏" },
  { key: "weight", label: "Weight", emoji: "⚖️" },
  { key: "volume", label: "Volume", emoji: "🧃" },
  { key: "speed", label: "Speed", emoji: "🏎️" },
  { key: "temperature", label: "Temp", emoji: "🌡️" },
];

function toCelsius(value: number, unit: string): number {
  if (unit === "c") return value;
  if (unit === "f") return ((value - 32) * 5) / 9;
  return value - 273.15;
}

function fromCelsius(value: number, unit: string): number {
  if (unit === "c") return value;
  if (unit === "f") return (value * 9) / 5 + 32;
  return value + 273.15;
}

export default function UnitNinja() {
  const [category, setCategory] = useState<Category>("length");
  const units = UNITS[category];
  const [fromUnit, setFromUnit] = useState(units[0].key);
  const [toUnit, setToUnit] = useState(units[1]?.key ?? units[0].key);
  const [amount, setAmount] = useState("1");

  function switchCategory(next: Category) {
    setCategory(next);
    setFromUnit(UNITS[next][0].key);
    setToUnit(UNITS[next][1]?.key ?? UNITS[next][0].key);
  }

  const result = useMemo(() => {
    const value = parseFloat(amount) || 0;
    if (category === "temperature") {
      return fromCelsius(toCelsius(value, fromUnit), toUnit);
    }
    const from = units.find((u) => u.key === fromUnit)?.toBase ?? 1;
    const to = units.find((u) => u.key === toUnit)?.toBase ?? 1;
    return (value * from) / to;
  }, [amount, fromUnit, toUnit, category, units]);

  return (
    <PageShell theme={theme}>
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <MascotBubble
            text="Sneaky unit conversions, solved in a flash! ⚡🥷"
            mood="happy"
          />
        </div>

        <div className="rounded-3xl bg-white/60 p-5 shadow-xl backdrop-blur">
          <TabBar
            theme={theme}
            active={category}
            onChange={(k) => switchCategory(k as Category)}
            tabs={CATEGORY_TABS}
          />

          <div className="space-y-4">
            <NumberField label="Amount" value={amount} onChange={setAmount} />

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-slate-600">From</span>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 font-semibold text-slate-800 outline-none focus:border-slate-400"
                >
                  {units.map((u) => (
                    <option key={u.key} value={u.key}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-slate-600">To</span>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 font-semibold text-slate-800 outline-none focus:border-slate-400"
                >
                  {units.map((u) => (
                    <option key={u.key} value={u.key}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <ResultCard
              theme={theme}
              label="Converted value"
              value={Number.isFinite(result) ? result.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "—"}
              detail={`${amount || 0} ${fromUnit} = ${Number.isFinite(result) ? result.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "—"} ${toUnit}`}
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
