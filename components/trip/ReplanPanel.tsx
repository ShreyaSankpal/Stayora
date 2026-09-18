"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { INTEREST_OPTIONS, PACE_OPTIONS, TRAVEL_STYLE_OPTIONS } from "@/lib/constants";
import { saveTripDraft } from "@/lib/trip-session";
import type { DailyPace, Interest, TravelStyle, TripRequest } from "@/types/trip";

export function ReplanPanel({
  tripId,
  request,
}: {
  tripId: string;
  request: TripRequest;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<TripRequest>(request);
  const [notice, setNotice] = useState<string | null>(null);

  function toggleInterest(interest: Interest) {
    setDraft((current) => {
      const exists = current.interests.includes(interest);
      return {
        ...current,
        interests: exists
          ? current.interests.filter((item) => item !== interest)
          : [...current.interests, interest],
      };
    });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    saveTripDraft({
      id: tripId,
      request: draft,
      createdAt: new Date().toISOString(),
    });
    setNotice(
      "Updated TripRequest stored locally. The re-plan pipeline (travel data → constraints → AI → validation) is not connected yet.",
    );
    router.push(`/plan/loading?tripId=${tripId}&replan=1`);
  }

  return (
    <section className="rounded-2xl border border-line bg-paper-raised p-5">
      <h2 className="text-lg font-semibold">Modify trip / Re-plan</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Changing constraints should cause Steora to reconsider the itinerary:
        updated requirements → refresh relevant travel data → constraint engine
        → AI planner → validation → updated itinerary.
      </p>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Budget
            <input
              type="number"
              min={0}
              value={draft.budget}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  budget: Number(event.target.value),
                }))
              }
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Travelers
            <input
              type="number"
              min={1}
              value={draft.travelers}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  travelers: Number(event.target.value),
                }))
              }
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Start date
            <input
              type="date"
              value={draft.startDate}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  startDate: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
            />
          </label>
          <label className="text-sm">
            End date
            <input
              type="date"
              value={draft.endDate}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  endDate: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
            />
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Interests</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((option) => {
              const selected = draft.interests.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleInterest(option.value)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    selected
                      ? "border-accent bg-accent text-white"
                      : "border-line bg-paper"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="block text-sm">
          Travel style
          <select
            value={draft.travelStyle}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                travelStyle: event.target.value as TravelStyle,
              }))
            }
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
          >
            {TRAVEL_STYLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          Pace
          <select
            value={draft.dailyPace}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                dailyPace: event.target.value as DailyPace,
              }))
            }
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
          >
            {PACE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          Maximum travel time ({draft.maxTravelTimeMinutes} min)
          <input
            type="range"
            min={10}
            max={90}
            step={5}
            value={draft.maxTravelTimeMinutes}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                maxTravelTimeMinutes: Number(event.target.value),
              }))
            }
            className="mt-2 w-full accent-accent"
          />
        </label>

        {notice ? <p className="text-sm text-ink-muted">{notice}</p> : null}

        <button
          type="submit"
          className="w-full rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-ink/90"
        >
          Re-plan my trip
        </button>
      </form>
    </section>
  );
}
