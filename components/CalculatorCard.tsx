"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalcTheme } from "@/lib/theme";

export function CalculatorCard({
  theme,
  index,
}: {
  theme: CalcTheme;
  index: number;
}) {
  return (
    <motion.div
      initial={{ y: 24 }}
      animate={{ y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 18 }}
      whileHover={{ y: -8, rotate: index % 2 === 0 ? -2 : 2 }}
      whileTap={{ scale: 0.96 }}
    >
      <Link
        href={`/calculators/${theme.slug}`}
        className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${theme.gradient} p-6 text-white shadow-xl transition-shadow hover:shadow-2xl`}
      >
        <div
          aria-hidden
          className="absolute -right-6 -top-6 text-8xl opacity-20 transition group-hover:scale-125 group-hover:opacity-30"
        >
          {theme.emoji}
        </div>
        <div className="relative">
          <span className="text-5xl">{theme.emoji}</span>
          <h3 className="mt-3 font-heading text-2xl">{theme.name}</h3>
          <p className="mt-1 text-sm text-white/90">{theme.tagline}</p>
        </div>
        <span className="relative mt-6 inline-flex w-fit items-center gap-1 rounded-full bg-white/25 px-4 py-2 text-sm font-bold backdrop-blur transition group-hover:bg-white/40">
          Let&apos;s go <span aria-hidden>→</span>
        </span>
      </Link>
    </motion.div>
  );
}
