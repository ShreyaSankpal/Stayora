import type { NormalizedTravelData } from "@/lib/travel/normalizer";

export async function calculateTravelTimes(
  travelData: NormalizedTravelData
): Promise<NormalizedTravelData> {
  return travelData;
}