import type {
  ConstraintResult,
  ConstraintStatus,
  Feasibility,
  TripRequest,
} from "@/types/trip";
import type { NormalizedTravelData } from "@/lib/travel/normalizer";

export function evaluateConstraints(
  request: TripRequest,
  travelData: NormalizedTravelData
): Feasibility {
  const checks: ConstraintResult[] = [];

  checks.push(checkBudget(request));
  checks.push(checkSchedule(request));
  checks.push(checkTravelTime(request, travelData));
  checks.push(checkDistance(travelData));
  checks.push(checkWeather(travelData));

  const overall = getOverallStatus(checks);

  checks.push({
    id: "overall",
    label: "Overall feasibility",
    status: overall,
    summary: getOverallSummary(overall),
  });

  return {
    overall,
    checks,
  };
}

function checkBudget(request: TripRequest): ConstraintResult {
  if (request.budget <= 0) {
    return {
      id: "budget",
      label: "Budget",
      status: "needs_replanning",
      summary: "The trip budget must be greater than zero.",
    };
  }

  return {
    id: "budget",
    label: "Budget",
    status: "valid",
    summary: `A ${request.currency} ${request.budget} budget has been provided.`,
  };
}

function checkSchedule(request: TripRequest): ConstraintResult {
  if (!request.startDate || !request.endDate) {
    return {
      id: "schedule",
      label: "Schedule",
      status: "needs_replanning",
      summary: "Start and end dates are required.",
    };
  }

  if (request.endDate < request.startDate) {
    return {
      id: "schedule",
      label: "Schedule",
      status: "needs_replanning",
      summary: "The end date cannot be before the start date.",
    };
  }

  return {
    id: "schedule",
    label: "Schedule",
    status: "valid",
    summary: `Trip dates are valid from ${request.startDate} to ${request.endDate}.`,
  };
}

function checkTravelTime(
  request: TripRequest,
  travelData: NormalizedTravelData
): ConstraintResult {
  if (request.maxTravelTimeMinutes <= 0) {
    return {
      id: "travel_time",
      label: "Travel time",
      status: "needs_replanning",
      summary: "Maximum travel time must be greater than zero.",
    };
  }

  if (travelData.places.length === 0) {
    return {
      id: "travel_time",
      label: "Travel time",
      status: "warning",
      summary:
        "No places were returned, so travel-time constraints cannot be evaluated yet.",
    };
  }

  const placesOverLimit = travelData.places.filter(
    (place) =>
      place.travelTimeFromDestinationMinutes !== undefined &&
      place.travelTimeFromDestinationMinutes >
        request.maxTravelTimeMinutes
  );

  if (placesOverLimit.length > 0) {
    return {
      id: "travel_time",
      label: "Travel time",
      status: "warning",
      summary: `${placesOverLimit.length} place(s) exceed your ${request.maxTravelTimeMinutes}-minute travel-time limit.`,
    };
  }

  return {
    id: "travel_time",
    label: "Travel time",
    status: "valid",
    summary: `All available places are within your ${request.maxTravelTimeMinutes}-minute travel-time limit.`,
  };
}

function checkDistance(
  travelData: NormalizedTravelData
): ConstraintResult {
  if (travelData.places.length === 0) {
    return {
      id: "distance",
      label: "Distance",
      status: "warning",
      summary:
        "No places were returned, so distance-based planning cannot be evaluated yet.",
    };
  }

  return {
    id: "distance",
    label: "Distance",
    status: "valid",
    summary: `${travelData.places.length} place(s) are available for distance-based planning.`,
  };
}

function checkWeather(
  travelData: NormalizedTravelData
): ConstraintResult {
  if (!travelData.weather) {
    return {
      id: "weather",
      label: "Weather",
      status: "warning",
      summary: "Weather data is not available yet.",
    };
  }

  return {
    id: "weather",
    label: "Weather",
    status: "valid",
    summary: `Current weather data is available: ${travelData.weather.temperature}°C.`,
  };
}

function getOverallStatus(
  checks: ConstraintResult[]
): ConstraintStatus {
  if (checks.some((check) => check.status === "needs_replanning")) {
    return "needs_replanning";
  }

  if (checks.some((check) => check.status === "warning")) {
    return "warning";
  }

  return "valid";
}

function getOverallSummary(status: ConstraintStatus): string {
  if (status === "needs_replanning") {
    return "One or more constraints require changes before planning can continue.";
  }

  if (status === "warning") {
    return "The trip can continue, but some places do not satisfy all travel constraints.";
  }

  return "The available trip constraints are currently satisfied.";
}