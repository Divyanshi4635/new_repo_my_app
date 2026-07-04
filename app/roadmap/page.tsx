import type { Metadata } from "next";
import Link from "next/link";
import { getRoadmapTree } from "@/lib/db/roadmap";
import { PhaseSection } from "@/components/roadmap/RoadmapTree";
import { Mascot } from "@/components/Mascot";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Roadmap — Calcy's Calculator Carnival",
  description:
    "What's shipped and what's coming next for Calcy's Calculator Carnival, straight from our product backlog.",
};

export default async function RoadmapPage() {
  const phases = await getRoadmapTree();
  const allTasks = phases.flatMap((p) => p.children);
  const done = allTasks.filter((t) => t.status === "done").length;
  const inProgress = allTasks.filter((t) => t.status === "in_progress").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <header className="bg-gradient-to-r from-slate-700 to-indigo-700 shadow-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 font-heading text-white transition hover:bg-white/30 active:scale-95"
          >
            <span aria-hidden>🏠</span> Home
          </Link>
          <h1 className="font-heading text-2xl text-white drop-shadow sm:text-3xl">
            <span aria-hidden className="mr-2">
              🗺️
            </span>
            Roadmap
          </h1>
          <div className="w-[88px]" aria-hidden />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <Mascot mood="thinking" size={80} />
          <p className="mt-3 max-w-xl text-slate-600">
            Everything we&apos;ve thought through for Calcy&apos;s Calculator Carnival —
            organized into build phases, straight from our own product backlog.
          </p>
          <div className="mt-4 flex gap-2 text-sm font-bold">
            <span className="rounded-full bg-white px-3 py-1 text-slate-500 shadow">
              {allTasks.length} features planned
            </span>
            {inProgress > 0 ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700 shadow">
                {inProgress} in progress
              </span>
            ) : null}
            {done > 0 ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 shadow">
                {done} shipped
              </span>
            ) : null}
          </div>
        </div>

        <div className="space-y-12">
          {phases.map((phase) => (
            <PhaseSection key={phase.id} phase={phase} />
          ))}
        </div>

        <footer className="mt-16 text-center text-sm text-slate-400">
          Tap any feature to see its subtasks. Green means shipped, amber means in progress.
        </footer>
      </main>
    </div>
  );
}
