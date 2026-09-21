import { formatLongDate } from "@/lib/format";
import type { CurrencyCode, DaySegment, ItineraryDay } from "@/types/trip";
import { ActivityCard } from "./ActivityCard";
import { WeatherCard } from "./WeatherCard";

const SEGMENTS: { key: DaySegment; label: string }[] = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
];

export function ItineraryDayCard({
  day,
  currency,
}: {
  day: ItineraryDay;
  currency: CurrencyCode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-paper-raised p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-accent">
            Day {day.dayNumber}
          </p>
          <h3 className="mt-1 font-display text-2xl">{formatLongDate(day.date)}</h3>
        </div>
        {day.weather ? <WeatherCard weather={day.weather} compact /> : null}
      </div>
      <div className="mt-6 space-y-5">
        {SEGMENTS.map((segment) => (
          <div key={segment.key}>
            <h4 className="mb-2 text-sm font-semibold">{segment.label}</h4>
            <div className="space-y-3">
              {day.segments[segment.key].map((activity, index) => (
  <ActivityCard
    key={activity.id || `${segment.key}-${index}`}
                  activity={activity}
                  currency={currency}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
