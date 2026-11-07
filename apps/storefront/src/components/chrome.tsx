"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/language-context";
import { LOCALES, LOCALE_LABELS, type Locale } from "@kmfoods/shared";
import { BrandLogo } from "@/components/brand-logo";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchOverlay } from "@/components/search-overlay";

type Category = { id: string; name: string; handle: string };

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="flex items-center gap-0.5 border border-rule bg-paper-2 p-0.5"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code: Locale) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={`rounded-pill px-2.5 py-1 text-xs font-medium transition-colors duration-[220ms] ${
            locale === code ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper"
          }`}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.4A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}

export function Header({ categories }: { categories: Category[] }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const nav = [
    { key: "nav.shop" as const, href: "/shop" },
    { key: "nav.about" as const, href: "/about" },
    { key: "nav.contact" as const, href: "/contact" },
  ];

  const navLink = (item: { key: "nav.shop" | "nav.about" | "nav.contact"; href: string }) => {
    const active = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "true" : undefined}
        className={`tab ${active ? "text-ink" : "text-ink-2 hover:text-accent"}`}
      >
        {t(item.key)}
      </Link>
    );
  };

  return (
    <>
      <header
        className={`sticky top-0 z-sticky-nav border-b transition-[background-color,border-color] duration-[420ms] ${
          scrolled ? "border-rule bg-paper/95 backdrop-blur-sm" : "border-transparent bg-paper"
        }`}
      >
        <div className="container hidden grid-cols-[auto_1fr_auto] items-center gap-10 py-4 lg:grid">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label={`${t("common.brand")} — ${t("common.tagline")}`}
          >
            <BrandLogo alt={t("common.brand")} className="h-10 w-auto" />
          </Link>

          <nav className="flex items-center gap-7" aria-label="Main">
            {nav.map(navLink)}

            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoriesOpen((value) => !value)}
                aria-expanded={categoriesOpen}
                className={`tab ${categoriesOpen ? "text-ink" : "text-ink-2 hover:text-accent"}`}
              >
                {t("nav.categories")}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`transition-transform duration-[220ms] ${categoriesOpen ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {categoriesOpen && (
                <div className="absolute start-0 top-full z-dropdown w-72 pt-3">
                  <div className="well p-2">
                    <ul className="divide-y divide-rule">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/shop?category=${category.handle}`}
                            className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-ink-2 transition-colors hover:bg-paper hover:text-ink"
                          >
                            {category.name}
                            <span className="small">{category.handle}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="btn btn-ghost px-3.5 text-sm"
              aria-label={t("common.search")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <span className="hidden xl:inline">{t("common.search")}</span>
            </button>
            <LanguageSwitcher />
            <Link href="/contact" className="btn btn-ghost hidden px-3.5 text-sm lg:inline-flex">
              <WhatsAppIcon />
              <span className="hidden xl:inline">{t("contact.whatsapp")}</span>
            </Link>
            <CartDrawer />
          </div>
        </div>

        <div className="container flex items-center justify-between gap-2 py-3 lg:hidden">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label={`${t("common.brand")} — ${t("common.tagline")}`}
          >
            <BrandLogo alt={t("common.brand")} className="h-9 w-auto" />
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-pill border border-rule bg-paper-2 text-ink"
              aria-label={t("common.search")}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            <CartDrawer />
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-label={t("common.menu")}
              className="flex h-10 w-10 items-center justify-center rounded-pill border border-rule bg-paper-2 text-ink"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <>
                    <path d="M4 8h16" />
                    <path d="M4 16h10" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`grid border-t border-rule bg-paper transition-[grid-template-rows,opacity] duration-[420ms] lg:hidden ${
            menuOpen ? "[grid-template-rows:1fr] opacity-100" : "[grid-template-rows:0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
          <nav className="container space-y-1 py-4" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-base font-medium text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
              >
                {t(item.key)}
              </Link>
            ))}
            <p className="px-3 pb-1 pt-3 small">{t("nav.categories")}</p>
            <div className="grid grid-cols-2 gap-1.5 pb-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.handle}`}
                  onClick={() => setMenuOpen(false)}
                  className="whitespace-nowrap border border-rule bg-paper-2 px-2 py-2 text-xs text-ink-2 transition-colors hover:border-ink hover:text-ink"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between px-3 pt-2">
              <LanguageSwitcher />
            </div>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink"
            >
              <WhatsAppIcon />
              {t("contact.whatsapp")}
            </Link>
          </nav>
          </div>
        </div>
      </header>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        categories={categories}
      />
    </>
  );
}
