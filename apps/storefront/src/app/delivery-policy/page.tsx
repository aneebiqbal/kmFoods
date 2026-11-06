import type { Metadata } from "next";
import { translate } from "@kmfoods/shared";
import { getLocale } from "@/i18n/locale";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = { title: "Delivery policy" };

export default async function DeliveryPolicyPage() {
  const locale = await getLocale();
  const ur = locale === "ur";

  return (
    <PolicyPage
      title={translate(locale, "nav.delivery")}
      intro={
        ur
          ? "فی الحال KM Foods لاہور میں ڈیلیوری کرتا ہے۔ ڈیلیوری چارجز آرڈر سے پہلے واٹس ایپ پر تصدیق ہوتے ہیں۔"
          : "KM Foods currently delivers within Lahore. Delivery charges are confirmed with you over WhatsApp before the order is finalised."
      }
      sections={[
        {
          heading: ur ? "ڈیلیوری علاقے" : "Delivery areas",
          body: ur
            ? "لاہور فی الحال ڈیلیوری کے لیے کھلا ہے۔ دیگر شہروں کے لیے واٹس ایپ پر پوچھ سکتے ہیں؛ ہمیں معلوم ہو جائے گا کہ آپ کے علاقے میں ڈیلیوری ممکن ہے یا نہیں۔"
            : "Lahore is currently open for delivery. For other cities, please ask on WhatsApp and we will confirm whether your area is serviceable.",
        },
        {
          heading: ur ? "ڈیلیوری چارجز" : "Delivery charges",
          body: ur
            ? "ڈیلیوری چارجز آرڈر کے وقت شامل نہیں کیے جاتے۔ ہماری ٹیم واٹس ایپ پر حتمی چارجز کی تصدیق کرتی ہے، اور آپ کی مرضی کے مطابق آرڈر حتمی ہوتا ہے۔"
            : "Delivery charges are not added at checkout. Our team confirms the final charge on WhatsApp and you decide whether to proceed.",
        },
        {
          heading: ur ? "ترسیل کا وقت" : "Delivery timing",
          body: ur
            ? "ترسیل کا وقت علاقے اور آرڈر کی حالت پر منحصر ہے۔ تصدیق کے وقت ہماری ٹیم تخمینی وقت بتائے گی۔"
            : "Delivery timing depends on your area and order volume. Our team will give you an estimate when confirming the order.",
        },
      ]}
    />
  );
}
