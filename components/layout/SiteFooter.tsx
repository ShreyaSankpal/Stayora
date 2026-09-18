import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl">Steora</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-paper/70">
            A constraint-aware AI travel agent. Plans are built from travel data,
            personal limits, feasibility checks, and the option to re-plan when
            those constraints change.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-paper/50">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-paper/80">
            <li>
              <Link href="/#how-it-works" className="hover:text-paper">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/#features" className="hover:text-paper">
                Features
              </Link>
            </li>
            <li>
              <Link href="/plan" className="hover:text-paper">
                Plan a trip
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-paper/50">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-paper/80">
            <li>
              <Link href="/login" className="hover:text-paper">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-paper">
                Sign up
              </Link>
            </li>
            <li>
              <Link href="/my-trips" className="hover:text-paper">
                My trips
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-paper/45 sm:px-6">
          Steora frontend foundation. Planning engine, travel APIs, and accounts
          are not connected yet.
        </p>
      </div>
    </footer>
  );
}
