import type {
  Activity,
  CurrencyCode,
} from "@/types/trip";

interface ActivityCardProps {
  activity: Activity;
  currency: CurrencyCode;
}

export function ActivityCard({
  activity,
  currency,
}: ActivityCardProps) {
  const hasVerifiedPrice =
    activity.cost !== undefined &&
    activity.costStatus === "verified";

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">
            {activity.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            {activity.locationName}
          </p>
        </div>

        <div className="text-right text-sm">
          {hasVerifiedPrice ? (
            <span>
              {currency} {activity.cost}
            </span>
          ) : (
            <span className="text-muted-foreground">
              Price unavailable
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 text-sm text-muted-foreground">
        <span>{activity.startTime}</span>
        {" • "}
        <span>{activity.durationMinutes} min</span>
      </div>

      {activity.reasons.length > 0 && (
        <div className="mt-3 space-y-1">
          {activity.reasons.map((reason) => (
            <p
              key={`${activity.id}-${reason.code}`}
              className="text-sm"
            >
              {reason.label}: {reason.detail}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}