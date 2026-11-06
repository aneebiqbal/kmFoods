import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { Section } from "@/components/ui";

export type PolicySection = {
  heading: string;
  body: string;
};

/**
 * Policy and content pages are drafts. The owner must review and approve them
 * before the site is launched; the footer says so on every page.
 */
export function PolicyPage({
  title,
  intro,
  sections,
  draft = true,
  children,
}: {
  title: string;
  intro?: string;
  sections: PolicySection[];
  draft?: boolean;
  children?: ReactNode;
}) {
  return (
    <Section>
      <div className="max-w-3xl">
        <BrandLogo alt="KM Foods" className="h-9 w-auto object-contain" />
        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 text-lg leading-relaxed text-ink-600">{intro}</p>
        )}
        {draft && (
          <p className="mt-6 rounded-2xl border border-saffron-400/40 bg-saffron-400/10 px-4 py-3 text-sm text-ink-700">
            Draft content — pending review and approval by the KM Foods owner.
          </p>
        )}
      </div>

      <div className="mt-12 max-w-3xl space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            <p className="mt-3 leading-relaxed text-ink-600">{section.body}</p>
          </section>
        ))}
      </div>

      {children}
    </Section>
  );
}
