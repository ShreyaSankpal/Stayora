import type { Metadata } from "next";
import { Suspense } from "react";
import { PlanningExperience } from "@/components/planning/PlanningExperience";
import { LoadingState } from "@/components/ui/LoadingState";

export const metadata: Metadata = {
  title: "Planning",
};

export default function PlanLoadingPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-16">
          <LoadingState label="Opening planning stages" />
        </div>
      }
    >
      <PlanningExperience />
    </Suspense>
  );
}
