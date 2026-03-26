export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="glass-panel flex min-h-[180px] items-center justify-center rounded-[28px]">
      <div className="flex items-center gap-3 text-muted">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span>{label}</span>
      </div>
    </div>
  );
}
