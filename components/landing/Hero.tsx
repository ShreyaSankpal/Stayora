import Link from "next/link";

export function Hero() {
  return (
    <section className="steora-grid border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent">
            AI travel agent · Decision engine
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Personalized trips that respect your constraints.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-ink-muted sm:text-lg">
            Steora does not turn a prompt into a wish list. It gathers travel
            data, applies budget, time, weather, and pace limits, lets an AI
            orchestrator sequence the days, then validates whether the plan can
            actually be done.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/plan"
              className="rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-white hover:bg-accent-hover"
            >
              Plan My Trip
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full border border-line bg-paper-raised px-6 py-3 text-center text-sm font-medium hover:border-ink/20"
            >
              See the planning pipeline
            </a>
          </div>
        </div>

        <aside className="rounded-2xl border border-line bg-paper-raised p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            What Steora optimizes for
          </p>
          <ul className="mt-4 space-y-4 text-sm">
            {[
              ["Real travel data", "Places, timing, and weather — not a single chat reply."],
              ["Personal constraints", "Budget, travelers, pace, and maximum transfer time."],
              ["AI planning", "An orchestrator sequences days after constraints are applied."],
              ["Feasibility", "Validation flags plans that look good but do not hold."],
              ["Dynamic re-planning", "Change a constraint and Steora reconsiders the itinerary."],
            ].map(([title, body]) => (
              <li key={title} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-ink-muted">{body}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
