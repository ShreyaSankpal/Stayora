import type { ConstraintStatus, TripStatus } from "@/types/trip";
import { tripStatusLabel } from "@/lib/format";

const styles: Record<ConstraintStatus | TripStatus, string> = {
  valid: "bg-valid-soft text-valid",
  warning: "bg-warning-soft text-warning",
  needs_replanning: "bg-danger-soft text-danger",
  planning: "bg-accent-soft text-accent",
  draft: "bg-line text-ink-muted",
};

export function StatusBadge({ status }: { status: ConstraintStatus | TripStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {tripStatusLabel(status)}
    </span>
  );
}
