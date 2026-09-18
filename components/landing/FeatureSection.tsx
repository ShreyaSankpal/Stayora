const features = [
  {
    title: "Budget-aware planning",
    body: "Every candidate activity carries an estimated cost so the plan can stay inside a stated budget.",
  },
  {
    title: "Weather-aware planning",
    body: "Day-level weather context is a first-class input, so outdoor vs indoor placement can change.",
  },
  {
    title: "Distance and time-aware planning",
    body: "Transfers are measured against your maximum preferred travel time between activities.",
  },
  {
    title: "Explainable recommendations",
    body: "Each stop can show why it was kept: interest fit, budget, weather, proximity, or style.",
  },
  {
    title: "Feasibility validation",
    body: "A plan can be valid, carry warnings, or need replanning — not just look complete.",
  },
  {
    title: "Dynamic re-planning",
    body: "Changing budget, dates, pace, or interests is meant to re-run the pipeline, not edit a brochure.",
  },
  {
    title: "Personalized travel style",
    body: "Relaxed, packed, luxury, or budget changes density and the kind of stops that survive constraints.",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="border-y border-line bg-paper-raised">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">Features</p>
        <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
          Built for decisions, not listings.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-line bg-paper p-5">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
