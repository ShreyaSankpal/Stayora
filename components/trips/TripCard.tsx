import Link from "next/link";
import { formatDateRange, formatMoney } from "@/lib/format";
import type { SavedTripSummary } from "@/types/trip";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function TripCard({ trip }: { trip: SavedTripSummary }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-line bg-paper-raised p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl">{trip.destinationName}</h2>
          <StatusBadge status={trip.status} />
        </div>
        <dl className="mt-4 space-y-2 text-sm text-ink-muted">
          <div>
            <dt className="inline">Dates: </dt>
            <dd className="inline">{formatDateRange(trip.startDate, trip.endDate)}</dd>
          </div>
          <div>
            <dt className="inline">Travelers: </dt>
            <dd className="inline">{trip.travelers}</dd>
          </div>
          <div>
            <dt className="inline">Budget: </dt>
            <dd className="inline">{formatMoney(trip.budget, trip.currency)}</dd>
          </div>
          <div>
            <dt className="inline">Style: </dt>
            <dd className="inline capitalize">{trip.travelStyle.replace("-", " ")}</dd>
          </div>
          <div>
            <dt className="inline">Last updated: </dt>
            <dd className="inline">
              {new Date(trip.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </div>
      <Link
        href={`/trip/${trip.id}`}
        className="mt-5 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
      >
        Open trip
      </Link>
    </article>
  );
}
