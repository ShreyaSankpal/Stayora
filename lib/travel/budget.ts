import type {
  BudgetBreakdown,
  BudgetCategory,
  CurrencyCode,
  TravelStyle,
  TripRequest,
  Itinerary,
} from "@/types/trip";

interface DestinationBudgetProfile {
  foodPerPersonPerDay: number;
  localTransportPerPersonPerDay: number;
  accommodationPerRoomPerNight: number;
  activityPerPersonPerDay: number;
}

const DESTINATION_PROFILES: Record<
  string,
  DestinationBudgetProfile
> = {
  singapore: {
    foodPerPersonPerDay: 1500,
    localTransportPerPersonPerDay: 500,
    accommodationPerRoomPerNight: 12000,
    activityPerPersonPerDay: 1500,
  },

  mumbai: {
    foodPerPersonPerDay: 800,
    localTransportPerPersonPerDay: 300,
    accommodationPerRoomPerNight: 5000,
    activityPerPersonPerDay: 700,
  },

  dubai: {
    foodPerPersonPerDay: 1800,
    localTransportPerPersonPerDay: 700,
    accommodationPerRoomPerNight: 10000,
    activityPerPersonPerDay: 2500,
  },

  bangkok: {
    foodPerPersonPerDay: 900,
    localTransportPerPersonPerDay: 350,
    accommodationPerRoomPerNight: 4500,
    activityPerPersonPerDay: 1000,
  },

  london: {
    foodPerPersonPerDay: 3500,
    localTransportPerPersonPerDay: 1200,
    accommodationPerRoomPerNight: 18000,
    activityPerPersonPerDay: 2500,
  },

  paris: {
    foodPerPersonPerDay: 3200,
    localTransportPerPersonPerDay: 1000,
    accommodationPerRoomPerNight: 16000,
    activityPerPersonPerDay: 2200,
  },

  tokyo: {
    foodPerPersonPerDay: 2500,
    localTransportPerPersonPerDay: 800,
    accommodationPerRoomPerNight: 12000,
    activityPerPersonPerDay: 1800,
  },
};

const DEFAULT_PROFILE: DestinationBudgetProfile = {
  foodPerPersonPerDay: 1200,
  localTransportPerPersonPerDay: 500,
  accommodationPerRoomPerNight: 7000,
  activityPerPersonPerDay: 1200,
};

const TRAVEL_STYLE_MULTIPLIERS: Record<
  TravelStyle,
  number
> = {
  budget: 0.7,
  balanced: 1,
  relaxed: 1.15,
  "fast-paced": 1.1,
  adventure: 1.2,
  luxury: 1.8,
};

function getDestinationKey(request: TripRequest) {
  return (
    request.destination.name ??
    request.destination.query
  )
    .trim()
    .toLowerCase();
}

function getBudgetProfile(
  request: TripRequest
): DestinationBudgetProfile {
  const destinationKey =
    getDestinationKey(request);

  return (
    DESTINATION_PROFILES[destinationKey] ??
    DEFAULT_PROFILE
  );
}

function getTripDays(request: TripRequest) {
  const start = new Date(
    `${request.startDate}T00:00:00`
  );

  const end = new Date(
    `${request.endDate}T00:00:00`
  );

  const difference =
    end.getTime() - start.getTime();

  return Math.max(
    1,
    Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    ) + 1
  );
}

function getNights(request: TripRequest) {
  const start = new Date(
    `${request.startDate}T00:00:00`
  );

  const end = new Date(
    `${request.endDate}T00:00:00`
  );

  const difference =
    end.getTime() - start.getTime();

  return Math.max(
    1,
    Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    )
  );
}

function roundCost(value: number) {
  return Math.round(value / 50) * 50;
}

export function calculateBudgetBreakdown(
  request: TripRequest,
  itinerary: Itinerary
): BudgetBreakdown {
  const profile =
    getBudgetProfile(request);

  const styleMultiplier =
    TRAVEL_STYLE_MULTIPLIERS[
      request.travelStyle
    ];

  const days = getTripDays(request);
  const nights = getNights(request);

  const travelers = Math.max(
    1,
    request.travelers
  );

  const rooms = Math.max(
    1,
    Math.ceil(travelers / 2)
  );

  const activityCosts =
    itinerary.days.flatMap((day) => [
      ...day.segments.morning,
      ...day.segments.afternoon,
      ...day.segments.evening,
    ]).map(
      (activity) =>
        activity.estimatedCost ?? 0
    );

  const activityTicketTotal =
    activityCosts.reduce(
      (total, cost) => total + cost,
      0
    );

  const food = roundCost(
    profile.foodPerPersonPerDay *
      travelers *
      days *
      styleMultiplier
  );

  const localTransport = roundCost(
    profile.localTransportPerPersonPerDay *
      travelers *
      days *
      styleMultiplier
  );

  const accommodation = roundCost(
    profile.accommodationPerRoomPerNight *
      rooms *
      nights *
      styleMultiplier
  );

  const activities =
    activityTicketTotal > 0
      ? roundCost(activityTicketTotal)
      : roundCost(
          profile.activityPerPersonPerDay *
            travelers *
            days *
            styleMultiplier
        );

  const lines: Array<{
    category: BudgetCategory;
    estimated: number;
    booked: number | null;
  }> = [
    {
      category: "activities",
      estimated: activities,
      booked: null,
    },
    {
      category: "food",
      estimated: food,
      booked: null,
    },
    {
      category: "local_transport",
      estimated: localTransport,
      booked: null,
    },
    {
      category: "accommodation",
      estimated: accommodation,
      booked: null,
    },
    {
      category: "other",
      estimated: 0,
      booked: null,
    },
  ];

  const estimatedTotal =
    lines.reduce(
      (total, line) =>
        total + line.estimated,
      0
    );

  return {
    currency:
      request.currency as CurrencyCode,
    totalBudget: request.budget,
    estimatedTotal,
    bookedTotal: null,
    lines,
  };
}