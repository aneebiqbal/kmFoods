import type { Metadata } from "next";
import { translate } from "@kmfoods/shared";
import { getLocale } from "@/i18n/locale";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = { title: "Privacy policy" };

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  const ur = locale === "ur";

  return (
    <PolicyPage
      title={translate(locale, "nav.privacy")}
      intro={
        ur
          ? "ہم آپ کی ذاتی معلومات کی حفاظت کو سنگینی دیتے ہیں۔ یہ مسودہ ابھی مراجعت میں ہے۔"
          : "We take the protection of your personal information seriously. This draft is still under review."
      }
      sections={[
        {
          heading: ur ? "کون سی معلومات جمع ہوتی ہے" : "What we collect",
          body: ur
            ? "آرڈر دیتے وقت ہم آپ کا نام، فون نمبر، شہر، علاقہ اور پتہ لیتے ہیں۔ یہ معلومات صرف آرڈر پورا کرنے کے لیے استعمال ہوتی ہیں۔"
            : "When you place an order we collect your name, phone number, city, area and address. This information is used only to fulfil your order.",
        },
        {
          heading: ur ? "معلومات کیسے استعمال ہوتی ہیں" : "How it is used",
          body: ur
            ? "آپ کی معلومات واٹس ایپ پر آرڈر کی تصدیق اور ڈیلیوری کے لیے ہماری ٹیم تک محدود رہتی ہے۔ ہم آپ کی ذاتی معلومات کو تیسرے فریق کو نہیں دیتے۔"
            : "Your information stays within our team for order confirmation and delivery over WhatsApp. We do not sell or share your personal information with third parties.",
        },
        {
          heading: ur ? "محفوظ رکھنا" : "Storage",
          body: ur
            ? "آپ کی معلومات محفوظ ڈیٹابیس میں محفوظ ہے اور اس تک رسائی صرف مجاز ٹیم ممبرز کو حاصل ہے۔"
            : "Your information is stored in a secured database, accessible only to authorised team members.",
        },
      ]}
    />
  );
}
