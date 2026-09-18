"use client";

import { SAMPLE_DESTINATIONS } from "@/lib/constants";
import type { Destination } from "@/types/trip";

export function DestinationInput({
  value,
  onChange,
}: {
  value: Destination;
  onChange: (destination: Destination) => void;
}) {
  const query = value.query.trim().toLowerCase();
  const suggestions =
    query.length < 2
      ? []
      : SAMPLE_DESTINATIONS.filter(
          (place) =>
            place.name.toLowerCase().includes(query) ||
            place.country.toLowerCase().includes(query),
        );

  return (
    <div>
      <label htmlFor="destination" className="text-sm font-medium">
        Destination
      </label>
      <input
        id="destination"
        name="destination"
        value={value.query}
        onChange={(event) =>
          onChange({
            query: event.target.value,
            resolution: "idle",
          })
        }
        placeholder="City or region"
        autoComplete="off"
        className="mt-2 w-full rounded-xl border border-line bg-paper-raised px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
      />
      <p className="mt-2 text-xs text-ink-muted">
        Sample suggestions only. Geocoding and coordinates will come from travel
        APIs later. Selected places already include a coordinates field.
      </p>
      {suggestions.length > 0 && value.resolution !== "resolved" ? (
        <ul className="mt-2 overflow-hidden rounded-xl border border-line bg-paper-raised">
          {suggestions.map((place) => (
            <li key={place.placeId}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent-soft"
                onClick={() =>
                  onChange({
                    query: `${place.name}, ${place.country}`,
                    name: place.name,
                    country: place.country,
                    placeId: place.placeId,
                    coordinates: place.coordinates,
                    resolution: "resolved",
                  })
                }
              >
                {place.name}, {place.country}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {value.resolution === "resolved" && value.coordinates ? (
        <p className="mt-2 text-xs text-accent">
          Resolved for preview: {value.name}, {value.country} ·{" "}
          {value.coordinates.lat.toFixed(4)}, {value.coordinates.lng.toFixed(4)}
        </p>
      ) : value.query ? (
        <p className="mt-2 text-xs text-ink-muted">
          Suggestion state: {value.resolution}. You can continue with a free-text
          destination.
        </p>
      ) : null}
    </div>
  );
}
