"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalcTheme } from "@/lib/theme";
import { SoundToggleButton } from "@/components/SoundToggleButton";

export function PageShell({
  theme,
  children,
}: {
  theme: CalcTheme;
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.softBg}`}>
      <header className={`bg-gradient-to-r ${theme.gradient} shadow-lg`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 font-heading text-white transition hover:bg-white/30 active:scale-95"
          >
            <span aria-hidden>🏠</span> Home
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-2xl text-white drop-shadow sm:text-3xl"
          >
            <span aria-hidden className="mr-2">
              {theme.emoji}
            </span>
            {theme.name}
          </motion.h1>
          <SoundToggleButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  );
}
