import type { TripRequest } from "@/types/trip";
import type { NormalizedPlace } from "@/lib/travel/normalizer";

export function filterEligiblePlaces(
  request: TripRequest,
  places: NormalizedPlace[]
): NormalizedPlace[] {
  return places.filter((place) => {
    if (place.travelTimeFromDestinationMinutes === undefined) {
      return true;
    }

    return (
      place.travelTimeFromDestinationMinutes <=
      request.maxTravelTimeMinutes
    );
  });
}