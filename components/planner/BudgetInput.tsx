import { CURRENCY_OPTIONS } from "@/lib/constants";
import type { CurrencyCode } from "@/types/trip";

export function BudgetInput({
  budget,
  currency,
  onChange,
}: {
  budget: number;
  currency: CurrencyCode;
  onChange: (value: { budget: number; currency: CurrencyCode }) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
      <div>
        <label htmlFor="budget" className="text-sm font-medium">
          Total budget
        </label>
        <input
          id="budget"
          type="number"
          min={0}
          step={50}
          value={budget}
          onChange={(event) =>
            onChange({
              budget: Number(event.target.value),
              currency,
            })
          }
          className="mt-2 w-full rounded-xl border border-line bg-paper-raised px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="currency" className="text-sm font-medium">
          Currency
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(event) =>
            onChange({
              budget,
              currency: event.target.value as CurrencyCode,
            })
          }
          className="mt-2 w-full rounded-xl border border-line bg-paper-raised px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
        >
          {CURRENCY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
