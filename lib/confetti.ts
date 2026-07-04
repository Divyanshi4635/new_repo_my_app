import confetti from "canvas-confetti";

export function fireConfetti(colors?: string[]) {
  confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 35,
    origin: { y: 0.6 },
    colors: colors ?? ["#f472b6", "#facc15", "#38bdf8", "#4ade80", "#a78bfa"],
  });
}

export function fireBigConfetti(colors?: string[]) {
  const opts = {
    colors: colors ?? ["#f472b6", "#facc15", "#38bdf8", "#4ade80", "#a78bfa"],
  };
  confetti({ ...opts, particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
  confetti({ ...opts, particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
  confetti({ ...opts, particleCount: 80, spread: 100, origin: { y: 0.5 } });
}
