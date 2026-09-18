import { FeatureSection } from "@/components/landing/FeatureSection";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeatureSection />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-line bg-ink px-6 py-10 text-paper sm:px-10">
          <h2 className="font-display text-3xl">Ready to constrain a trip?</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-paper/70">
            Start with structured requirements. Steora is built to gather data,
            apply limits, plan, validate, then let you re-plan.
          </p>
          <Link
            href="/plan"
            className="mt-6 inline-flex rounded-full bg-paper px-5 py-3 text-sm font-medium text-ink hover:bg-paper-raised"
          >
            Plan My Trip
          </Link>
        </div>
      </section>
    </>
  );
}
