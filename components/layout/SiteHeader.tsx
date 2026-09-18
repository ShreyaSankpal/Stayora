"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/my-trips", label: "My Trips" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-sm font-semibold tracking-tight text-paper">
            S
          </span>
          <span className="font-display text-xl tracking-tight">Steora</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-ink-muted md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm text-ink-muted hover:text-ink">
            Login
          </Link>
          <Link
            href="/plan"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Start Planning
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md border border-line px-3 py-1.5 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-ink-muted hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link
              href="/plan"
              onClick={() => setOpen(false)}
              className="rounded-full bg-accent px-4 py-2 text-center text-white"
            >
              Start Planning
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
