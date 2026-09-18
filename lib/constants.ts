import type {
  CurrencyCode,
  DailyPace,
  Interest,
  PlanningStage,
  TravelStyle,
} from "@/types/trip";

export const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: "nature", label: "Nature" },
  { value: "food", label: "Food" },
  { value: "history", label: "History" },
  { value: "culture", label: "Culture" },
  { value: "adventure", label: "Adventure" },
  { value: "shopping", label: "Shopping" },
  { value: "nightlife", label: "Nightlife" },
  { value: "art", label: "Art" },
  { value: "beaches", label: "Beaches" },
  { value: "photography", label: "Photography" },
];

export const TRAVEL_STYLE_OPTIONS: {
  value: TravelStyle;
  label: string;
  description: string;
}[] = [
  {
    value: "relaxed",
    label: "Relaxed",
    description: "Fewer stops, longer dwell time",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "A mix of highlights and downtime",
  },
  {
    value: "fast-paced",
    label: "Fast-paced",
    description: "Packed days, more coverage",
  },
  {
    value: "luxury",
    label: "Luxury",
    description: "Comfort and higher-end experiences",
  },
  {
    value: "budget",
    label: "Budget",
    description: "Cost-first, still feasible days",
  },
  {
    value: "adventure",
    label: "Adventure",
    description: "Active, outdoor-forward days",
  },
];

export const PACE_OPTIONS: {
  value: DailyPace;
  label: string;
  description: string;
}[] = [
  { value: "slow", label: "Slow", description: "2–3 activities per day" },
  { value: "moderate", label: "Moderate", description: "3–4 activities per day" },
  { value: "packed", label: "Packed", description: "Full days, tight transitions" },
];

export const CURRENCY_OPTIONS: { value: CurrencyCode; label: string }[] = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "INR", label: "INR" },
  { value: "JPY", label: "JPY" },
  { value: "AUD", label: "AUD" },
  { value: "CAD", label: "CAD" },
];

export const PLANNING_STAGES: PlanningStage[] = [
  {
    id: "understand_requirements",
    label: "Understanding your requirements",
    description: "Parsing destination, dates, budget, pace, and style into constraints.",
  },
  {
    id: "find_destination",
    label: "Finding destination",
    description: "Resolving the place name and coordinates for downstream travel data.",
  },
  {
    id: "gather_weather",
    label: "Gathering weather data",
    description: "Collecting forecast context for each day of the trip.",
  },
  {
    id: "find_places",
    label: "Finding places and activities",
    description: "Pulling candidate places, hours, and categories from travel sources.",
  },
  {
    id: "normalize_data",
    label: "Normalizing travel data",
    description: "Converting vendor payloads into a shared Steora data model.",
  },
  {
    id: "apply_constraints",
    label: "Applying constraints",
    description: "Filtering options by budget, travel time, pace, and interests.",
  },
  {
    id: "build_itinerary",
    label: "Building itinerary with AI",
    description: "The orchestrator sequences a feasible day-by-day plan.",
  },
  {
    id: "validate_itinerary",
    label: "Validating itinerary",
    description: "Checking budget, schedule, distance, weather, and travel-time feasibility.",
  },
  {
    id: "prepare_trip",
    label: "Preparing your trip",
    description: "Packaging the validated itinerary for review and re-planning.",
  },
];

export const SAMPLE_DESTINATIONS = [
  {
    name: "Kyoto",
    country: "Japan",
    placeId: "sample:kyoto",
    coordinates: { lat: 35.0116, lng: 135.7681 },
  },
  {
    name: "Lisbon",
    country: "Portugal",
    placeId: "sample:lisbon",
    coordinates: { lat: 38.7223, lng: -9.1393 },
  },
  {
    name: "Oaxaca",
    country: "Mexico",
    placeId: "sample:oaxaca",
    coordinates: { lat: 17.0732, lng: -96.7266 },
  },
] as const;
