"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/i18n/language-context";

/**
 * Announcement bar. Copy comes from the translation dictionaries so it stays
 * localised; it makes no delivery promise beyond what the owner configures.
 */
export function AnnouncementBar() {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-leaf-700 text-cream-50">
      <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-center sm:px-6 lg:px-8">
        <p className="text-[11px] font-medium tracking-wide sm:text-xs">
          {t("announcement.text")}
        </p>
        <Link
          href="/delivery-policy"
          className="hidden text-[11px] font-semibold text-gold-400 underline-offset-2 hover:underline sm:inline sm:text-xs"
        >
          {t("announcement.link")}
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={t("common.close")}
          className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-cream-100/70 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
