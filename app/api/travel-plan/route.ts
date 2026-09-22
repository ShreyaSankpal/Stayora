import { calculateBudgetBreakdown } from "@/lib/travel/budget";
import { generateItinerary } from "@/lib/ai/itinerary";
import { filterEligiblePlaces } from "@/lib/travel/filter";
import { calculateTravelTimes,
  calculateRouteGeometry, } from "@/lib/travel/routing";
import { evaluateConstraints } from "@/lib/travel/constraints";
import { normalizeTravelData } from "@/lib/travel/normalizer";
import { getWeather } from "@/lib/weather/weather";
import { getPlaces } from "@/lib/places/places";
import { geocodeDestination } from "@/lib/location/geocoding";
import type {
  ConstraintResult,
  ConstraintStatus,
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

  /*
   * Step 1:
   * Check constraints that can be evaluated
   * before generating the itinerary.
   */
  const feasibility = evaluateConstraints(
    body.request,
    {
      ...travelDataWithRoutes,
      places: eligiblePlaces,
    }
  );

  /*
   * Step 2:
   * Generate the AI itinerary.
   */
  const aiPlan = await generateItinerary({
  request: body.request,
  weather: travelDataWithRoutes.weather,
  eligiblePlaces,
  routing: travelDataWithRoutes.routing,
});
  /*
   * Step 3:
   * Calculate the estimated cost of the
   * generated itinerary.
   */

const routeGeometryByDay = await Promise.all(
  aiPlan.itinerary.days.map(async (day) => {
    const points = getDayRoutePoints(
      day,
      travelDataWithRoutes.destination
    );

    if (points.length < 2) {
      return [];
    }

    return calculateRouteGeometry(points);
  })
);

  const budgetBreakdown = calculateBudgetBreakdown(
  body.request,
  aiPlan.itinerary
);


  const itineraryWithRoutes = {
  ...aiPlan.itinerary,
  days: aiPlan.itinerary.days.map((day, index) => ({
    ...day,
    routeGeometry: routeGeometryByDay[index],
  })),
};

function getDayRoutePoints(
  day: {
    segments: {
      morning: Array<{ coordinates?: { lat: number; lng: number } }>;
      afternoon: Array<{ coordinates?: { lat: number; lng: number } }>;
      evening: Array<{ coordinates?: { lat: number; lng: number } }>;
    };
  },
  destination: { coordinates?: { lat: number; lng: number } }
): Array<{ lat: number; lng: number }> {
  const points: Array<{ lat: number; lng: number }> = [];

  if (destination.coordinates) {
    points.push(destination.coordinates);
  }

  const segments = [
    day.segments.morning,
    day.segments.afternoon,
    day.segments.evening,
  ];

  segments.forEach((activities) => {
    activities.forEach((activity) => {
      if (activity.coordinates) {
        points.push(activity.coordinates);
      }
    });
  });

  return points;
}

  /*
   * Step 4:
   * Validate the final estimated budget.
   */
  const budgetCheck = checkFinalBudget(
    body.request.budget,
    budgetBreakdown.estimatedTotal,
    body.request.currency
  );

  const finalChecks = feasibility.checks.filter(
    (check) => check.id !== "overall"
  );

  const existingBudgetIndex = finalChecks.findIndex(
    (check) => check.id === "budget"
  );

  if (existingBudgetIndex !== -1) {
    finalChecks[existingBudgetIndex] = budgetCheck;
  } else {
    finalChecks.push(budgetCheck);
  }

  const finalOverall = getOverallStatus(finalChecks);

  finalChecks.push({
    id: "overall",
    label: "Overall feasibility",
    status: finalOverall,
    summary: getOverallSummary(finalOverall),
  });

  const finalFeasibility = {
    overall: finalOverall,
    checks: finalChecks,
  };

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
      finalFeasibility.overall === "needs_replanning"
        ? "needs_replanning"
        : finalFeasibility.overall === "warning"
          ? "warning"
          : "valid",
    createdAt: now,
    updatedAt: now,
    request: resolvedRequest,
    feasibility: finalFeasibility,
    itinerary: aiPlan.itinerary,
    budgetBreakdown,
  };

  console.log(
    "FINAL TRIP RESPONSE:",
    JSON.stringify(trip, null, 2)
  );

  return Response.json({ trip });
}

function checkFinalBudget(
  budget: number,
  estimatedTotal: number,
  currency: string
): ConstraintResult {
  if (budget <= 0) {
    return {
      id: "budget",
      label: "Budget",
      status: "needs_replanning",
      summary: "The trip budget must be greater than zero.",
    };
  }

  if (estimatedTotal > budget) {
    return {
      id: "budget",
      label: "Budget",
      status: "needs_replanning",
      summary: `The estimated trip cost is ${currency} ${estimatedTotal}, which exceeds your ${currency} ${budget} budget.`,
    };
  }

  return {
    id: "budget",
    label: "Budget",
    status: "valid",
    summary: `The estimated trip cost of ${currency} ${estimatedTotal} is within your ${currency} ${budget} budget.`,
  };
}

function getOverallStatus(
  checks: ConstraintResult[]
): ConstraintStatus {
  if (
    checks.some(
      (check) => check.status === "needs_replanning"
    )
  ) {
    return "needs_replanning";
  }

  if (
    checks.some(
      (check) => check.status === "warning"
    )
  ) {
    return "warning";
  }

  return "valid";
}

function getOverallSummary(
  status: ConstraintStatus
): string {
  if (status === "needs_replanning") {
    return "One or more constraints require changes before planning can continue.";
  }

  if (status === "warning") {
    return "The trip can continue, but some places do not satisfy all travel constraints.";
  }

  return "The available trip constraints are currently satisfied.";
}