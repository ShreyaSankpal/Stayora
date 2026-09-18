/**
 * Steora domain types.
 * These describe the eventual API contract (TripRequest in, Trip out),
 * not a specific UI component.
 */

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "INR"
  | "JPY"
  | "AUD"
  | "CAD";

export type Interest =
  | "nature"
  | "food"
  | "history"
  | "culture"
  | "adventure"
  | "shopping"
  | "nightlife"
  | "art"
  | "beaches"
  | "photography";

export type TravelStyle =
  | "relaxed"
  | "balanced"
  | "fast-paced"
  | "luxury"
  | "budget"
  | "adventure";

export type DailyPace = "slow" | "moderate" | "packed";

export type TripStatus =
  | "draft"
  | "planning"
  | "valid"
  | "warning"
  | "needs_replanning";

export type ConstraintStatus = "valid" | "warning" | "needs_replanning";

export type ActivityCategory =
  | "activity"
  | "food"
  | "culture"
  | "nature"
  | "transport"
  | "rest"
  | "other";

export type DaySegment = "morning" | "afternoon" | "evening";

export type BudgetCategory =
  | "activities"
  | "food"
  | "local_transport"
  | "accommodation"
  | "other";

export type PlanningStageId =
  | "understand_requirements"
  | "find_destination"
  | "gather_weather"
  | "find_places"
  | "normalize_data"
  | "apply_constraints"
  | "build_itinerary"
  | "validate_itinerary"
  | "prepare_trip";

export interface Coordinates {
  lat: number;
  lng: number;
}

export type DestinationResolution = "idle" | "suggested" | "resolved";

export interface Destination {
  query: string;
  name?: string;
  country?: string;
  placeId?: string;
  coordinates?: Coordinates;
  resolution: DestinationResolution;
}

export interface TripRequest {
  destination: Destination;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: CurrencyCode;
  interests: Interest[];
  travelStyle: TravelStyle;
  dailyPace: DailyPace;
  maxTravelTimeMinutes: number;
  additionalPreferences: string;
}

export interface Weather {
  date: string;
  condition: string;
  summary: string;
  highC: number;
  lowC: number;
  precipitationChance: number;
}

export type RecommendationReasonCode =
  | "matches_interests"
  | "fits_budget"
  | "fits_available_time"
  | "close_to_previous"
  | "suitable_for_weather"
  | "matches_travel_style";

export interface RecommendationReason {
  code: RecommendationReasonCode;
  label: string;
  detail: string;
}

export interface ActivitySource {
  name: string;
  url?: string;
}

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  locationName: string;
  coordinates?: Coordinates;
  startTime: string;
  durationMinutes: number;
  estimatedCost: number;
  costIsEstimate: boolean;
  distanceFromPreviousKm?: number;
  travelTimeFromPreviousMinutes?: number;
  reasons: RecommendationReason[];
  source?: ActivitySource;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  weather?: Weather;
  segments: Record<DaySegment, Activity[]>;
}

export interface Itinerary {
  days: ItineraryDay[];
}

export interface BudgetLine {
  category: BudgetCategory;
  estimated: number;
  booked: number | null;
}

export interface BudgetBreakdown {
  currency: CurrencyCode;
  totalBudget: number;
  estimatedTotal: number;
  bookedTotal: number | null;
  lines: BudgetLine[];
}

export interface ConstraintResult {
  id:
    | "budget"
    | "schedule"
    | "travel_time"
    | "distance"
    | "weather"
    | "overall";
  label: string;
  status: ConstraintStatus;
  summary: string;
}

export interface Feasibility {
  overall: ConstraintStatus;
  checks: ConstraintResult[];
}

export interface Trip {
  id: string;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
  request: TripRequest;
  itinerary?: Itinerary;
  feasibility?: Feasibility;
  budgetBreakdown?: BudgetBreakdown;
  weather?: Weather[];
}

export interface PlanningStage {
  id: PlanningStageId;
  label: string;
  description: string;
}

export interface SavedTripSummary {
  id: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: CurrencyCode;
  travelStyle: TravelStyle;
  updatedAt: string;
  status: TripStatus;
}

/** Payload the planner will eventually POST to /api/travel-plan */
export interface TravelPlanApiRequest {
  request: TripRequest;
}

/** Payload the planner will eventually receive from /api/travel-plan */
export interface TravelPlanApiResponse {
  trip: Trip;
}
