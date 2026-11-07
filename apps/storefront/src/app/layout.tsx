import type { Metadata } from "next";
import {
  Piazzolla,
  Archivo,
  Noto_Nastaliq_Urdu,
  Noto_Naskh_Arabic,
} from "next/font/google";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, type Locale } from "@kmfoods/shared";
import { LanguageProvider } from "@/i18n/language-context";
import { siteMetadata } from "@/lib/seo";
import { listCategories } from "@/lib/products";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Header } from "@/components/chrome";
import Footer from "@/components/footer";
import "./globals.css";

const piazzolla = Piazzolla({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-piazzolla",
  display: "swap",
});
const archivo = Archivo({
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  display: "swap",
});
const nastaliq = Noto_Nastaliq_Urdu({
  weight: ["400", "600"],
  subsets: ["arabic"],
  variable: "--font-nastaliq",
  display: "swap",
});
const naskh = Noto_Naskh_Arabic({
  weight: ["400", "500", "600"],
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
  let categories: Array<{ id: string; name: string; handle: string }> = [];

  try {
    categories = await listCategories();
  } catch {
    // The header renders without a category menu; the rest of the page works.
  }

  return (
    <html
      lang={locale}
      dir={locale === "ur" ? "rtl" : "ltr"}
      className={`${piazzolla.variable} ${archivo.variable} ${nastaliq.variable} ${naskh.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <LanguageProvider locale={locale}>
          <div className="flex min-h-[100dvh] flex-col">
            <AnnouncementBar />
            <Header categories={categories} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer categories={categories} />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
