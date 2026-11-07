import Link from "next/link";
import { translate } from "@kmfoods/shared";
import { getLocale } from "@/i18n/locale";
import { BrandLogo } from "@/components/brand-logo";

type Category = { id: string; name: string; handle: string };

/**
 * The final scene: a cardamom mast with the brand set large, the real links,
 * and one framed ingredient photograph.
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
    <footer className="band--ink mt-28">
      <div className="container py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="small text-saffron-2">{translate(locale, "common.tagline")}</p>
            <h2 className="display-section mt-6 text-5xl text-dusk-ink sm:text-6xl lg:text-7xl">
              {locale === "ur" ? "آپ کے باورچی خانے کا منظر" : "The pantry, composed."}
            </h2>
            <p className="lead mt-6 max-w-xl">{translate(locale, "footer.tagline")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cart" className="btn btn-primary px-6 py-3 text-sm">
                {translate(locale, "common.whatsapp")}
              </Link>
              <Link href="/shop" className="btn btn-on-dark px-6 py-3 text-sm">
                {translate(locale, "nav.shop")}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="photo aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element -- a verified local asset */}
              <img
                src="/assets/lib/gewuerze.jpg"
                alt="Cinnamon sticks, star anise and cloves"
                loading="lazy"
              />
              <span className="photo__caption">
                {locale === "ur" ? "دارچینی، بادیان، لونگ" : "Cinnamon, star anise, clove"}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <BrandLogo
                alt={translate(locale, "common.brand")}
                variant="light"
                className="h-9 w-auto"
              />
              <span className="small text-dusk-ink/60">Lahore, Pakistan</span>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-dusk-rule pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="small text-saffron-2">{group.title}</h3>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-dusk-ink/75 transition-colors hover:text-dusk-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="small text-saffron-2">{translate(locale, "nav.contact")}</h3>
            <p className="mt-5 text-sm leading-relaxed text-dusk-ink/70">
              {locale === "ur"
                ? "واٹس ایپ ہماری ترجیحی رابطہ کا ذریعہ ہے۔"
                : "WhatsApp is our preferred channel for orders and questions."}
            </p>
            <Link href="/contact" className="btn btn-on-dark mt-5 px-5 text-xs">
              {translate(locale, "contact.title")}
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-dusk-rule pt-6 text-xs text-dusk-ink/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {translate(locale, "footer.rights")} © {new Date().getFullYear()}{" "}
            {translate(locale, "common.brand")}.
          </p>
          <p>{translate(locale, "footer.draftNotice")}</p>
        </div>

        <p data-credits className="mt-6 text-xs text-dusk-ink/40">
          Photographs:{" "}
          <a
            className="link"
            href="https://commons.wikimedia.org/wiki/File:Bumbu_dan_Rempah_-_rempah.jpg"
          >
            Galeri ega
          </a>{" "}
          (CC BY-SA 4.0, Wikimedia Commons),{" "}
          <a className="link" href="https://commons.wikimedia.org/wiki/File:Dried_chillies_2.jpg">
            Richard Mortel
          </a>{" "}
          (CC BY 2.0, Wikimedia Commons),{" "}
          <a
            className="link"
            href="https://commons.wikimedia.org/wiki/File:Gewuerze_004_2024_08_10.jpg"
          >
            Friedrich Haag
          </a>{" "}
          (CC BY-SA 4.0, Wikimedia Commons).
        </p>
      </div>
    </footer>
  );
}
