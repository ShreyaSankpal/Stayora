import type { CurrencyCode, Itinerary } from "@/types/trip";
import { ItineraryDayCard } from "./ItineraryDayCard";

export function ItineraryView({
  itinerary,
  currency,
}: {
  itinerary: Itinerary;
  currency: CurrencyCode;
}) {
  return (
    <div className="space-y-5">
      {itinerary.days.map((day) => (
        <ItineraryDayCard key={day.date} day={day} currency={currency} />
      ))}
    </div>
  );
}
