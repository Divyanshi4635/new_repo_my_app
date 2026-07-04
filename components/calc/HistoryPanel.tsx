"use client";

import { useEffect, useState } from "react";
import { getHistory, type CalculationEntry } from "@/lib/db/actions";
import { CalcTheme } from "@/lib/theme";

export function HistoryPanel({
  calculator,
  refreshKey,
  theme,
}: {
  calculator: string;
  refreshKey: number;
  theme: CalcTheme;
}) {
  const [entries, setEntries] = useState<CalculationEntry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getHistory(calculator, 10).then((rows) => {
      if (!cancelled) setEntries(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [calculator, refreshKey]);

  if (entries.length === 0) return null;

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-bold text-slate-600 underline decoration-dotted underline-offset-4"
      >
        {open ? "Hide" : "Show"} recent calculations ({entries.length})
      </button>
      {open ? (
        <ul className="mt-2 space-y-1.5 rounded-2xl bg-white/60 p-3 backdrop-blur">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-3 font-mono text-sm"
            >
              <span className="truncate text-slate-500">{entry.expression}</span>
              <span className={`font-bold ${theme.text}`}>{entry.result}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
