"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PLANNING_STAGES } from "@/lib/constants";
import { readTripDraft } from "@/lib/trip-session";
import type { PlanningStageId } from "@/types/trip";
import { PlanningProgress } from "@/components/planning/PlanningProgress";
import { PreviewBanner } from "@/components/ui/PreviewBanner";

export function PlanningExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const replan = searchParams.get("replan") === "1";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => {
        if (current >= PLANNING_STAGES.length - 1) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 700);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (index < PLANNING_STAGES.length - 1) return;
    const draft = readTripDraft();
    const id = tripId || draft?.id;
    const timeout = window.setTimeout(() => {
      if (id) {
        router.push(`/trip/${id}`);
      }
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [index, router, tripId]);

  const activeId = PLANNING_STAGES[index]?.id as PlanningStageId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">
        {replan ? "Re-planning" : "Planning pipeline"}
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">
        {replan
          ? "Reconsidering the itinerary against updated constraints"
          : "Running the Steora planning stages"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-ink-muted">
        These are frontend visual stages. No travel APIs, constraint engine, or
        AI orchestrator is running yet.
      </p>
      <div className="mt-6">
        <PreviewBanner>
          Progress is simulated so you can review the pipeline UI. The next
          screen shows a preview itinerary shaped like a future API response.
        </PreviewBanner>
      </div>
      <div className="mt-8">
        <PlanningProgress activeId={activeId} />
      </div>
    </div>
  );
}
