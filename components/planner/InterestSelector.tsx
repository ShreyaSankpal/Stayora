import { INTEREST_OPTIONS } from "@/lib/constants";
import type { Interest } from "@/types/trip";

export function InterestSelector({
  value,
  onChange,
}: {
  value: Interest[];
  onChange: (interests: Interest[]) => void;
}) {
  function toggle(interest: Interest) {
    if (value.includes(interest)) {
      onChange(value.filter((item) => item !== interest));
      return;
    }
    onChange([...value, interest]);
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium">Interests</legend>
      <p className="mt-1 text-xs text-ink-muted">Select all that apply.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((option) => {
          const selected = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option.value)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                selected
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-paper-raised hover:border-ink/20"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
