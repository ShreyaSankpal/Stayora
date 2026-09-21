import { calculateBudget } from "@/lib/travel/budget";
import { generateItinerary } from "@/lib/ai/itinerary";
import { filterEligiblePlaces } from "@/lib/travel/filter";
import { calculateTravelTimes } from "@/lib/travel/routing";
import { evaluateConstraints } from "@/lib/travel/constraints";
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

  const destinationQuery =
    body.request.destination.query.trim();

  if (!destinationQuery) {
    return Response.json(
      { error: "Destination is required" },
      { status: 400 }
    );
  }

  const location =
    await geocodeDestination(destinationQuery);

  if (!location) {
    return Response.json(
      {
        error: `Could not find destination: ${destinationQuery}`,
      },
      { status: 404 }
    );
  }
const weather = await getWeather(
  location.latitude,
  location.longitude,
  body.request.startDate,
  body.request.endDate
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

  const travelDataWithRoutes =
    await calculateTravelTimes(normalizedData);
 const eligiblePlaces = filterEligiblePlaces(
  body.request,
  travelDataWithRoutes.places
);
  
  const feasibility = evaluateConstraints(
  body.request,
  {
    ...travelDataWithRoutes,
    places: eligiblePlaces,
  }
);

  const aiPlan = await generateItinerary({
    request: {
      ...body.request,
      destination: travelDataWithRoutes.destination,
    },
    weather: travelDataWithRoutes.weather,
    eligiblePlaces,
  });

  const budgetBreakdown = calculateBudget({
    request: body.request,
    itinerary: aiPlan.itinerary,
  });

  const resolvedRequest = {
    ...body.request,
    destination: travelDataWithRoutes.destination,
    weather: travelDataWithRoutes.weather,
    places: eligiblePlaces,
  };

  const now = new Date().toISOString();

  const trip: TravelPlanApiResponse["trip"] = {
    id: crypto.randomUUID(),
    status:
      feasibility.overall === "needs_replanning"
        ? "needs_replanning"
        : feasibility.overall === "warning"
          ? "warning"
          : "valid",
    createdAt: now,
    updatedAt: now,
    request: resolvedRequest,
    feasibility,
    itinerary: aiPlan.itinerary,
    budgetBreakdown,
  };

  console.log(
    "FINAL TRIP RESPONSE:",
    JSON.stringify(trip, null, 2)
  );

  return Response.json({ trip });
}