import Link from "next/link";
import { translate } from "@kmfoods/shared";
import { getLocale } from "@/i18n/locale";
import { BrandLogo } from "@/components/brand-logo";

type Category = { id: string; name: string; handle: string };

/**
 * Signature footer: a dark atelier plate with an oversized wordmark, a single
 * ingredient motif, and tightly grouped navigation. Every policy link is
 * reachable from here.
 */
export default async function Footer({ categories }: { categories: Category[] }) {
  const locale = await getLocale();

  const groups = [
    {
      title: locale === "ur" ? "خریداری" : "Shop",
      links: [
        { label: locale === "ur" ? "مکمل کیٹلاگ" : "Full catalogue", href: "/shop" },
        ...categories.slice(0, 5).map((category) => ({
          label: category.name,
          href: `/shop?category=${category.handle}`,
        })),
      ],
    },
    {
      title: locale === "ur" ? "کمپنی" : "Company",
      links: [
        { label: translate(locale, "nav.about"), href: "/about" },
        { label: translate(locale, "nav.contact"), href: "/contact" },
        { label: translate(locale, "order.title"), href: "/order" },
      ],
    },
    {
      title: locale === "ur" ? "پالیسیاں" : "Policies",
      links: [
        { label: translate(locale, "nav.delivery"), href: "/delivery-policy" },
        { label: translate(locale, "nav.returns"), href: "/return-policy" },
        { label: translate(locale, "nav.privacy"), href: "/privacy-policy" },
        { label: translate(locale, "nav.terms"), href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="grain grain-dark relative mt-28 overflow-hidden bg-aubergine-900 text-bone-100">
      {/* Atmospheric ingredient glows */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-paprika-500/12 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 -right-32 h-[36rem] w-[36rem] rounded-full bg-saffron-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[90rem] px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        {/* Oversized wordmark plate */}
        <div className="flex flex-col gap-10 border-b border-bone-50/10 pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow eyebrow-on-dark">{translate(locale, "common.tagline")}</p>
            <h2 className="display-section mt-6 max-w-3xl text-4xl text-bone-50 sm:text-5xl lg:text-6xl">
              {locale === "ur"
                ? "آپ کے باورچی خانے کا منظر"
                : "The pantry, composed."}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-bone-100/70 sm:text-base">
              {translate(locale, "footer.tagline")}
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <BrandLogo
              alt={translate(locale, "common.brand")}
              variant="light"
              className="h-14 w-auto"
            />
            <Link href="/cart" className="btn btn-accent px-6 py-3 text-sm">
              {translate(locale, "common.whatsapp")}
              <span className="btn-icon" aria-hidden="true">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Link groups */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[0.625rem] font-semibold uppercase tracking-[0.26em] text-saffron-400">
                {group.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-bone-100/75 transition-colors hover:text-bone-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-[0.625rem] font-semibold uppercase tracking-[0.26em] text-saffron-400">
              {translate(locale, "nav.contact")}
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-bone-100/70">
              {locale === "ur"
                ? "واٹس ایپ ہماری ترجیحی رابطہ کا ذریعہ ہے۔"
                : "WhatsApp is our preferred channel for orders and questions."}
            </p>
            <Link
              href="/contact"
              className="btn btn-on-dark mt-5 px-5 py-2.5 text-xs"
            >
              {translate(locale, "contact.title")}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-bone-50/10 pt-7 text-xs text-bone-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {translate(locale, "footer.rights")} © {new Date().getFullYear()}{" "}
            {translate(locale, "common.brand")}.
          </p>
          <p>{translate(locale, "footer.draftNotice")}</p>
        </div>
      </div>
    </footer>
  );
}
