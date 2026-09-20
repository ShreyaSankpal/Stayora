import { normalizeTravelData } from "@/lib/travel/normalizer";
import { getWeather } from "@/lib/weather/weather";
import { getPlaces } from "@/lib/places/places";
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
const places = await getPlaces(
  location.latitude,
  location.longitude
);
const normalizedData = normalizeTravelData(
  location,
  weather,
  places
);

 const resolvedRequest = {
  ...body.request,
  destination: normalizedData.destination,
  weather: normalizedData.weather,
  places: normalizedData.places,
};

  const now = new Date().toISOString();

  const trip: TravelPlanApiResponse["trip"] = {
    id: crypto.randomUUID(),
    status: "planning",
    createdAt: now,
    updatedAt: now,
    request: resolvedRequest,
  };
  console.log("FINAL TRIP RESPONSE:", JSON.stringify(trip, null, 2));

  return Response.json({ trip });
}