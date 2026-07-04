"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { THEMES } from "@/lib/theme";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Mascot } from "@/components/Mascot";
import { FloatingShapes } from "@/components/FloatingShapes";
import { SoundToggleButton } from "@/components/SoundToggleButton";

export default function Home() {
  return (
    <div className="relative flex-1 overflow-hidden">
      <FloatingShapes />
      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:py-16">
        <div className="flex items-start justify-between">
          <div className="flex-1" />
          <SoundToggleButton />
        </div>

        <div className="flex flex-col items-center text-center">
          <Mascot mood="excited" size={120} />
          <motion.h1
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            className="mt-4 font-heading text-4xl text-slate-800 sm:text-6xl"
          >
            Calcy&apos;s Calculator Carnival
          </motion.h1>
          <motion.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-slate-600 sm:text-xl"
          >
            Pick a colorful calculator below and let Calcy the robot help you
            crunch numbers — from homework to piggy banks to party planning! 🎊
          </motion.p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((theme, i) => (
            <CalculatorCard key={theme.slug} theme={theme} index={i} />
          ))}
        </div>

        <footer className="mt-16 flex flex-col items-center gap-2 text-center text-sm text-slate-500">
          <p>Made with 💛 for curious minds of every age.</p>
          <Link href="/roadmap" className="underline decoration-dotted underline-offset-4 hover:text-slate-700">
            🗺️ See what we&apos;re building next
          </Link>
        </footer>
      </div>
    </div>
  );
}
