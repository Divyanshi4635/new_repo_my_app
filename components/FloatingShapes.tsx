const SHAPES = [
  { emoji: "➕", top: "8%", left: "6%", size: "text-4xl", delay: "0s" },
  { emoji: "⭐", top: "18%", left: "88%", size: "text-3xl", delay: "0.6s" },
  { emoji: "🔺", top: "70%", left: "4%", size: "text-4xl", delay: "1.2s" },
  { emoji: "➗", top: "80%", left: "90%", size: "text-3xl", delay: "0.3s" },
  { emoji: "🧮", top: "45%", left: "94%", size: "text-4xl", delay: "0.9s" },
  { emoji: "✨", top: "35%", left: "2%", size: "text-3xl", delay: "1.5s" },
  { emoji: "🎈", top: "5%", left: "45%", size: "text-3xl", delay: "0.4s" },
];

export function FloatingShapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {SHAPES.map((s, i) => (
        <span
          key={i}
          className={`animate-float absolute ${s.size} opacity-40`}
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  );
}
