import { PLANNING_STAGES } from "@/lib/constants";
import type { PlanningStageId } from "@/types/trip";

export function PlanningProgress({
  activeId,
}: {
  activeId: PlanningStageId;
}) {
  const activeIndex = PLANNING_STAGES.findIndex((stage) => stage.id === activeId);

  return (
    <ol className="space-y-3">
      {PLANNING_STAGES.map((stage, index) => {
        const state =
          index < activeIndex
            ? "done"
            : index === activeIndex
              ? "active"
              : "pending";
        return (
          <li
            key={stage.id}
            className={`rounded-xl border px-4 py-3 ${
              state === "active"
                ? "border-accent bg-accent-soft"
                : state === "done"
                  ? "border-line bg-paper-raised"
                  : "border-line/70 bg-paper"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium">
                {index + 1}. {stage.label}
              </p>
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                {state === "done"
                  ? "Complete"
                  : state === "active"
                    ? "In progress"
                    : "Queued"}
              </p>
            </div>
            <p className="mt-1 text-sm text-ink-muted">{stage.description}</p>
          </li>
        );
      })}
    </ol>
  );
}
