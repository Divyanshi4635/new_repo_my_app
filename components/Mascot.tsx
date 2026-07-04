"use client";

import { motion } from "framer-motion";

export type MascotMood = "happy" | "excited" | "thinking" | "wink";

const EYES: Record<MascotMood, string> = {
  happy: "⊙ ⊙",
  excited: "★ ★",
  thinking: "• •",
  wink: "⊙ ‿",
};

export function Mascot({
  mood = "happy",
  size = 88,
  className = "",
  bob = true,
}: {
  mood?: MascotMood;
  size?: number;
  className?: string;
  bob?: boolean;
}) {
  return (
    <motion.div
      className={`select-none ${className}`}
      style={{ width: size, height: size }}
      animate={bob ? { y: [0, -8, 0], rotate: [-2, 2, -2] } : undefined}
      transition={bob ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <ellipse cx="50" cy="92" rx="26" ry="5" fill="#00000014" />
        <circle cx="50" cy="52" r="38" fill="#FFD166" stroke="#F4A200" strokeWidth="3" />
        <circle cx="24" cy="26" r="7" fill="#FF6B6B" stroke="#D94848" strokeWidth="2" />
        <circle cx="76" cy="26" r="7" fill="#4ECDC4" stroke="#2FA39A" strokeWidth="2" />
        <rect x="26" y="40" width="48" height="26" rx="9" fill="#2D2A4A" />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontSize="14"
          fill="#7CFFCB"
          fontFamily="monospace"
        >
          {EYES[mood]}
        </text>
        <path
          d="M38 72 Q50 82 62 72"
          stroke="#2D2A4A"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="18" cy="60" r="7" fill="#FFD166" stroke="#F4A200" strokeWidth="3" />
        <circle cx="82" cy="60" r="7" fill="#FFD166" stroke="#F4A200" strokeWidth="3" />
      </svg>
    </motion.div>
  );
}

export function MascotBubble({
  text,
  mood = "happy",
  size = 72,
}: {
  text: string;
  mood?: MascotMood;
  size?: number;
}) {
  return (
    <div className="flex items-end gap-3">
      <Mascot mood={mood} size={size} />
      <motion.div
        key={text}
        initial={{ scale: 0.8, y: 6 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="relative rounded-2xl rounded-bl-none bg-white px-4 py-3 shadow-md font-heading text-base text-slate-700 max-w-xs"
      >
        {text}
      </motion.div>
    </div>
  );
}
