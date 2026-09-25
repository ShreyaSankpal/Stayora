import type {
  Interest,
  TripRequest,
} from "@/types/trip";

import type { NormalizedPlace } from "@/lib/travel/normalizer";

export interface RankedPlace extends NormalizedPlace {
  relevanceScore: number;
  matchedInterests: Interest[];
  preferenceNotes: string[];
}

export function rankPlaces(
  request: TripRequest,
  places: NormalizedPlace[]
): RankedPlace[] {
  return places
    .map((place) => {
      const matchedInterests =
        findMatchedInterests(place, request.interests);

      let relevanceScore = 0;
      const preferenceNotes: string[] = [];

      // Interest matching
      relevanceScore += matchedInterests.length * 30;

      if (matchedInterests.length > 0) {
        preferenceNotes.push(
          `Matches: ${matchedInterests.join(", ")}`
        );
      }

      // Distance preference
      if (
        place.distanceFromDestinationKm !== undefined
      ) {
        if (place.distanceFromDestinationKm <= 5) {
          relevanceScore += 20;
        } else if (
          place.distanceFromDestinationKm <= 15
        ) {
          relevanceScore += 10;
        }
      }

      // Travel time is a soft preference.
      // We do NOT remove places that exceed it.
      if (
        place.travelTimeFromDestinationMinutes !==
        undefined
      ) {
        if (
          place.travelTimeFromDestinationMinutes <=
          request.maxTravelTimeMinutes
        ) {
          relevanceScore += 20;

          preferenceNotes.push(
            "Within your preferred travel time"
          );
        } else {
          const extraMinutes =
            place.travelTimeFromDestinationMinutes -
            request.maxTravelTimeMinutes;

          preferenceNotes.push(
            `Beyond your preferred travel time by ${extraMinutes} min`
          );
        }
      }

      return {
        ...place,
        relevanceScore,
        matchedInterests,
        preferenceNotes,
      };
    })
    .sort(
      (a, b) =>
        b.relevanceScore - a.relevanceScore
    );
  }

function findMatchedInterests(
  place: NormalizedPlace,
  interests: Interest[]
): Interest[] {
  const text =
    `${place.name} ${place.category}`.toLowerCase();

  return interests.filter((interest) => {
    const keywords =
      INTEREST_KEYWORDS[interest] ?? [];

    return keywords.some((keyword) =>
      text.includes(keyword)
    );
  });
}

const INTEREST_KEYWORDS: Record<
  Interest,
  string[]
> = {
  food: [
    "restaurant",
    "cafe",
    "food",
    "bakery",
    "cuisine",
    "bar",
  ],

  adventure: [
    "adventure",
    "park",
    "nature",
    "beach",
    "hiking",
    "trek",
    "water",
  ],

  shopping: [
    "shopping",
    "market",
    "mall",
    "bazaar",
  ],

  nightlife: [
    "nightlife",
    "bar",
    "club",
    "pub",
  ],

  photography: [
    "museum",
    "monument",
    "landmark",
    "viewpoint",
    "beach",
    "garden",
    "park",
    "sight",
  ],

  nature: [
    "nature",
    "park",
    "garden",
    "forest",
    "lake",
    "waterfall",
    "beach",
  ],

  history: [
    "historical",
    "history",
    "monument",
    "fort",
    "palace",
    "heritage",
    "museum",
  ],

  culture: [
    "culture",
    "cultural",
    "museum",
    "heritage",
    "temple",
    "theatre",
  ],

  art: [
    "art",
    "gallery",
    "museum",
    "exhibition",
  ],

  beaches: [
    "beach",
    "coast",
    "shore",
    "seaside",
  ],
};