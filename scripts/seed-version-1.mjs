// One-off seed script for the `version_1` product roadmap table.
// Run with: node --env-file=.env.local scripts/seed-version-1.mjs
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// Tree shape: { title, description?, status?, impact?, complexity?, category?, children? }
const ROADMAP = [
  {
    title: "Phase 1 — Quick Wins",
    description:
      "Low-complexity, mostly independent items. Ship in a day or two each.",
    children: [
      {
        title: "Keyboard input support",
        description:
          "Every competitor calculator supports typing; right now desktop users must click every button.",
        impact: "high",
        complexity: "low",
        category: "Accessibility",
        children: [
          {
            title: "Build a shared useCalculatorKeyboard hook",
            children: [
              { title: "Map digit keys 0-9 to inputDigit" },
              { title: "Map +, -, *, / to chooseOperator" },
              { title: "Map Enter/= to handleEquals, Escape to clearAll, Backspace to backspace" },
              { title: "Ignore keystrokes while focus is inside a text input elsewhere on the page" },
            ],
          },
          { title: "Wire the hook into Math Blaster" },
          { title: "Wire the hook into Science Lab (sin/cos/log stay mouse-only for now)" },
        ],
      },
      {
        title: "aria-live result announcements",
        description:
          "Screen reader users currently get no feedback when a calculation completes — a WCAG 2.2 must-have.",
        impact: "high",
        complexity: "low",
        category: "Accessibility",
        children: [
          { title: "Add role=\"status\" aria-live=\"polite\" to CalcScreen's result value" },
          { title: "Add aria-live=\"assertive\" for error states (Oops!, division by zero)" },
          { title: "Manually verify announcements with VoiceOver and NVDA" },
        ],
      },
      {
        title: "\"No ads, no tracking, kid-safe\" privacy page",
        description:
          "Khan Academy Kids treats this as a headline trust signal, not fine print.",
        impact: "high",
        complexity: "low",
        category: "Trust / legal",
        children: [
          {
            title: "Write plain-language privacy copy",
            children: [
              { title: "Disclose the anonymous device id + streak/history data now collected" },
              { title: "State explicitly: no names, no emails, no accounts, no ads, no third-party trackers" },
            ],
          },
          { title: "Build the /privacy route" },
          { title: "Link the privacy page from the home page footer" },
        ],
      },
      {
        title: "Per-page SEO metadata + Open Graph",
        description:
          "Every calculator currently shares one generic title/description, so none of them rank or preview well individually.",
        impact: "high",
        complexity: "low",
        category: "SEO",
        children: [
          { title: "Add export const metadata to each of the 7 calculator pages" },
          { title: "Add Open Graph + Twitter card tags (title, description, image)" },
          { title: "Design one shared OG image template reused across calculators" },
        ],
      },
      {
        title: "Calculation history tray — extend beyond Math & Science",
        description:
          "History already ships for Math Blaster and Science Lab; the five form-style calculators still have none.",
        status: "in_progress",
        impact: "high",
        complexity: "low",
        category: "Engagement",
        children: [
          { title: "Neon calculations table + logCalculation/getHistory server actions", status: "done" },
          { title: "HistoryPanel component + wiring for Math Blaster", status: "done" },
          { title: "HistoryPanel component + wiring for Science Lab", status: "done" },
          { title: "Decide what a 'result worth remembering' means for Money/Health/Shapes/Units/Party" },
          { title: "Add a manual 'Save this result' action to those five calculators" },
        ],
      },
      {
        title: "Icon-only button aria-labels",
        description:
          "Buttons like ⌫, ±, %, AC currently have no accessible name.",
        impact: "medium",
        complexity: "low",
        category: "Accessibility",
        children: [
          { title: "Audit every CalcKey icon-only button across Math Blaster and Science Lab" },
          { title: "Add aria-label to each (Clear, Backspace, Plus/minus, Percent, Memory recall, etc.)" },
          { title: "Add aria-label to the StreakBadge fire icon" },
        ],
      },
      {
        title: "Visible focus rings",
        description:
          "Keyboard-only users can't currently see where focus is — theme.ring is already defined per calculator, just unused.",
        impact: "medium",
        complexity: "low",
        category: "Accessibility",
        children: [
          { title: "Apply theme.ring focus-visible classes to CalcKey" },
          { title: "Apply theme.ring to NumberField, TabBar buttons, and the PageShell Home link" },
          { title: "Tab through all 7 calculator pages to verify a sane, visible focus order" },
        ],
      },
      {
        title: "prefers-reduced-motion support",
        description:
          "Floating shapes, the bobbing mascot, and confetti all currently ignore this OS-level setting.",
        impact: "medium",
        complexity: "low",
        category: "Accessibility",
        children: [
          { title: "Add a shared useReducedMotion hook wrapping Framer Motion's built-in one" },
          { title: "Gate Mascot's bob animation and FloatingShapes' float animation behind it" },
          { title: "Skip or shorten confetti bursts when reduced motion is preferred" },
        ],
      },
      {
        title: "robots.txt + sitemap.ts",
        description:
          "Two small Next.js route handlers; the site is currently invisible to crawlers by omission.",
        impact: "medium",
        complexity: "low",
        category: "SEO",
        children: [
          { title: "Add app/robots.ts" },
          { title: "Add app/sitemap.ts listing the home page and all 7 calculator routes" },
        ],
      },
      {
        title: "Security headers",
        description: "A few lines in next.config; currently entirely absent.",
        impact: "medium",
        complexity: "low",
        category: "Engineering",
        children: [
          { title: "Add a headers() config in next.config.ts" },
          { title: "Set CSP, Referrer-Policy, X-Content-Type-Options, Permissions-Policy" },
          { title: "Verify CSP doesn't break Framer Motion, inline styles, or Neon requests" },
        ],
      },
      {
        title: "Privacy-safe analytics",
        description:
          "No visibility today into which calculator gets used, or real-world Core Web Vitals.",
        impact: "medium",
        complexity: "low",
        category: "Engineering",
        children: [
          { title: "Install @vercel/analytics and @vercel/speed-insights" },
          { title: "Add <Analytics /> and <SpeedInsights /> to the root layout" },
          { title: "Confirm events appear in the Vercel dashboard after deploy" },
        ],
      },
      {
        title: "Copy / share result",
        description:
          "Omni Calculator's whole model is built on shareable results; ours currently can't leave the screen.",
        impact: "medium",
        complexity: "low",
        category: "Engagement",
        children: [
          { title: "Add a share/copy icon button to ResultCard" },
          { title: "Implement navigator.share with a clipboard-copy fallback" },
          { title: "Show a brief 'Copied!' confirmation" },
        ],
      },
      {
        title: "Custom favicon & app icons",
        description: "Still shipping the default Next.js favicon.",
        impact: "low",
        complexity: "low",
        category: "Branding",
        children: [
          { title: "Design a Calcy-mascot-based favicon" },
          { title: "Generate favicon.ico, apple-touch-icon, and 192x192 / 512x512 PNGs" },
        ],
      },
      {
        title: "Branded 404 page",
        description: "A broken link currently dead-ends on the framework default.",
        impact: "low",
        complexity: "low",
        category: "Polish",
        children: [
          { title: "Build app/not-found.tsx using Mascot + a friendly 'lost' message" },
          { title: "Add a 'Back to the carnival' link home" },
        ],
      },
    ],
  },
  {
    title: "Phase 2 — Medium Bets",
    description:
      "A focused week each; mostly additive, low risk to existing code.",
    children: [
      {
        title: "Gamification — streaks, badges, milestone rewards",
        description:
          "The single most common feature across successful kids-math apps; plugs directly into the mascot/confetti system.",
        status: "in_progress",
        impact: "high",
        complexity: "medium",
        category: "Engagement",
        children: [
          { title: "Neon schema for calculations + streaks tables", status: "done" },
          { title: "Anonymous cookie-based device id via server actions", status: "done" },
          { title: "StreakProvider context + recordActivity/getStreak actions", status: "done" },
          { title: "StreakBadge header UI with milestone celebration pop", status: "done" },
          { title: "Wire streak bumps into all 7 calculators", status: "done" },
          { title: "Build a 'My Badges' showcase page listing earned vs. locked badges" },
          { title: "Add a weekly recap mascot message ('You calculated 5 days this week!')" },
        ],
      },
      {
        title: "Dark mode",
        description:
          "Treated as baseline in every 2026 calculator app (Google, PCalc, iOS); currently only bright light mode exists.",
        impact: "high",
        complexity: "medium",
        category: "Modern standard",
        children: [
          { title: "Define dark-mode tokens for existing gradients/surfaces in globals.css" },
          { title: "Add a ThemeProvider defaulting to system preference" },
          { title: "Add a dark-mode toggle button next to SoundToggleButton" },
          { title: "Audit all 7 calculator gradient themes for dark-mode contrast" },
        ],
      },
      {
        title: "Full PWA — installable, works offline",
        description:
          "Because the app is fully static, offline support is nearly free once a service worker exists.",
        impact: "high",
        complexity: "medium",
        category: "Modern standard",
        children: [
          { title: "Add app/manifest.ts (name, icons, theme_color, display: standalone)" },
          { title: "Add a service worker precaching the app shell and static routes" },
          { title: "Add an 'Add to Home Screen' install prompt" },
          { title: "Test offline mode in Chrome DevTools' network-throttling panel" },
        ],
      },
      {
        title: "Multi-language UI (Hindi + Spanish first)",
        description:
          "\"International standard\" was explicitly the ask; the app is English-only today.",
        impact: "high",
        complexity: "medium",
        category: "International",
        children: [
          { title: "Install and configure next-intl with locale-prefixed routing" },
          { title: "Extract all UI copy (buttons, mascot lines, fun facts) into message files" },
          { title: "Translate to Hindi and Spanish" },
          { title: "Add a language switcher near the home page header" },
        ],
      },
      {
        title: "\"Show your work\" step-by-step mode",
        description:
          "Wolfram Alpha and Photomath's core differentiator — turns a calculator into a teaching tool.",
        impact: "medium",
        complexity: "medium",
        category: "Differentiation",
        children: [
          { title: "Design a step-by-step data model for arithmetic order of operations" },
          { title: "Design a step-by-step data model for trig/log/power operations" },
          { title: "Add a 'Show steps' toggle to Math Blaster and Science Lab" },
          { title: "Render the step list with an animated, one-at-a-time reveal" },
        ],
      },
      {
        title: "Printable practice worksheets",
        description:
          "Extends the app from 'gives you one answer' to 'helps you practice.'",
        impact: "medium",
        complexity: "medium",
        category: "Differentiation",
        children: [
          { title: "Build a problem generator for arithmetic and geometry" },
          { title: "Design a print-friendly @media print layout" },
          { title: "Add a 'Print worksheet' button with a configurable problem count" },
        ],
      },
      {
        title: "Automated test suite + CI gate",
        description:
          "Invisible to users, but the standard 2026 Next.js safety net — currently zero coverage.",
        impact: "medium",
        complexity: "medium",
        category: "Engineering",
        children: [
          { title: "Install Vitest + React Testing Library; unit-test calculator math logic" },
          { title: "Install Playwright; write an E2E smoke test per calculator page" },
          { title: "Add a GitHub Actions workflow running lint + test + build on every PR" },
        ],
      },
      {
        title: "Voice input for numbers",
        description:
          "A hands-free, novel touch; lower priority than the above since it's more novelty than necessity.",
        impact: "low",
        complexity: "medium",
        category: "Novelty",
        children: [
          { title: "Integrate the Web Speech API SpeechRecognition interface" },
          { title: "Add a microphone button to Math Blaster and Unit Ninja" },
          { title: "Handle graceful fallback where SpeechRecognition isn't supported (Safari/Firefox gaps)" },
        ],
      },
    ],
  },
  {
    title: "Phase 3 — Big Bets",
    description:
      "Multi-week, new subsystems (accounts, ML, or native builds). Sequence after Phases 1 and 2.",
    children: [
      {
        title: "Camera scan-to-solve",
        description:
          "Photomath's category-defining feature; highest wow-factor, requires a new OCR/CAS pipeline.",
        impact: "high",
        complexity: "high",
        category: "Differentiation",
        children: [
          { title: "Evaluate OCR/CAS providers (Mathpix API vs. on-device ML Kit)" },
          { title: "Build a camera capture UI component" },
          { title: "Wire OCR output into the appropriate calculator engine" },
          { title: "Add an animated, step-by-step reveal of the scanned solution" },
        ],
      },
      {
        title: "Adaptive difficulty practice mode",
        description:
          "Duolingo/Khan Academy Kids-style personalization; effectively a second product built on top of this one.",
        impact: "high",
        complexity: "high",
        category: "Retention",
        children: [
          { title: "Design a difficulty-scaling algorithm per calculator domain" },
          { title: "Build a 'Practice' mini-game mode with scoring" },
          { title: "Persist per-device skill level in Postgres" },
        ],
      },
      {
        title: "Parent dashboard / kid profiles",
        description:
          "Valuable for trust and progress-tracking, but introduces accounts and reopens the COPPA/GDPR-K analysis.",
        impact: "medium",
        complexity: "high",
        category: "Retention",
        children: [
          { title: "Design a lightweight profile model (name/avatar, still no real PII)" },
          { title: "Revisit the COPPA / GDPR-K analysis for an accounts model" },
          { title: "Build a parent-facing progress view (streaks, history, badges)" },
        ],
      },
      {
        title: "Native app wrapper",
        description:
          "Matches where competitors actually live (app stores, widgets, lock-screen access); a packaging project, not a feature.",
        impact: "low",
        complexity: "high",
        category: "Distribution",
        children: [
          { title: "Evaluate Capacitor vs. Expo as the wrapper" },
          { title: "Package the existing Next.js app for iOS/Android shells" },
          { title: "Handle app store submission requirements (icons, screenshots, privacy labels)" },
        ],
      },
    ],
  },
];

const LEVELS = ["phase", "task", "subtask", "microtask"];

async function insertNode(node, parentId, level, position) {
  const rows = await sql`
    INSERT INTO version_1 (parent_id, level, position, title, description, status, impact, complexity, category)
    VALUES (
      ${parentId},
      ${level},
      ${position},
      ${node.title},
      ${node.description ?? null},
      ${node.status ?? "planned"},
      ${node.impact ?? null},
      ${node.complexity ?? null},
      ${node.category ?? null}
    )
    RETURNING id
  `;
  const id = rows[0].id;

  if (node.children) {
    const childLevel = LEVELS[LEVELS.indexOf(level) + 1];
    for (let i = 0; i < node.children.length; i++) {
      await insertNode(node.children[i], id, childLevel, i);
    }
  }
  return id;
}

async function main() {
  const existing = await sql`SELECT count(*)::int AS n FROM version_1`;
  if (existing[0].n > 0) {
    console.log(`version_1 already has ${existing[0].n} rows — aborting to avoid duplicates.`);
    console.log("Delete existing rows first if you want to reseed.");
    process.exit(1);
  }

  for (let i = 0; i < ROADMAP.length; i++) {
    await insertNode(ROADMAP[i], null, "phase", i);
  }

  const counts = await sql`SELECT level, count(*)::int AS n FROM version_1 GROUP BY level ORDER BY level`;
  console.log("Seed complete. Row counts by level:", counts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
