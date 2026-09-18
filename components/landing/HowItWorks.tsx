const steps = [
  {
    n: "01",
    title: "Tell Steora what you want",
    body: "Structured requirements: destination, dates, travelers, budget, interests, style, and pace.",
  },
  {
    n: "02",
    title: "Gather real travel data",
    body: "The server will query travel APIs for places, timing, and weather — not invent a city from a prompt.",
  },
  {
    n: "03",
    title: "Apply your constraints",
    body: "A constraint engine filters options by budget, distance, transfer time, and daily pace.",
  },
  {
    n: "04",
    title: "AI builds the itinerary",
    body: "The orchestrator sequences remaining options into morning, afternoon, and evening blocks.",
  },
  {
    n: "05",
    title: "Validate feasibility",
    body: "A validation pass checks whether the days still fit money, time, weather, and travel limits.",
  },
  {
    n: "06",
    title: "Explore and re-plan",
    body: "Adjust a constraint and Steora re-runs the relevant stages instead of locking the first draft.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">How it works</p>
      <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight sm:text-4xl">
        A planning pipeline, not a single prompt.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
        Steora is designed around data in, constraints, AI orchestration, then
        validation. The frontend you are using is already shaped for that flow.
      </p>
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => (
          <li
            key={step.n}
            className="rounded-2xl border border-line bg-paper-raised p-5"
          >
            <p className="font-mono text-xs text-accent">{step.n}</p>
            <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
