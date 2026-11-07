"use client";

import type { ReactNode } from "react";

/**
 * Content is visible by default; the theme keeps still, so this is a pass-through.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`container section ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({
  title,
  subtitle,
  align = "left",
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <h2>{title}</h2>
      {subtitle && <p className="lead mt-4">{subtitle}</p>}
    </div>
  );
}

export function CatalogueUnavailable({ message }: { message?: string }) {
  return (
    <div className="well px-8 py-16 text-center">
      <h2 className="text-title">The catalogue is unavailable right now</h2>
      <p className="lead mx-auto mt-4 max-w-md">
        {message ??
          "We could not reach the store backend. Nothing is wrong with your connection. Please try again in a moment."}
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="btn btn-primary mt-8 px-6 py-3 text-sm"
      >
        Retry
      </button>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="border border-rule bg-paper" aria-hidden="true">
      <div className="aspect-[4/3] animate-pulse bg-paper-2" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-paper-3" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-paper-3" />
        <div className="h-5 w-16 animate-pulse rounded bg-paper-3" />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="well flex flex-col items-center gap-4 px-6 py-16 text-center">
      <h3 className="text-title">{title}</h3>
      {body && <p className="lead max-w-md">{body}</p>}
      {action}
    </div>
  );
}
