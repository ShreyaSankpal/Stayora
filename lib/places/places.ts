export interface PlaceResult {
  name: string;
  latitude: number;
  longitude: number;
  category: string;
}

const PLACE_CATEGORIES = [
  "attraction",
  "food_and_drink",
  "shopping",
  "park",
] as const;

export async function getPlaces(
  latitude: number,
  longitude: number
): Promise<PlaceResult[]> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    throw new Error("Mapbox token is missing");
  }

  const results = await Promise.all(
    PLACE_CATEGORIES.map(async (category) => {
      const url = new URL(
        `https://api.mapbox.com/search/searchbox/v1/category/${category}`
      );

      url.searchParams.set("proximity", `${longitude},${latitude}`);
      url.searchParams.set("limit", "5");
      url.searchParams.set("access_token", token);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${category}: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      return data.features.map((feature: any) => ({
        name: feature.properties.name,
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        category,
      }));
    })
  );

  const places = results.flat();

  console.log("MAPBOX PLACES:", places);

  return places;
}