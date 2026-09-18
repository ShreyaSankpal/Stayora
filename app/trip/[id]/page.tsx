import type { Metadata } from "next";
import { TripExperience } from "@/components/trip/TripExperience";

export const metadata: Metadata = {
  title: "Trip itinerary",
};

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TripExperience tripId={id} />;
}
