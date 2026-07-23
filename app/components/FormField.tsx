export function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs uppercase font-semibold text-ink-mid tracking-wider mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl border border-card-border px-4 py-2.5 text-sm text-forest-text bg-white focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green transition-all"
      />
    </div>
  );
}
