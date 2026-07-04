export function NumberField({
  label,
  value,
  onChange,
  suffix,
  min,
  step,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  min?: number;
  step?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-600">{label}</span>
      <div className="flex items-center overflow-hidden rounded-xl border-2 border-slate-200 bg-white focus-within:border-slate-400">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          step={step ?? "any"}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-4 py-2.5 text-lg font-semibold text-slate-800 outline-none"
        />
        {suffix ? (
          <span className="whitespace-nowrap px-3 text-sm font-bold text-slate-400">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}
