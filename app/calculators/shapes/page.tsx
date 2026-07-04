"use client";

import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { MascotBubble } from "@/components/Mascot";
import { NumberField } from "@/components/calc/NumberField";
import { ResultCard, TabBar } from "@/components/calc/ResultCard";
import { getTheme } from "@/lib/theme";
import { useStreak } from "@/components/StreakProvider";

const theme = getTheme("shapes");
const fmt = (n: number) => (Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—");

type ShapeKey =
  | "circle"
  | "rectangle"
  | "triangle"
  | "cube"
  | "sphere"
  | "cylinder";

const SHAPES_2D: { key: ShapeKey; label: string; emoji: string }[] = [
  { key: "circle", label: "Circle", emoji: "⚪" },
  { key: "rectangle", label: "Rectangle", emoji: "▭" },
  { key: "triangle", label: "Triangle", emoji: "🔺" },
];

const SHAPES_3D: { key: ShapeKey; label: string; emoji: string }[] = [
  { key: "cube", label: "Cube", emoji: "🧊" },
  { key: "sphere", label: "Sphere", emoji: "🌐" },
  { key: "cylinder", label: "Cylinder", emoji: "🥫" },
];

function ShapeForm({ shape }: { shape: ShapeKey }) {
  const [a, setA] = useState("5");
  const [b, setB] = useState("8");
  const [c, setC] = useState("6");

  const aN = parseFloat(a) || 0;
  const bN = parseFloat(b) || 0;
  const cN = parseFloat(c) || 0;

  let fields: { label: string; value: string; set: (v: string) => void; suffix: string }[] = [];
  let results: { label: string; value: string }[] = [];

  switch (shape) {
    case "circle":
      fields = [{ label: "Radius", value: a, set: setA, suffix: "units" }];
      results = [
        { label: "Area", value: fmt(Math.PI * aN * aN) },
        { label: "Circumference", value: fmt(2 * Math.PI * aN) },
      ];
      break;
    case "rectangle":
      fields = [
        { label: "Width", value: a, set: setA, suffix: "units" },
        { label: "Height", value: b, set: setB, suffix: "units" },
      ];
      results = [
        { label: "Area", value: fmt(aN * bN) },
        { label: "Perimeter", value: fmt(2 * (aN + bN)) },
      ];
      break;
    case "triangle":
      fields = [
        { label: "Base", value: a, set: setA, suffix: "units" },
        { label: "Height", value: b, set: setB, suffix: "units" },
        { label: "Side + Side", value: c, set: setC, suffix: "sum of other 2 sides" },
      ];
      results = [
        { label: "Area", value: fmt(0.5 * aN * bN) },
        { label: "Perimeter (approx)", value: fmt(aN + cN) },
      ];
      break;
    case "cube":
      fields = [{ label: "Side", value: a, set: setA, suffix: "units" }];
      results = [
        { label: "Volume", value: fmt(aN ** 3) },
        { label: "Surface Area", value: fmt(6 * aN * aN) },
      ];
      break;
    case "sphere":
      fields = [{ label: "Radius", value: a, set: setA, suffix: "units" }];
      results = [
        { label: "Volume", value: fmt((4 / 3) * Math.PI * aN ** 3) },
        { label: "Surface Area", value: fmt(4 * Math.PI * aN * aN) },
      ];
      break;
    case "cylinder":
      fields = [
        { label: "Radius", value: a, set: setA, suffix: "units" },
        { label: "Height", value: b, set: setB, suffix: "units" },
      ];
      results = [
        { label: "Volume", value: fmt(Math.PI * aN * aN * bN) },
        { label: "Surface Area", value: fmt(2 * Math.PI * aN * (aN + bN)) },
      ];
      break;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <NumberField key={f.label} label={f.label} value={f.value} onChange={f.set} suffix={f.suffix} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {results.map((r) => (
          <ResultCard key={r.label} theme={theme} label={r.label} value={r.value} />
        ))}
      </div>
    </div>
  );
}

export default function ShapeShifter() {
  const { bump } = useStreak();
  const [mode, setMode] = useState<"2d" | "3d">("2d");
  const [shape, setShape] = useState<ShapeKey>("circle");
  const bumpedRef = useRef(false);

  useEffect(() => {
    if (bumpedRef.current) return;
    bumpedRef.current = true;
    bump();
  }, [bump]);

  const shapes = mode === "2d" ? SHAPES_2D : SHAPES_3D;

  function switchMode(next: "2d" | "3d") {
    setMode(next);
    setShape(next === "2d" ? "circle" : "cube");
  }

  return (
    <PageShell theme={theme}>
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <MascotBubble
            text="Shapes are everywhere! Let's measure them together. 🔺🌐🧊"
            mood="happy"
          />
        </div>

        <div className="rounded-3xl bg-white/60 p-5 shadow-xl backdrop-blur">
          <TabBar
            theme={theme}
            active={mode}
            onChange={(k) => switchMode(k as "2d" | "3d")}
            tabs={[
              { key: "2d", label: "Flat Shapes", emoji: "📐" },
              { key: "3d", label: "Solid Shapes", emoji: "🧊" },
            ]}
          />

          <div className="mb-5 flex flex-wrap gap-2">
            {shapes.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setShape(s.key)}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold transition ${
                  shape === s.key
                    ? `bg-gradient-to-r ${theme.gradient} text-white`
                    : "bg-white/70 text-slate-600 hover:bg-white"
                }`}
              >
                <span className="text-lg">{s.emoji}</span> {s.label}
              </button>
            ))}
          </div>

          <ShapeForm key={shape} shape={shape} />
        </div>
      </div>
    </PageShell>
  );
}
