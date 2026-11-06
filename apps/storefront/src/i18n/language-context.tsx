"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { translate, LOCALE_COOKIE, type DictionaryKey, type Locale } from "@kmfoods/shared";

type LanguageContextValue = {
  locale: Locale;
  t: (key: DictionaryKey, params?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const setLocale = useCallback(
    (next: Locale) => {
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${
        60 * 60 * 24 * 365
      }; samesite=lax`;
      // A full reload is the reliable way to re-render the server layout with
      // the new lang/dir; router.refresh() can serve a cached layout.
      window.location.reload();
    },
    []
  );

  const t = useCallback(
    (key: DictionaryKey, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside a LanguageProvider");
  }
  return context;
}
