import { formatMinutes, formatMoney } from "@/lib/format";
import type { Activity, CurrencyCode } from "@/types/trip";
import { RecommendationReasonList } from "./RecommendationReasonList";

export function ActivityCard({
  activity,
  currency,
}: {
  activity: Activity;
  currency: CurrencyCode;
}) {
  return (
    <article className="rounded-xl border border-line bg-paper p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            {activity.category} · {activity.startTime}
          </p>
          <h4 className="mt-1 text-base font-semibold">{activity.name}</h4>
          <p className="mt-1 text-sm text-ink-muted">{activity.locationName}</p>
        </div>
        <p className="text-sm">
          {activity.costIsEstimate ? "Est. " : ""}
          {formatMoney(activity.estimatedCost, currency)}
        </p>
      </div>
      <dl className="mt-3 grid gap-2 text-xs text-ink-muted sm:grid-cols-2">
        <div>
          <dt className="inline">Duration: </dt>
          <dd className="inline">{formatMinutes(activity.durationMinutes)}</dd>
        </div>
        {activity.distanceFromPreviousKm != null ? (
          <div>
            <dt className="inline">Distance from previous: </dt>
            <dd className="inline">{activity.distanceFromPreviousKm} km</dd>
          </div>
        ) : null}
        {activity.travelTimeFromPreviousMinutes != null ? (
          <div>
            <dt className="inline">Travel time: </dt>
            <dd className="inline">
              {formatMinutes(activity.travelTimeFromPreviousMinutes)}
            </dd>
          </div>
        ) : null}
        {activity.source ? (
          <div>
            <dt className="inline">Source: </dt>
            <dd className="inline">{activity.source.name}</dd>
          </div>
        ) : null}
      </dl>
      <RecommendationReasonList
  reasons={activity.reasons ?? []}
/>
    </article>
  );
}
