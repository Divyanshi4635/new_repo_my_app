"use client";

import { useSound } from "@/components/SoundProvider";

export function SoundToggleButton() {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute sound effects" : "Unmute sound effects"}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-xl shadow-md backdrop-blur transition hover:scale-110 active:scale-95"
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}
