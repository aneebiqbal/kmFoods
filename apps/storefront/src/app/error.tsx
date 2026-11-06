"use client";

import Link from "next/link";
import { useEffect } from "react";
import { translate, type DictionaryKey } from "@kmfoods/shared";

/**
 * Route-level error boundary. Shows a recoverable state instead of a blank
 * screen; `reset` re-renders the route segment.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <span className="font-display text-6xl font-semibold text-paprika-700">
        !
      </span>
      <h1 className="mt-4 text-3xl font-semibold text-ink-900">
        {translate("en", "common.error" as DictionaryKey)}
      </h1>
      <p className="mt-3 text-sm text-ink-600">
        {error.digest
          ? `Reference: ${error.digest}`
          : "The error has been logged. Nothing was charged."}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="btn btn-primary px-6 py-3 text-sm"
        >
          {translate("en", "common.retry" as DictionaryKey)}
        </button>
        <Link href="/shop" className="btn btn-ghost px-6 py-3 text-sm">
          {translate("en", "nav.shop" as DictionaryKey)}
        </Link>
      </div>
    </section>
  );
}
