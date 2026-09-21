import type {
  BudgetBreakdown,
  BudgetLine,
  TripRequest,
  Itinerary,
} from "@/types/trip";

interface BudgetInput {
  request: TripRequest;
  itinerary: Itinerary;
}

export function calculateBudget({
  request,
  itinerary,
}: BudgetInput): BudgetBreakdown {
  const activities = calculateActivitiesCost(itinerary);

  const days = calculateTripDays(
    request.startDate,
    request.endDate
  );

  const food = calculateFoodCost(
    request.travelers,
    days
  );

  const localTransport = calculateTransportCost(
    request.travelers,
    days
  );

  const accommodation = calculateAccommodationCost(
    request.travelers,
    days
  );

  const lines: BudgetLine[] = [
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

  const estimatedTotal = lines.reduce(
    (total, line) => total + line.estimated,
    0
  );

  return {
    currency: request.currency,
    totalBudget: request.budget,
    estimatedTotal,
    bookedTotal: null,
    lines,
  };
}

function calculateActivitiesCost(
  itinerary: Itinerary
): number {
  return itinerary.days.reduce((total, day) => {
    const activities = [
      ...day.segments.morning,
      ...day.segments.afternoon,
      ...day.segments.evening,
    ];

    return (
      total +
      activities.reduce(
        (dayTotal, activity) =>
          dayTotal + activity.estimatedCost,
        0
      )
    );
  }, 0);
}

function calculateFoodCost(
  travelers: number,
  days: number
): number {
  const estimatedFoodPerPersonPerDay = 350;

  return (
    travelers *
    days *
    estimatedFoodPerPersonPerDay
  );
}

function calculateTransportCost(
  travelers: number,
  days: number
): number {
  const estimatedTransportPerPersonPerDay = 150;

  return (
    travelers *
    days *
    estimatedTransportPerPersonPerDay
  );
}

function calculateAccommodationCost(
  travelers: number,
  days: number
): number {
  const estimatedAccommodationPerNight = 800;

  const rooms = Math.ceil(travelers / 2);

  const nights = Math.max(days - 1, 1);

  return (
    rooms *
    nights *
    estimatedAccommodationPerNight
  );
}

function calculateTripDays(
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const difference =
    end.getTime() - start.getTime();

  return (
    Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ) + 1
  );
}