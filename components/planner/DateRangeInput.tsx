export function DateRangeInput({
  startDate,
  endDate,
  onChange,
}: {
  startDate: string;
  endDate: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="startDate" className="text-sm font-medium">
          Start date
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(event) =>
            onChange({ startDate: event.target.value, endDate })
          }
          className="mt-2 w-full rounded-xl border border-line bg-paper-raised px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="text-sm font-medium">
          End date
        </label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          min={startDate || undefined}
          onChange={(event) =>
            onChange({ startDate, endDate: event.target.value })
          }
          className="mt-2 w-full rounded-xl border border-line bg-paper-raised px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
        />
      </div>
    </div>
  );
}
