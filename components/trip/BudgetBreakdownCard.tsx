import { formatMoney } from "@/lib/format";
import type { BudgetBreakdown as BudgetBreakdownType, BudgetCategory } from "@/types/trip";

const LABELS: Record<BudgetCategory, string> = {
  activities: "Activities",
  food: "Food",
  local_transport: "Local transport",
  accommodation: "Accommodation",
  other: "Other",
};

export function BudgetBreakdownCard({
  breakdown,
}: {
  breakdown: BudgetBreakdownType;
}) {
  return (
    <section className="rounded-2xl border border-line bg-paper-raised p-5">
      <h2 className="text-lg font-semibold">Budget</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Estimates are planning figures. Booked prices stay empty until real
        reservations exist.
      </p>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-xl bg-paper p-3">
          <p className="text-ink-muted">Stated budget</p>
          <p className="mt-1 font-medium">
            {formatMoney(breakdown.totalBudget, breakdown.currency)}
          </p>
        </div>
        <div className="rounded-xl bg-paper p-3">
          <p className="text-ink-muted">Estimated total</p>
          <p className="mt-1 font-medium">
            {formatMoney(breakdown.estimatedTotal, breakdown.currency)}
          </p>
        </div>
        <div className="rounded-xl bg-paper p-3">
          <p className="text-ink-muted">Booked total</p>
          <p className="mt-1 font-medium">
            {breakdown.bookedTotal == null
              ? "Not booked"
              : formatMoney(breakdown.bookedTotal, breakdown.currency)}
          </p>
        </div>
      </div>
      <ul className="mt-4 divide-y divide-line">
        {breakdown.lines.map((line) => (
          <li
            key={line.category}
            className="flex items-center justify-between gap-3 py-3 text-sm"
          >
            <span>{LABELS[line.category]}</span>
            <span className="text-right">
              <span className="block">
                Est. {formatMoney(line.estimated, breakdown.currency)}
              </span>
              <span className="block text-xs text-ink-muted">
                Booked{" "}
                {line.booked == null
                  ? "—"
                  : formatMoney(line.booked, breakdown.currency)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
