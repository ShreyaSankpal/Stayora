import type { RecommendationReason } from "@/types/trip";

export function RecommendationReasonList({
  reasons,
}: {
  reasons: RecommendationReason[];
}) {
  if (reasons.length === 0) return null;

  return (
    <ul className="mt-3 space-y-2">
      {reasons.map((reason) => (
        <li key={reason.code + reason.detail} className="text-sm">
          <p className="font-medium">{reason.label}</p>
          <p className="text-ink-muted">{reason.detail}</p>
        </li>
      ))}
    </ul>
  );
}
