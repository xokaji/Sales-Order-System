export default function StatusBanner({ tone = "error", children }) {
  const styles =
    tone === "error"
      ? "border-danger/40 bg-danger/5 text-danger"
      : "border-accent/40 bg-accent-soft text-accent-hover";

  return (
    <div className={`rounded-md border px-4 py-2 text-sm ${styles}`} role="status">
      {children}
    </div>
  );
}
