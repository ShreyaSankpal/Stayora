import type {
  Activity,
  Itinerary,
  SavedTripSummary,
  Trip,
} from "@/types/trip";

function createActivity(
  activity: Omit<Activity, "costStatus">
): Activity {
  return {
    ...activity,
    costStatus: "unavailable",
  };
}

const previewItinerary: Itinerary = {
  days: [
    {
      dayNumber: 1,
      date: "2026-01-01",
      segments: {
        morning: [
          createActivity({
            id: "preview-1",
            name: "Sample destination activity",
            category: "activity",
            locationName: "Destination",
            startTime: "09:00",
            durationMinutes: 120,
            reasons: [],
          }),
        ],
        afternoon: [],
        evening: [],
      },
    },
  ],
};

export const previewTrip: Trip = {
  id: "preview-trip",
  status: "draft",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  request: {
    destination: {
      query: "Preview",
      name: "Preview",
      resolution: "suggested",
    },
    startDate: "2026-01-01",
    endDate: "2026-01-02",
    travelers: 1,
    budget: 0,
    currency: "INR",
    interests: [],
    travelStyle: "balanced",
    dailyPace: "moderate",
    maxTravelTimeMinutes: 60,
    additionalPreferences: "",
  },

  itinerary: previewItinerary,

  budgetBreakdown: {
    currency: "INR",
    totalBudget: 0,
    estimatedTotal: 0,
    bookedTotal: null,
    lines: [
      {
        category: "activities",
        estimated: 0,
        booked: null,
      },
      {
        category: "food",
        estimated: 0,
        booked: null,
      },
      {
        category: "local_transport",
        estimated: 0,
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
    ],
  },
};

/**
 * Temporary preview data for the My Trips page.
 *
 * These contain no fake prices or fake booking information.
 * They only keep the existing preview UI functional until
 * Supabase persistence is connected.
 */
export const PREVIEW_SAVED_TRIPS: SavedTripSummary[] = [];