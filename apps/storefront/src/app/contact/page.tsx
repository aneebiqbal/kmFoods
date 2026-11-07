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
        <h1>{translate(locale, "contact.title")}</h1>
        <p className="lead mt-5">{translate(locale, "contact.subtitle")}</p>
      </div>

      <div className="mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
        <div className="well flex flex-col gap-4 p-7">
          <h2 className="text-title">{translate(locale, "contact.whatsapp")}</h2>
          <p className="text-sm leading-relaxed text-ink-2">
            {locale === "ur"
              ? "واٹس ایپ ہماری ترجیحی رابطہ کا ذریعہ ہے۔ اپنا آرڈر یا سوال اسی ایپ پر بھیجیں۔"
              : "WhatsApp is our preferred contact channel. Send your order or question there and our team will respond."}
          </p>
          <Link href="/cart" className="btn btn-primary mt-2 px-6 py-3 text-sm">
            {translate(locale, "common.whatsapp")}
          </Link>
        </div>

        <div className="well flex flex-col gap-4 p-7">
          <h2 className="text-title">
            {locale === "ur" ? "دیگر رابطے" : "Other channels"}
          </h2>
          <p className="text-sm leading-relaxed text-ink-2">
            {locale === "ur"
              ? "ای میل اور فون نمبر جلد ہی یہاں شائع کیے جائیں گے۔ اس وقت ہماری ٹیم واٹس ایپ پر جواب دیتی ہے۔"
              : "Email and phone details will be published here shortly. Until then our team answers on WhatsApp."}
          </p>
          <p className="mt-2 border border-gold bg-paper-2 px-4 py-3 text-xs text-ink">
            {locale === "ur"
              ? "رابطہ کا بلاک ایک placeholder نہیں ہے — جو معلومات دکھائی گئی ہیں وہ تصدیق شدہ ہیں۔"
              : "This contact block is not a placeholder form. Only confirmed details are shown."}
          </p>
        </div>
      </div>
    </Section>
  );
}
