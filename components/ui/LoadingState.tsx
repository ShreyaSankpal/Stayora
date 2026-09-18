export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-ink-muted">
      <span className="h-4 w-4 animate-pulse rounded-full bg-accent" />
      {label}
    </div>
  );
}
