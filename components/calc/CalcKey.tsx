"use client";

import { motion } from "framer-motion";

type Variant = "num" | "op" | "action" | "equals";

const VARIANT_CLASSES: Record<Variant, string> = {
  num: "bg-white text-slate-800 hover:bg-slate-50",
  op: "bg-white/70 text-slate-800 hover:bg-white",
  action: "bg-white/40 text-slate-700 hover:bg-white/60",
  equals: "text-white shadow-lg",
};

export function CalcKey({
  label,
  onClick,
  variant = "num",
  className = "",
  equalsClassName,
  span = 1,
}: {
  label: React.ReactNode;
  onClick: () => void;
  variant?: Variant;
  className?: string;
  equalsClassName?: string;
  span?: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className={`flex h-16 items-center justify-center rounded-2xl font-heading text-xl shadow transition ${
        VARIANT_CLASSES[variant]
      } ${variant === "equals" ? equalsClassName ?? "bg-slate-800" : ""} ${className}`}
      style={span > 1 ? { gridColumn: `span ${span} / span ${span}` } : undefined}
    >
      {label}
    </motion.button>
  );
}
