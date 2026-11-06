import type { Metadata } from "next";
import {
  Fraunces,
  Plus_Jakarta_Sans,
  Noto_Nastaliq_Urdu,
  Noto_Naskh_Arabic,
} from "next/font/google";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, type Locale } from "@kmfoods/shared";
import { LanguageProvider } from "@/i18n/language-context";
import { siteMetadata } from "@/lib/seo";
import { organizationJsonLd } from "@/lib/structured-data";
import { Footer, Header } from "@/components/chrome";
import { AnnouncementBar } from "@/components/announcement-bar";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-nastaliq",
  display: "swap",
});
const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-naskh",
  display: "swap",
});

async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    ...siteMetadata(locale),
    alternates: { canonical: `${base}/` },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale} dir={locale === "ur" ? "rtl" : "ltr"}>
      <body
        className={`${fraunces.variable} ${jakarta.variable} ${nastaliq.variable} ${naskh.variable}`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <LanguageProvider locale={locale}>
          <div className="flex min-h-[100dvh] flex-col">
            <AnnouncementBar />
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
