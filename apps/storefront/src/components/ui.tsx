"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
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
    <section
      id={id}
      className={`mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function CatalogueUnavailable({ message }: { message?: string }) {
  return (
    <div className="stage">
      <div className="core grain relative overflow-hidden px-8 py-16 text-center">
        <span className="eyebrow mx-auto">KM Foods</span>
        <h2 className="mt-5 text-2xl font-semibold text-ink-900 sm:text-3xl">
          The catalogue is unavailable right now
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-600">
          {message ??
            "We could not reach the store backend. Nothing is wrong with your connection — please try again in a moment."}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-7 px-6 py-3 text-sm"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="shell" aria-hidden="true">
      <div className="core overflow-hidden">
        <div className="animate-pulse bg-bone-200 aspect-[4/3]" />
        <div className="space-y-3 p-5">
          <div className="h-4 w-20 animate-pulse rounded-full bg-bone-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-bone-200" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-bone-200" />
          <div className="h-5 w-16 animate-pulse rounded bg-bone-200" />
        </div>
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
    <div className="shell">
      <div className="core flex flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-paprika-600/10 text-paprika-700">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        {body && (
          <p className="max-w-md text-sm leading-relaxed text-ink-600">{body}</p>
        )}
        {action}
      </div>
    </div>
  );
}
