import type {
  Activity,
  BudgetBreakdown,
  BudgetCategory,
  BudgetLine,
  CurrencyCode,
  TripRequest,
} from "@/types/trip";

/**
 * Steora budget calculation.
 *
 * Important:
 * We do NOT invent destination-based prices.
 * Only verified activity costs are included as known costs.
 *
 * Costs that are unavailable are tracked separately so the UI
 * can clearly tell the user that the budget is incomplete.
 */

export interface BudgetCalculationResult
  extends BudgetBreakdown {
  unpricedActivities: number;
  pricingCoverage: number;
}

export function calculateBudgetBreakdown(
  request: TripRequest,
  itinerary: {
    days: Array<{
      segments: {
        morning: Activity[];
        afternoon: Activity[];
        evening: Activity[];
      };
    }>;
  }
): BudgetCalculationResult {
  const activities = itinerary.days.flatMap((day) => [
    ...day.segments.morning,
    ...day.segments.afternoon,
    ...day.segments.evening,
  ]);

  const pricedActivities = activities.filter(
    (activity) =>
      activity.cost !== undefined &&
      activity.costStatus === "verified"
  );

  const unpricedActivities = activities.filter(
    (activity) =>
      activity.cost === undefined ||
      activity.costStatus === "unavailable"
  ).length;

  const activitiesTotal = pricedActivities.reduce(
    (total, activity) => total + (activity.cost ?? 0),
    0
  );

  const foodTotal = calculateVerifiedCategoryTotal(
    activities,
    "food"
  );

  const transportTotal = calculateVerifiedCategoryTotal(
    activities,
    "transport"
  );

  const lines: BudgetLine[] = [
    {
      category: "activities",
      estimated: activitiesTotal,
      booked: null,
    },
    {
      category: "food",
      estimated: foodTotal,
      booked: null,
    },
    {
      category: "local_transport",
      estimated: transportTotal,
      booked: null,
    },
    {
      category: "accommodation",
      estimated: 0,
      booked: null,
    },
    {
      category: "other",
      estimated: 0,
      booked: null,
    },
  ];

  const knownTotal = lines.reduce(
    (total, line) => total + line.estimated,
    0
  );

  const pricingCoverage =
    activities.length === 0
      ? 100
      : Math.round(
          (pricedActivities.length / activities.length) * 100
        );

  return {
    currency: request.currency as CurrencyCode,
    totalBudget: request.budget,

    /*
     * This is currently the total of VERIFIED costs only.
     * It must not be presented as the complete trip cost
     * when some prices are unavailable.
     */
    estimatedTotal: knownTotal,

    bookedTotal: null,
    lines,

    unpricedActivities,
    pricingCoverage,
  };
}

function calculateVerifiedCategoryTotal(
  activities: Activity[],
  category: "food" | "transport"
): number {
  return activities
    .filter(
      (activity) =>
        activity.category === category &&
        activity.cost !== undefined &&
        activity.costStatus === "verified"
    )
    .reduce(
      (total, activity) => total + (activity.cost ?? 0),
      0
    );
}