export function CalcScreen({
  expression,
  value,
}: {
  expression?: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 px-5 py-4 shadow-inner">
      {expression ? (
        <div className="min-h-[1.25rem] truncate text-right font-mono text-sm text-slate-400">
          {expression}
        </div>
      ) : null}
      <div className="overflow-x-auto whitespace-nowrap text-right font-mono text-4xl font-bold text-white">
        {value}
      </div>
    </div>
  );
}
