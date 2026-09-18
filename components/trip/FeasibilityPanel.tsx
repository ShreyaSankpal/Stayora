import type { Feasibility } from "@/types/trip";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function FeasibilityPanel({ feasibility }: { feasibility: Feasibility }) {
  return (
    <section className="rounded-2xl border border-line bg-paper-raised p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Feasibility</h2>
        <StatusBadge status={feasibility.overall} />
      </div>
      <p className="mt-1 text-sm text-ink-muted">
        Overall trip status is derived from budget, schedule, travel time,
        distance, and weather checks. Values here are preview states.
      </p>
      <ul className="mt-4 space-y-3">
        {feasibility.checks.map((check) => (
          <li key={check.id} className="rounded-xl border border-line bg-paper p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{check.label}</p>
              <StatusBadge status={check.status} />
            </div>
            <p className="mt-1 text-sm text-ink-muted">{check.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
