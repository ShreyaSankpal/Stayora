import type { Destination, Weather } from "@/types/trip";
import type { GeocodingResult } from "@/lib/location/geocoding";
import type { WeatherResult } from "@/lib/weather/weather";
import type { PlaceResult } from "@/lib/places/places";

export interface NormalizedPlace {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category: string;
  distanceFromDestinationKm?: number;
  travelTimeFromDestinationMinutes?: number;
}

export interface NormalizedTravelData {
  destination: Destination;
  weather: WeatherResult;
  places: NormalizedPlace[];
}

export function normalizeTravelData(
  location: GeocodingResult,
  weather: WeatherResult,
  places: PlaceResult[]
): NormalizedTravelData {
  return {
    destination: {
      query: location.name,
      name: location.name,
      country: location.country,
      coordinates: {
        lat: location.latitude,
        lng: location.longitude,
      },
      resolution: "resolved",
    },
    weather,
    places: places.map((place) => ({
      name: place.name,
      coordinates: {
        lat: place.latitude,
        lng: place.longitude,
      },
      category: place.category,
    })),
  };
}