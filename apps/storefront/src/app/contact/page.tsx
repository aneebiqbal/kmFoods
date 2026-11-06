import type { Metadata } from "next";
import Link from "next/link";
import { translate } from "@kmfoods/shared";
import { getLocale } from "@/i18n/locale";
import { Section } from "@/components/ui";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const locale = await getLocale();

  return (
    <Section>
      <div className="max-w-3xl">
        <span className="eyebrow">{translate(locale, "common.tagline")}</span>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          {translate(locale, "contact.title")}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-earth-600">
          {translate(locale, "contact.subtitle")}
        </p>
      </div>

      <div className="mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
        <div className="shell">
          <div className="core flex flex-col gap-4 p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-600/10 text-leaf-600">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.4A8.5 8.5 0 1 1 21 11.5Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">
              {translate(locale, "contact.whatsapp")}
            </h2>
            <p className="text-sm leading-relaxed text-earth-600">
              {locale === "ur"
                ? "واٹس ایپ ہماری ترجیحی رابطہ کا ذریعہ ہے۔ اپنا آرڈر یا سوال اسی ایپ پر بھیجیں۔"
                : "WhatsApp is our preferred contact channel. Send your order or question there and our team will respond."}
            </p>
            <Link href="/cart" className="btn btn-primary mt-2 px-6 py-3 text-sm">
              {translate(locale, "common.whatsapp")}
            </Link>
          </div>
        </div>

        <div className="shell">
          <div className="core flex flex-col gap-4 p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-chili-600/10 text-chili-700">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 6h16v12H4z" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">
              {locale === "ur" ? "دیگر رابطے" : "Other channels"}
            </h2>
            <p className="text-sm leading-relaxed text-earth-600">
              {locale === "ur"
                ? "ای میل اور فون نمبر جلد ہی یہاں شائع کیے جائیں گے۔ اس وقت ہماری ٹیم واٹس ایپ پر جواب دیتی ہے۔"
                : "Email and phone details will be published here shortly. Until then our team answers on WhatsApp."}
            </p>
            <p className="mt-2 rounded-2xl border border-gold-400/40 bg-gold-400/10 px-4 py-3 text-xs text-earth-700">
              {locale === "ur"
                ? "رابطہ کا بلاک ایک .placeholder نہیں ہے — جو معلومات دکھائی گئی ہیں وہ تصدیق شدہ ہیں۔"
                : "This contact block is not a placeholder form — only confirmed details are shown."}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
