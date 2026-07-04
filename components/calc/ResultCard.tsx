"use client";

import { motion } from "framer-motion";
import { CalcTheme } from "@/lib/theme";

export function ResultCard({
  theme,
  label,
  value,
  detail,
}: {
  theme: CalcTheme;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <motion.div
      key={value}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`rounded-2xl bg-gradient-to-br ${theme.gradient} p-5 text-white shadow-lg`}
    >
      <p className="text-sm font-bold uppercase tracking-wide text-white/80">
        {label}
      </p>
      <p className="mt-1 font-heading text-3xl sm:text-4xl">{value}</p>
      {detail ? <p className="mt-1 text-sm text-white/90">{detail}</p> : null}
    </motion.div>
  );
}

export function TabBar({
  tabs,
  active,
  onChange,
  theme,
}: {
  tabs: { key: string; label: string; emoji: string }[];
  active: string;
  onChange: (key: string) => void;
  theme: CalcTheme;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-bold shadow transition ${
              isActive
                ? `bg-gradient-to-r ${theme.gradient} text-white`
                : "bg-white/70 text-slate-600 hover:bg-white"
            }`}
          >
            <span className="mr-1">{tab.emoji}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
