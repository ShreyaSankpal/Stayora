"use client";

import { useEffect, useMemo, useState } from "react";
import { buildPreviewTrip } from "@/lib/preview-data";
import { readTripDraft } from "@/lib/trip-session";
import type { Trip } from "@/types/trip";
import { BudgetBreakdownCard } from "./BudgetBreakdownCard";
import { FeasibilityPanel } from "./FeasibilityPanel";
import { ItineraryView } from "./ItineraryView";
import { MapPlaceholder } from "./MapPlaceholder";
import { ReplanPanel } from "./ReplanPanel";
import { TripHeader } from "./TripHeader";
import { WeatherCard } from "./WeatherCard";
import { PreviewBanner } from "@/components/ui/PreviewBanner";

export function TripExperience({ tripId }: { tripId: string }) {
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const draft = readTripDraft();
    const request = draft?.id === tripId ? draft.request : undefined;
    setTrip(buildPreviewTrip(tripId, request));
  }, [tripId]);

  const destinationName = useMemo(() => {
    if (!trip) return "";
    return trip.request.destination.name || trip.request.destination.query;
  }, [trip]);

  if (!trip) {
    return (
      <p className="px-4 py-16 text-sm text-ink-muted">Preparing preview trip…</p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <PreviewBanner>
        This itinerary is preview data shaped like a future{" "}
        <code>TravelPlanApiResponse</code>. It is not live travel, weather, or
        booking information, and the planning engine is not connected.
      </PreviewBanner>
      <TripHeader trip={trip} />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          {trip.itinerary ? (
            <ItineraryView
              itinerary={trip.itinerary}
              currency={trip.request.currency}
            />
          ) : null}
        </div>
        <div className="space-y-6">
          {trip.feasibility ? (
            <FeasibilityPanel feasibility={trip.feasibility} />
          ) : null}
          {trip.budgetBreakdown ? (
            <BudgetBreakdownCard breakdown={trip.budgetBreakdown} />
          ) : null}
          <section className="space-y-3 rounded-2xl border border-line bg-paper-raised p-5">
            <h2 className="text-lg font-semibold">Weather</h2>
            <div className="grid gap-3">
              {trip.weather?.map((item) => (
                <WeatherCard key={item.date} weather={item} />
              ))}
            </div>
          </section>
          <MapPlaceholder
            destination={{
              name: destinationName,
              coordinates: trip.request.destination.coordinates,
            }}
            itinerary={trip.itinerary}
          />
          <ReplanPanel tripId={trip.id} request={trip.request} />
        </div>
      </div>
    </div>
  );
}
