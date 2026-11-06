import type { Metadata } from "next";
import { translate } from "@kmfoods/shared";
import { getLocale } from "@/i18n/locale";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = { title: "Return and refund policy" };

export default async function ReturnPolicyPage() {
  const locale = await getLocale();
  const ur = locale === "ur";

  return (
    <PolicyPage
      title={translate(locale, "nav.returns")}
      intro={
        ur
          ? "واپسی اور رقم کی واپسی کی حکمت عملی ابھی مرتب کی جا رہی ہے۔ درج ذیل مسودہ کا جائزہ مالک لیں گے۔"
          : "Our returns and refund policy is still being finalised. The draft below is awaiting review by the owner."
      }
      sections={[
        {
          heading: ur ? "فی الحال حالت" : "Current position",
          body: ur
            ? "چونکہ آرڈر واٹس ایپ پر تصدیق ہوتے ہیں، کسی آرڈر کو تسلیم کرنے سے پہلے دستیابی اور چارجز کی تصدیق ہو جاتی ہے۔ اگر کوئی آئٹم مسئلہ ہو، تو واٹس ایپ پر اطلاع دیں۔"
            : "Because orders are confirmed over WhatsApp, availability and charges are agreed before an order is accepted. If an item is faulty or incorrect, tell us on WhatsApp.",
        },
        {
          heading: ur ? "مرغی اور کھانے کی چیزیں" : "Food items",
          body: ur
            ? "کھانے سے متعلقہ مصنوعات کے  nature کی وجہ سے واپسی کا معاملہ الگ طریقے سے طے ہوگا۔ یہ تفصیل تصدیق کے وقت شامل کی جائے گی۔"
            : "Returns for food products will be handled differently given their nature. That detail will be added once confirmed.",
        },
      ]}
    />
  );
}
