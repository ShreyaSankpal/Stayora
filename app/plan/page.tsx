import type { Metadata } from "next";
import { TripPlanner } from "@/components/planner/TripPlanner";

export const metadata: Metadata = {
  title: "Plan a trip",
};

export default function PlanPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">
        Trip planner
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">
        Tell Steora the constraints.
      </h1>
      <p className="mt-3 text-sm leading-6 text-ink-muted">
        Destination, dates, budget, interests, style, and pace become a{" "}
        <code>TripRequest</code>. That payload is what the future{" "}
        <code>POST /api/travel-plan</code> route will receive.
      </p>
      <div className="mt-8">
        <TripPlanner />
      </div>
    </div>
  );
}
