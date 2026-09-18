import { getWeather } from "@/lib/weather/weather";
import { geocodeDestination } from "@/lib/location/geocoding";
import type {
  TravelPlanApiRequest,
  TravelPlanApiResponse,
} from "@/types/trip";

export async function POST(
  request: Request
): Promise<Response> {
  const body: TravelPlanApiRequest = await request.json();

  const destinationQuery = body.request.destination.query.trim();

  if (!destinationQuery) {
    return Response.json(
      { error: "Destination is required" },
      { status: 400 }
    );
  }

  const location = await geocodeDestination(destinationQuery);

  if (!location) {
    return Response.json(
      { error: `Could not find destination: ${destinationQuery}` },
      { status: 404 }
    );
  }
  const weather = await getWeather(
  location.latitude,
  location.longitude
);

  const resolvedRequest = {
  ...body.request,
  destination: {
    ...body.request.destination,
    name: location.name,
    country: location.country,
    coordinates: {
      lat: location.latitude,
      lng: location.longitude,
    },
    resolution: "resolved" as const,
  },
  weather,
};

  const now = new Date().toISOString();

  const trip: TravelPlanApiResponse["trip"] = {
    id: crypto.randomUUID(),
    status: "planning",
    createdAt: now,
    updatedAt: now,
    request: resolvedRequest,
  };

  return Response.json({ trip });
}