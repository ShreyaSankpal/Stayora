import type { Coordinates, Itinerary } from "@/types/trip";

interface MapMarker {
  id: string;
  label: string;
  coordinates?: Coordinates;
}

export function MapPlaceholder({
  destination,
  itinerary,
}: {
  destination?: { name: string; coordinates?: Coordinates };
  itinerary?: Itinerary;
}) {
  const markers: MapMarker[] = [];
  itinerary?.days.forEach((day) => {
    (["morning", "afternoon", "evening"] as const).forEach((segment) => {
      day.segments[segment].forEach((activity) => {
        markers.push({
          id: activity.id,
          label: activity.name,
          coordinates: activity.coordinates,
        });
      });
    });
  });

  return (
    <section className="rounded-2xl border border-line bg-paper-raised p-5">
      <h2 className="text-lg font-semibold">Map</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Map provider not connected. This surface is ready for coordinates,
        activity markers, and route geometry.
      </p>
      <div className="steora-grid mt-4 flex min-h-56 items-center justify-center rounded-xl border border-dashed border-line bg-paper">
        <div className="px-4 text-center text-sm text-ink-muted">
          <p>
            {destination?.name || "Destination"}{" "}
            {destination?.coordinates
              ? `· ${destination.coordinates.lat.toFixed(3)}, ${destination.coordinates.lng.toFixed(3)}`
              : "· coordinates pending"}
          </p>
          <p className="mt-2">{markers.length} activity markers ready</p>
        </div>
      </div>
      <ul className="mt-4 space-y-1 text-xs text-ink-muted">
        {markers.slice(0, 6).map((marker) => (
          <li key={marker.id}>
            {marker.label}
            {marker.coordinates
              ? ` · ${marker.coordinates.lat.toFixed(3)}, ${marker.coordinates.lng.toFixed(3)}`
              : " · coordinates not set"}
          </li>
        ))}
      </ul>
    </section>
  );
}
