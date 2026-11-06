"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/i18n/language-context";
import { LOCALES, LOCALE_LABELS, type Locale } from "@kmfoods/shared";
import { CartDrawer } from "@/components/cart-drawer";

const NAV_ITEMS: Array<{ key: "nav.home" | "nav.shop" | "nav.about" | "nav.contact"; href: string }> = [
  { key: "nav.home", href: "/" },
  { key: "nav.shop", href: "/shop" },
  { key: "nav.about", href: "/about" },
  { key: "nav.contact", href: "/contact" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-earth-900/10 bg-cream-50/60 p-0.5"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code: Locale) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-200 ${
            locale === code
              ? "bg-chili-600 text-cream-50"
              : "text-earth-600 hover:bg-cream-100"
          }`}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-earth-900/5 bg-cream-50/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex flex-col gap-1 leading-none"
          aria-label={`${t("common.brand")} — ${t("common.tagline")}`}
        >
          <BrandLogo alt={t("common.brand")} priority />
          <span className="hidden text-[10px] uppercase tracking-[0.22em] text-chili-700 sm:block">
            {t("common.tagline")}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`link-underline text-sm font-medium ${
                  active ? "text-chili-700" : "text-earth-600 hover:text-earth-900"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <CartDrawer />
          <button
            type="button"
            className="btn btn-ghost px-3 py-2 text-sm md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={t("common.menu")}
          >
            {t("common.menu")}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-earth-900/5 bg-cream-50 px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-earth-700"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="grain relative mt-24 overflow-hidden bg-leaf-700 py-16 text-cream-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <BrandLogo
            alt={t("common.brand")}
            className="h-12 w-auto rounded-lg object-contain"
          />
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-gold-400">
            {t("common.tagline")}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-cream-100/80">
            {t("footer.tagline")}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
            {t("footer.shop")}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-cream-50">
                {t("nav.shop")}
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-cream-50">
                {t("nav.cart")}
              </Link>
            </li>
            <li>
              <Link href="/order" className="hover:text-cream-50">
                {t("order.title")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
            {t("footer.company")}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-cream-50">
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-cream-50">
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
            {t("footer.policies")}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/delivery-policy" className="hover:text-cream-50">
                {t("nav.delivery")}
              </Link>
            </li>
            <li>
              <Link href="/return-policy" className="hover:text-cream-50">
                {t("nav.returns")}
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-cream-50">
                {t("nav.privacy")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-cream-50">
                {t("nav.terms")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-cream-50/10 px-4 pt-6 sm:px-6 lg:px-8">
        <p className="text-xs text-cream-100/60">
          {t("footer.rights")} © {new Date().getFullYear()} {t("common.brand")}.
        </p>
        <p className="mt-2 text-xs text-cream-100/50">{t("footer.draftNotice")}</p>
      </div>
    </footer>
  );
}
