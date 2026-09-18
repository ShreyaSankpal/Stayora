"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [notice, setNotice] = useState<string | null>(null);
  const isSignup = mode === "signup";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(
      "Auth UI only. Supabase Auth is not connected, so no account is created or signed in.",
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">Account</p>
      <h1 className="mt-3 font-display text-4xl">
        {isSignup ? "Create a Steora account" : "Welcome back"}
      </h1>
      <p className="mt-3 text-sm text-ink-muted">
        Forms are ready for email/password fields that Supabase Auth can later
        consume. Nothing is submitted to a backend.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-line bg-paper-raised p-6">
        {isSignup ? (
          <label className="block text-sm font-medium">
            Name
            <input
              name="name"
              autoComplete="name"
              required
              className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
            />
          </label>
        ) : null}
        <label className="block text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={8}
            className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
          />
        </label>
        {isSignup ? (
          <label className="block text-sm font-medium">
            Confirm password
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
            />
          </label>
        ) : null}
        {notice ? (
          <p className="text-sm text-ink-muted" role="status">
            {notice}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-full bg-accent py-3 text-sm font-medium text-white hover:bg-accent-hover"
        >
          {isSignup ? "Sign up" : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-ink-muted">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-ink underline">
              Log in
            </Link>
          </>
        ) : (
          <>
            Need an account?{" "}
            <Link href="/signup" className="text-ink underline">
              Sign up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
