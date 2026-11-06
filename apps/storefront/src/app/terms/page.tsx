import type { Metadata } from "next";
import { translate } from "@kmfoods/shared";
import { getLocale } from "@/i18n/locale";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = { title: "Terms and conditions" };

export default async function TermsPage() {
  const locale = await getLocale();
  const ur = locale === "ur";

  return (
    <PolicyPage
      title={translate(locale, "nav.terms")}
      intro={
        ur
          ? "KM Foods کے ساتھ آرڈر دینے کی شرائط۔ یہ مسودہ ابھی مراجعت میں ہے۔"
          : "The terms that apply when you order from KM Foods. This draft is still under review."
      }
      sections={[
        {
          heading: ur ? "آرڈر کیسے" : "How an order works",
          body: ur
            ? "ٹوکری میں شامل کی گئی قیمتیں خودکار طور پر نہیں ہیں۔ ہماری ٹیم واٹس ایپ پر دستیابی اور ڈیلیوری چارجز کی تصدیق کرتی ہے، اور تب ہی آرڈر حتمی ہوتا ہے۔"
            : "Prices in the cart are indicative. Our team confirms availability and delivery charges on WhatsApp, and only then is an order final.",
        },
        {
          heading: ur ? "قیمتوں میں تبدیلی" : "Price changes",
          body: ur
            ? "ہماری قیمتوں میں مارکیٹ کے حالات کے مطابق تبدیلی آ سکتی ہے۔ تصدیق شدہ قیمت آرڈر کے وقت ہی حتمی ہوتی ہے۔"
            : "Our prices can change with market conditions. The confirmed price at the time of ordering is what applies.",
        },
        {
          heading: ur ? "ذمہ داری" : "Liability",
          body: ur
            ? "اگر آرڈر کے ساتھ کوئی مسئلہ پیش آئے، تو واٹس ایپ پر ہمیں فوراً اطلاع دیں تاکہ ہم جلد از جلد حل کر سکیں۔"
            : "If there is any issue with your order, tell us on WhatsApp as soon as possible so we can put it right.",
        },
      ]}
    />
  );
}
