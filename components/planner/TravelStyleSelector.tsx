import { TRAVEL_STYLE_OPTIONS } from "@/lib/constants";
import type { TravelStyle } from "@/types/trip";

export function TravelStyleSelector({
  value,
  onChange,
}: {
  value: TravelStyle;
  onChange: (style: TravelStyle) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">Travel style</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {TRAVEL_STYLE_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-xl border p-3 ${
                selected ? "border-accent bg-accent-soft" : "border-line bg-paper-raised"
              }`}
            >
              <input
                type="radio"
                name="travelStyle"
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="block text-sm font-medium">{option.label}</span>
              <span className="mt-1 block text-xs text-ink-muted">
                {option.description}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
