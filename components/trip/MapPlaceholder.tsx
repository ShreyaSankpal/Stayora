"use client";

import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import type { Coordinates, Itinerary } from "@/types/trip";

import "leaflet/dist/leaflet.css";

interface MapMarker {
  id: string;
  label: string;
  coordinates?: Coordinates;
  dayNumber: number;
  segment: string;
}

export function MapPlaceholder({
  destination,
  itinerary,
}: {
  destination?: {
    name: string;
    coordinates?: Coordinates;
  };
  itinerary?: Itinerary;
}) {
  const markers: MapMarker[] = [];

  itinerary?.days.forEach((day) => {
    (["morning", "afternoon", "evening"] as const).forEach(
      (segment) => {
        day.segments[segment].forEach((activity) => {
          markers.push({
            id: activity.id,
            label: activity.name,
            coordinates: activity.coordinates,
            dayNumber: day.dayNumber,
            segment,
          });
        });
      }
    );
  });

  const activityMarkers = markers.filter(
    (marker) => marker.coordinates
  );

  const destinationCoordinates = destination?.coordinates;

  const firstRoutePoint =
    itinerary?.days.find(
      (day) => day.routeGeometry && day.routeGeometry.length > 0
    )?.routeGeometry?.[0];

  const mapCenter: [number, number] =
    destinationCoordinates
      ? [
          destinationCoordinates.lat,
          destinationCoordinates.lng,
        ]
      : firstRoutePoint ?? [20.5937, 78.9629];

  const destinationIcon = L.divIcon({
    className: "steora-destination-marker",
    html: `
      <div
        style="
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #111827;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        "
      ></div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

  const activityIcon = L.divIcon({
    className: "steora-activity-marker",
    html: `
      <div
        style="
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #2563eb;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        "
      ></div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });

  return (
    <section className="rounded-2xl border border-line bg-paper-raised p-5">
      <div>
        <h2 className="text-lg font-semibold">
          Map
        </h2>

        <p className="mt-1 text-sm text-ink-muted">
          Explore your destination and itinerary activities
          on the map.
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-line">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          className="h-[500px] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {destinationCoordinates ? (
            <Marker
              position={[
                destinationCoordinates.lat,
                destinationCoordinates.lng,
              ]}
              icon={destinationIcon}
            >
              <Popup>
                <div>
                  <strong>{destination?.name}</strong>

                  <p>Trip destination</p>

                  <p>
                    {destinationCoordinates.lat.toFixed(4)},{" "}
                    {destinationCoordinates.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ) : null}

          {activityMarkers.map((marker) => {
            const coordinates = marker.coordinates!;

            return (
              <Marker
                key={marker.id}
                position={[
                  coordinates.lat,
                  coordinates.lng,
                ]}
                icon={activityIcon}
              >
                <Popup>
                  <div>
                    <strong>{marker.label}</strong>

                    <p>
                      Day {marker.dayNumber} ·{" "}
                      {marker.segment}
                    </p>

                    <p>
                      {coordinates.lat.toFixed(4)},{" "}
                      {coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {itinerary?.days.map((day) => {
            if (!day.routeGeometry || day.routeGeometry.length < 2) {
              return null;
            }

            return (
              <Polyline
                key={`route-day-${day.dayNumber}`}
                positions={day.routeGeometry}
                pathOptions={{
                  color: "#2563eb",
                  weight: 4,
                  opacity: 0.7,
                }}
              />
            );
          })}
        </MapContainer>
      </div>

      <div className="mt-4 text-xs text-ink-muted">
        <p>
          {destination?.name || "Destination"}
        </p>

        <p className="mt-1">
          {activityMarkers.length} activity markers
          available
        </p>

        <p className="mt-1">
          {itinerary?.days.filter(
            (day) =>
              day.routeGeometry &&
              day.routeGeometry.length > 1
          ).length ?? 0}{" "}
          day routes available
        </p>
      </div>
    </section>
  );
}