import type { Metadata } from "next";
import { translate } from "@kmfoods/shared";
import { getLocale } from "@/i18n/locale";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = { title: "About KM Foods" };

export default async function AboutPage() {
  const locale = await getLocale();

  return (
    <PolicyPage
      title={translate(locale, "about.title")}
      intro={translate(locale, "about.body")}
      sections={[
        {
          heading:
            locale === "ur" ? "ہمارا مقام" : "Where we are based",
          body:
            locale === "ur"
              ? "کے ایم فوڈز لاہور میں قائم ہے اور فی الحال پورے لاہور میں ڈیلیوری کرتا ہے۔ مستقبل میں دیگر پاکستانی شہروں تک پہنچ بڑھانے کا ارادہ ہے۔"
              : "KM Foods is based in Lahore and currently delivers across the city. The aim is to extend to other Pakistani cities as the business grows.",
        },
        {
          heading: locale === "ur" ? "ہماری مصنوعات" : "What we sell",
          body:
            locale === "ur"
              ? "مصالحہ، خشک میوہ جات، مغزات، بیج اور روزمرہ کے کھانے کی ضروری چیزیں — ہر آئٹم کی قیمت 100 گرام اور 1 کلو پیک میں دی گئی ہے۔"
              : "Spices, dry fruits, nuts, seeds and everyday kitchen essentials. Every item is priced in 100g and 1kg packs, exactly as listed in our price list.",
        },
        {
          heading: locale === "ur" ? "آرڈر کیسے کریں" : "How ordering works",
          body:
            locale === "ur"
              ? "آپ آن لائن اپنی پسند کی چیزیں ٹوکری میں ڈال سکتے ہیں، پتا دے سکتے ہیں، اور واٹس ایپ پر آرڈر بھیج سکتے ہیں۔ ہماری ٹیم دستیابی اور ڈیلیوری چارجز کی تصدیق کرتی ہے، پھر آرڈر حتمی ہوتا ہے۔"
              : "You can add items to your cart, share your delivery details and send the order summary over WhatsApp. Our team confirms availability and the delivery charge before the order is final.",
        },
      ]}
    />
  );
}
