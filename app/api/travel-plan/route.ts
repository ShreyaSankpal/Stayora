import type { NextRequest } from "next/server";
import type {
  TravelPlanApiRequest,
  TravelPlanApiResponse,
} from "@/types/trip";

export async function POST(
  request: NextRequest
): Promise<Response> {
  const body: TravelPlanApiRequest = await request.json();

  const trip: TravelPlanApiResponse["trip"] = {
    id: crypto.randomUUID(),
    status: "planning",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    request: body.request,
  };

  return Response.json({ trip });
}