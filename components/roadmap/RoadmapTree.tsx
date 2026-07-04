import type { RoadmapNode } from "@/lib/db/roadmap";

const COMPLEXITY_CLASSES: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-rose-100 text-rose-700",
};

const IMPACT_CLASSES: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-sky-100 text-sky-700",
  high: "bg-violet-100 text-violet-700",
};

function Chip({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${className}`}
    >
      {label}
    </span>
  );
}

function StatusMark({ status }: { status: RoadmapNode["status"] }) {
  if (status === "done") {
    return (
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs text-white"
        title="Done"
        aria-label="Done"
      >
        ✓
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-amber-500 text-xs"
        title="In progress"
        aria-label="In progress"
      >
        <span className="h-2 w-2 rounded-full bg-amber-500" />
      </span>
    );
  }
  return (
    <span
      className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-300"
      title="Planned"
      aria-label="Planned"
    />
  );
}

function countByStatus(nodes: RoadmapNode[]) {
  return nodes.reduce(
    (acc, n) => {
      acc[n.status] += 1;
      return acc;
    },
    { planned: 0, in_progress: 0, done: 0 } as Record<RoadmapNode["status"], number>
  );
}

function Microtasks({ items }: { items: RoadmapNode[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-1.5 ml-7 space-y-1 border-l-2 border-dashed border-slate-200 pl-4">
      {items.map((m) => (
        <li key={m.id} className="flex items-start gap-2 text-sm text-slate-500">
          <StatusMark status={m.status} />
          <span>{m.title}</span>
        </li>
      ))}
    </ul>
  );
}

function Subtasks({ items }: { items: RoadmapNode[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((s) => (
        <li key={s.id}>
          <div className="flex items-start gap-2">
            <StatusMark status={s.status} />
            <span className="text-sm font-semibold text-slate-700">{s.title}</span>
          </div>
          <Microtasks items={s.children} />
        </li>
      ))}
    </ul>
  );
}

function TaskCard({ task }: { task: RoadmapNode }) {
  const counts = countByStatus(task.children);
  const total = task.children.length;
  const doneFrac = total > 0 ? counts.done / total : 0;

  return (
    <details
      className="group rounded-2xl bg-white/70 shadow-md backdrop-blur open:shadow-lg"
      open={task.status !== "planned"}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-4 marker:content-none">
        <div className="flex items-start gap-3">
          <StatusMark status={task.status} />
          <div>
            <p className="font-heading text-base text-slate-800">{task.title}</p>
            {task.description ? (
              <p className="mt-0.5 text-sm text-slate-500">{task.description}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {task.impact ? (
                <Chip label={`${task.impact} impact`} className={IMPACT_CLASSES[task.impact]} />
              ) : null}
              {task.complexity ? (
                <Chip
                  label={`${task.complexity} complexity`}
                  className={COMPLEXITY_CLASSES[task.complexity]}
                />
              ) : null}
              {task.category ? (
                <Chip label={task.category} className="bg-slate-100 text-slate-500" />
              ) : null}
            </div>
          </div>
        </div>
        <span className="shrink-0 text-xs font-bold text-slate-400 transition group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="px-4 pb-4">
        {total > 0 ? (
          <>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${doneFrac * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {counts.done} of {total} subtasks done
              {counts.in_progress > 0 ? ` · ${counts.in_progress} in progress` : ""}
            </p>
          </>
        ) : null}
        <Subtasks items={task.children} />
      </div>
    </details>
  );
}

export function PhaseSection({ phase }: { phase: RoadmapNode }) {
  const counts = countByStatus(phase.children);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-2xl text-slate-800">{phase.title}</h2>
        <p className="text-sm text-slate-500">
          {phase.children.length} features
          {counts.in_progress > 0 ? ` · ${counts.in_progress} in progress` : ""}
          {counts.done > 0 ? ` · ${counts.done} done` : ""}
        </p>
      </div>
      {phase.description ? (
        <p className="mb-4 max-w-2xl text-sm text-slate-500">{phase.description}</p>
      ) : null}
      <div className="space-y-3">
        {phase.children.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
