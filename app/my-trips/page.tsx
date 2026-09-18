import type { Metadata } from "next";
import Link from "next/link";
import { PREVIEW_SAVED_TRIPS } from "@/lib/preview-data";
import { EmptyState } from "@/components/ui/EmptyState";
import { PreviewBanner } from "@/components/ui/PreviewBanner";
import { TripCard } from "@/components/trips/TripCard";

export const metadata: Metadata = {
  title: "My trips",
};

export default async function MyTripsPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;
  const showEmpty = empty === "1";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">Library</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">My trips</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
        Saved trips will come from Supabase. Cards below are preview records so
        the layout can be reviewed before persistence exists.
      </p>
      <div className="mt-6">
        <PreviewBanner>
          No database is connected. Use{" "}
          <Link href="/my-trips?empty=1" className="underline">
            empty state
          </Link>{" "}
          or{" "}
          <Link href="/my-trips" className="underline">
            sample cards
          </Link>
          .
        </PreviewBanner>
      </div>
      {showEmpty ? (
        <div className="mt-8">
          <EmptyState
            title="No saved trips yet"
            body="When accounts and Supabase are connected, completed itineraries will appear here."
            action={
              <Link
                href="/plan"
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
              >
                Start planning
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PREVIEW_SAVED_TRIPS.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
