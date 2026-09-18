import type { Weather } from "@/types/trip";

export function WeatherCard({
  weather,
  compact = false,
}: {
  weather: Weather;
  compact?: boolean;
}) {
  return (
    <article
      className={`rounded-xl border border-line bg-paper ${compact ? "px-3 py-2" : "p-4"}`}
    >
      <p className="text-xs uppercase tracking-wide text-ink-muted">Weather</p>
      <p className="mt-1 font-medium">{weather.condition}</p>
      <p className={`${compact ? "text-xs" : "text-sm"} mt-1 text-ink-muted`}>
        {weather.highC}° / {weather.lowC}°C · {weather.precipitationChance}% precip
      </p>
      {!compact ? (
        <p className="mt-2 text-sm text-ink-muted">{weather.summary}</p>
      ) : null}
    </article>
  );
}
