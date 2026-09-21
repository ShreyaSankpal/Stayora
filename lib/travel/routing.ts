import type { NormalizedTravelData } from "@/lib/travel/normalizer";

interface GeoapifyMatrixResponse {
  sources_to_targets?: Array<
    Array<{
      distance?: number | null;
      time?: number | null;
    }>
  >;
}

export async function calculateTravelTimes(
  travelData: NormalizedTravelData
): Promise<NormalizedTravelData> {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error("Geoapify API key is missing");
  }

  if (travelData.places.length === 0) {
    return travelData;
  }

  const destinationCoordinates = travelData.destination.coordinates;

  if (!destinationCoordinates) {
    throw new Error("Destination coordinates are missing");
  }

  const sources = [
    {
      location: [
        destinationCoordinates.lng,
        destinationCoordinates.lat,
      ],
    },
  ];

  const targets = travelData.places.map((place) => ({
    location: [place.coordinates.lng, place.coordinates.lat],
  }));

  const response = await fetch(
    `https://api.geoapify.com/v1/routematrix?apiKey=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "drive",
        sources,
        targets,
        units: "metric",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      "Geoapify routing failed: " +
        response.status +
        " " +
        response.statusText +
        " " +
        errorText
    );
  }

  const data =
    (await response.json()) as GeoapifyMatrixResponse;

  const matrix = data.sources_to_targets?.[0];

  if (!matrix) {
    throw new Error(
      "Geoapify did not return routing data"
    );
  }

  const places = travelData.places.map((place, index) => {
    const route = matrix[index];

    return {
      ...place,

      distanceFromDestinationKm:
        route?.distance != null
          ? route.distance / 1000
          : undefined,

      travelTimeFromDestinationMinutes:
        route?.time != null
          ? route.time / 60
          : undefined,
    };
  });

  return {
    ...travelData,
    places,
  };
}