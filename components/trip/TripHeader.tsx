import { formatDateRange, formatMoney } from "@/lib/format";
import type { Trip } from "@/types/trip";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function TripHeader({ trip }: { trip: Trip }) {
  const destination =
    trip.request.destination.name || trip.request.destination.query;

  return (
    <header className="rounded-2xl border border-line bg-paper-raised p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            Generated trip
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">{destination}</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {formatDateRange(trip.request.startDate, trip.request.endDate)}
          </p>
        </div>
        <StatusBadge status={trip.status} />
      </div>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-ink-muted">Travelers</dt>
          <dd className="mt-1 font-medium">{trip.request.travelers}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Budget</dt>
          <dd className="mt-1 font-medium">
            {formatMoney(trip.request.budget, trip.request.currency)}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Travel style</dt>
          <dd className="mt-1 font-medium capitalize">
            {trip.request.travelStyle.replace("-", " ")}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Pace</dt>
          <dd className="mt-1 font-medium capitalize">{trip.request.dailyPace}</dd>
        </div>
      </dl>
    </header>
  );
}
