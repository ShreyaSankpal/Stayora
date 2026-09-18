import type { ReactNode } from "react";

export function PreviewBanner({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-ink">
      {children}
    </div>
  );
}
