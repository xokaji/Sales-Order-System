export default function Input({ label, className = "", numeric = false, ...rest }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="font-medium text-ink-700">{label}</span>}
      <input
        className={`rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink-900
          shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent
          ${numeric ? "num text-right" : ""} ${className}`}
        {...rest}
      />
    </label>
  );
}
