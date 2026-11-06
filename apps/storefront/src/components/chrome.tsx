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
      className="flex items-center gap-0.5 rounded-full border border-ink-900/10 bg-bone-50/70 p-0.5"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code: Locale) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold transition-colors duration-200 ${
            locale === code
              ? "bg-aubergine-700 text-bone-50"
              : "text-ink-500 hover:bg-bone-200"
          }`}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
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

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled
            ? "border-b border-ink-900/8 bg-bone-100/85 shadow-[0_12px_40px_-24px_rgb(28_19_12/0.5)] backdrop-blur-xl"
            : "border-b border-transparent bg-bone-100/40 backdrop-blur-sm"
        }`}
      >
        {/* Desktop: three zones — discovery | brand | actions */}
        <div className="mx-auto hidden max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center gap-8 px-8 py-4 lg:grid">
          <nav className="flex items-center gap-7" aria-label="Main">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`link-underline text-[0.8125rem] font-medium tracking-[0.02em] ${
                    active ? "text-paprika-600" : "text-ink-600 hover:text-ink-900"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}

            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoriesOpen((value) => !value)}
                aria-expanded={categoriesOpen}
                className={`flex items-center gap-1.5 text-[0.8125rem] font-medium tracking-[0.02em] transition-colors ${
                  categoriesOpen ? "text-paprika-600" : "text-ink-600 hover:text-ink-900"
                }`}
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
                  className={`transition-transform duration-300 ${categoriesOpen ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {categoriesOpen && (
                <div className="absolute start-0 top-full z-50 w-64 pt-3">
                  <div className="stage">
                    <div className="core p-2">
                      <ul className="divide-y divide-ink-900/5">
                        {categories.map((category) => (
                          <li key={category.id}>
                            <Link
                              href={`/shop?category=${category.handle}`}
                              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-700 transition-colors hover:bg-bone-200 hover:text-ink-900"
                            >
                              {category.name}
                              <span className="text-[0.625rem] uppercase tracking-[0.18em] text-ink-500">
                                {category.handle}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <Link
            href="/"
            className="flex flex-col items-center gap-1"
            aria-label={`${t("common.brand")} — ${t("common.tagline")}`}
          >
            <BrandLogo alt={t("common.brand")} className="h-10 w-auto" />
            <span className="text-[0.5625rem] uppercase tracking-[0.3em] text-paprika-600">
              {t("common.tagline")}
            </span>
          </Link>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="btn btn-ghost px-3.5 py-2 text-[0.8125rem]"
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
            <CartDrawer />
          </div>
        </div>

        {/* Mobile: brand left, actions right */}
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-2 px-4 py-3 lg:hidden">
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
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-bone-50/70 text-ink-700"
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
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-bone-50/70 text-ink-700"
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

        {/* Mobile menu */}
        <div
          className={`overflow-hidden border-t border-ink-900/8 bg-bone-100 transition-[max-height,opacity] duration-500 lg:hidden ${
            menuOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mx-auto max-w-[90rem] space-y-1 px-4 py-4" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-base font-medium text-ink-700 transition-colors hover:bg-bone-200"
              >
                {t(item.key)}
              </Link>
            ))}
            <p className="px-3 pb-1 pt-3 text-[0.625rem] uppercase tracking-[0.22em] text-ink-500">
              {t("nav.categories")}
            </p>
            <div className="grid grid-cols-2 gap-1.5 pb-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.handle}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-ink-900/8 bg-bone-50 px-3 py-2.5 text-sm text-ink-700 transition-colors hover:border-ink-900/20"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between px-3 pt-2">
              <LanguageSwitcher />
            </div>
          </nav>
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
