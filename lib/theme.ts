export type CalcTheme = {
  slug: string;
  name: string;
  tagline: string;
  emoji: string;
  gradient: string;
  softBg: string;
  button: string;
  ring: string;
  text: string;
};

export const THEMES: CalcTheme[] = [
  {
    slug: "math",
    name: "Math Blaster",
    tagline: "Add, subtract & blast off with numbers!",
    emoji: "🚀",
    gradient: "from-indigo-500 via-violet-500 to-purple-500",
    softBg: "from-indigo-50 to-violet-100",
    button: "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700",
    ring: "focus-visible:ring-indigo-400",
    text: "text-indigo-600",
  },
  {
    slug: "science",
    name: "Science Lab",
    tagline: "Sines, logs & bubbling experiments!",
    emoji: "🧪",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    softBg: "from-emerald-50 to-teal-100",
    button: "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700",
    ring: "focus-visible:ring-emerald-400",
    text: "text-emerald-600",
  },
  {
    slug: "money",
    name: "Money Machine",
    tagline: "Grow your piggy bank & split allowance!",
    emoji: "🐷",
    gradient: "from-amber-400 via-orange-400 to-yellow-500",
    softBg: "from-amber-50 to-orange-100",
    button: "bg-amber-500 hover:bg-amber-600 active:bg-amber-700",
    ring: "focus-visible:ring-amber-400",
    text: "text-amber-600",
  },
  {
    slug: "health",
    name: "Body & Health",
    tagline: "BMI, age & energy — know your body!",
    emoji: "❤️",
    gradient: "from-rose-400 via-pink-500 to-red-400",
    softBg: "from-rose-50 to-pink-100",
    button: "bg-rose-500 hover:bg-rose-600 active:bg-rose-700",
    ring: "focus-visible:ring-rose-400",
    text: "text-rose-600",
  },
  {
    slug: "shapes",
    name: "Shape Shifter",
    tagline: "Areas, perimeters & 3D volume magic!",
    emoji: "🔺",
    gradient: "from-fuchsia-500 via-purple-500 to-orange-400",
    softBg: "from-fuchsia-50 to-purple-100",
    button: "bg-fuchsia-500 hover:bg-fuchsia-600 active:bg-fuchsia-700",
    ring: "focus-visible:ring-fuchsia-400",
    text: "text-fuchsia-600",
  },
  {
    slug: "units",
    name: "Unit Ninja",
    tagline: "Convert length, weight & speed instantly!",
    emoji: "🥷",
    gradient: "from-cyan-500 via-sky-500 to-indigo-500",
    softBg: "from-cyan-50 to-sky-100",
    button: "bg-sky-500 hover:bg-sky-600 active:bg-sky-700",
    ring: "focus-visible:ring-sky-400",
    text: "text-sky-600",
  },
  {
    slug: "party",
    name: "Party Planner",
    tagline: "Split pizza, candy & count down birthdays!",
    emoji: "🎉",
    gradient: "from-pink-500 via-yellow-400 to-cyan-400",
    softBg: "from-pink-50 to-yellow-100",
    button: "bg-pink-500 hover:bg-pink-600 active:bg-pink-700",
    ring: "focus-visible:ring-pink-400",
    text: "text-pink-600",
  },
];

export function getTheme(slug: string): CalcTheme {
  const found = THEMES.find((t) => t.slug === slug);
  if (!found) throw new Error(`Unknown calculator theme: ${slug}`);
  return found;
}
