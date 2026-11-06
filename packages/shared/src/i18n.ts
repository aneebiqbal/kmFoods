/**
 * UI dictionaries. Product names live in the catalog (metadata), not here —
 * adding a language means adding a dictionary entry set, not touching
 * components.
 */
export const LOCALES = ["en", "ur"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Cookie that remembers the customer's language choice. */
export const LOCALE_COOKIE = "km_locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ur: "اردو",
};

const en = {
  "common.brand": "KM Foods",
  "common.tagline": "Har Ghar Ka Zaiqa",
  "common.search": "Search",
  "common.searchPlaceholder": "Search spices, dry fruits, seeds...",
  "common.menu": "Menu",
  "common.close": "Close",
  "common.loading": "Loading...",
  "common.error": "Something went wrong. Please try again.",
  "common.back": "Back",
  "common.retry": "Retry",
  "common.language": "Language",
  "common.currency": "PKR",
  "common.viewAll": "View all",
  "common.whatsapp": "Order on WhatsApp",
  "common.whatsappCta": "Chat with us",
  "common.freeDelivery": "Lahore delivery",
  "announcement.text": "Now delivering across Lahore — order on WhatsApp, we confirm before anything is final.",
  "announcement.link": "Delivery details",

  "nav.home": "Home",
  "nav.shop": "Shop",
  "nav.categories": "Categories",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.cart": "Cart",
  "nav.delivery": "Delivery",
  "nav.returns": "Returns",
  "nav.privacy": "Privacy",
  "nav.terms": "Terms",

  "home.heroEyebrow": "Premium Pakistani kitchen essentials",
  "home.heroTitle": "Har Ghar Ka Zaiqa",
  "home.heroSubtitle":
    "Spices, dry fruits, seeds and everyday essentials — sourced with care, delivered across Lahore.",
  "home.heroCta": "Shop the catalogue",
  "home.heroSecondary": "Order on WhatsApp",
  "home.bestsellers": "Best sellers",
  "home.bestsellersSubtitle": "The products Lahore cooks reach for most.",
  "home.categories": "Shop by category",
  "home.categoriesSubtitle": "Everything for the Pakistani kitchen, in one place.",
  "home.essentials": "Kitchen essentials",
  "home.essentialsSubtitle":
    "Everyday ingredients for daal, sabzi, biryani and more.",
  "home.storyPoint1":
    "Sourced in Lahore, packed in 100g and 1kg so a single dish or a full month's kitchen both fit.",
  "home.storyPoint2":
    "Prices follow the printed price list — no rounding up, no hidden packing charges.",
  "home.storyPoint3":
    "Orders are confirmed by a person on WhatsApp before anything is final.",
  "home.steps1": "Add your items and share your delivery details.",
  "home.steps2": "Send the order summary to KM Foods on WhatsApp.",
  "home.steps3": "We confirm availability and the delivery charge.",
  "home.trustTitle": "Why KM Foods",
  "home.trustQuality": "Premium quality",
  "home.trustQualityBody": "Whole and ground spices selected for freshness and aroma.",
  "home.trustPricing": "Honest pricing",
  "home.trustPricingBody": "Transparent per-pack rates with no hidden charges.",
  "home.trustDelivery": "Lahore delivery",
  "home.trustDeliveryBody": "Local delivery with charges confirmed before you order.",
  "home.whatsappTitle": "Order in one message",
  "home.whatsappBody":
    "Add your items, share your address, and send us the order summary on WhatsApp. We confirm availability and delivery charges before anything is final.",
  "home.whatsappCta": "Start a WhatsApp order",

  "shop.title": "Shop",
  "shop.subtitle": "Browse the full KM Foods catalogue.",
  "shop.all": "All products",
  "shop.empty": "No products match your search.",
  "shop.emptyCta": "Clear filters",
  "shop.sortFeatured": "Featured",
  "shop.sortPriceAsc": "Price: low to high",
  "shop.sortPriceDesc": "Price: high to low",
  "shop.sortName": "Name A-Z",
  "shop.results": "{count} products",
  "shop.filters": "Filters",
  "shop.category": "Category",

  "product.addToCart": "Add to cart",
  "product.added": "Added to cart",
  "product.packSize": "Pack size",
  "product.quantity": "Quantity",
  "product.price": "Price",
  "product.addToCartFor": "Add {name} to cart",
  "home.navigatorEyebrow": "Browse by ingredient",
  "home.navigatorTitle": "The ingredient navigator",
  "home.navigatorSubtitle":
    "Start from what your dish needs. Every rail opens the real catalogue for that category.",
  "home.selectionEyebrow": "This week on the shelf",
  "home.selectionTitle": "The everyday selection",
  "home.selectionSubtitle":
    "The packs Lahore kitchens reach for most, in 100g and 1kg.",
  "home.storyEyebrow": "From the shelf",
  "home.storyTitle": "Two ingredients, two pack sizes",
  "home.storySubtitle":
    "Every product is sold in the pack sizes listed in our price list — no substitutions, no hidden weights.",
  "home.checkoutEyebrow": "One conversation",
  "home.stepsNote":
    "Opening WhatsApp does not confirm your order. We confirm availability and the delivery charge first.",
  "home.collectionsTitle": "Curated for the Lahore kitchen",
  "home.collectionsSubtitle":
    "Grouped by how you actually cook — everyday spices, seeds, dry fruits and the essentials that fill the gaps.",
  "product.view": "View product",
  "pantry.eyebrow": "Signature module",
  "pantry.title": "The Pantry Shelf",
  "pantry.subtitle":
    "Walk the shelves. Pick a pack size, tap once, and it is in your cart.",
  "pantry.hint": "Tap a pack size, then add",
  "pantry.items": "items",
  "pantry.viewAll": "Open the full catalogue",
  "pantry.note":
    "Prices are the current list prices in PKR. Delivery is confirmed on WhatsApp before anything is final.",
  "product.outOfStock": "Out of stock",
  "product.inStock": "In stock",
  "product.stockUnavailable": "Availability is unavailable right now.",
  "product.related": "You may also like",
  "product.description": "Description",
  "product.priceOnRequest": "Price on request",
  "product.draftNotice": "This product is not yet available to order online.",

  "cart.title": "Your cart",
  "cart.empty": "Your cart is empty.",
  "cart.emptyCta": "Browse the catalogue",
  "cart.subtotal": "Subtotal",
  "cart.delivery": "Delivery",
  "cart.deliveryNote": "Delivery charges are confirmed on WhatsApp before ordering.",
  "cart.total": "Total",
  "cart.checkout": "Proceed to checkout",
  "cart.continue": "Continue shopping",
  "cart.remove": "Remove",
  "cart.update": "Update",
  "cart.orderSummary": "Order summary",
  "cart.item": "Item",
  "cart.price": "Price",
  "cart.qty": "Qty",
  "cart.emptyCart": "Your cart is empty",

  "checkout.title": "Checkout",
  "checkout.subtitle": "Tell us where to deliver. Payment is confirmed on WhatsApp.",
  "checkout.name": "Full name",
  "checkout.phone": "Phone (e.g. 0321 1234567)",
  "checkout.city": "City",
  "checkout.area": "Area / locality",
  "checkout.address": "Complete address",
  "checkout.notes": "Delivery notes (optional)",
  "checkout.placeOrder": "Place order on WhatsApp",
  "checkout.placing": "Creating your order...",
  "checkout.areaNotServiceable": "We do not deliver to this area yet. Please contact us on WhatsApp.",
  "checkout.phoneInvalid": "Enter a valid Pakistani mobile number.",
  "checkout.required": "This field is required.",
  "checkout.review": "Review your order",
  "checkout.successTitle": "Order reference created",
  "checkout.successBody":
    "We have saved your order reference. Tap below to send the order summary to KM Foods on WhatsApp.",
  "checkout.sendWhatsapp": "Send order on WhatsApp",
  "checkout.backToShop": "Back to shop",
  "checkout.duplicate": "This order was already created. Check your WhatsApp to continue.",

  "order.title": "Order status",
  "order.notFound": "We could not find that order reference.",
  "order.reference": "Reference",
  "order.status": "Status",
  "order.pending": "Pending confirmation",
  "order.pendingBody":
    "Your order is waiting for KM Foods to confirm availability and delivery charges on WhatsApp.",
  "order.items": "Items",
  "order.subtotal": "Product subtotal",
  "order.contact": "Delivery details",

  "footer.tagline": "Har Ghar Ka Zaiqa — premium Pakistani spices and essentials.",
  "footer.shop": "Shop",
  "footer.company": "Company",
  "footer.policies": "Policies",
  "footer.contact": "Contact",
  "footer.rights": "All rights reserved.",
  "footer.draftNotice": "Policy content is a draft pending owner approval.",

  "contact.title": "Contact us",
  "contact.subtitle": "We are happy to help with orders and product questions.",
  "contact.whatsapp": "WhatsApp",
  "contact.name": "Name",
  "contact.email": "Email",
  "contact.message": "Message",
  "contact.send": "Send message",
  "contact.note": "Messages are handled by our team during business hours.",

  "about.title": "About KM Foods",
  "about.body": "KM Foods is a Lahore-based supplier of premium Pakistani spices, dry fruits, seeds and kitchen essentials.",
};

export type DictionaryKey = keyof typeof en;

export const dictionaries: Record<Locale, Record<DictionaryKey, string>> = {
  en,
  ur: {
    "common.brand": "کے ایم فوڈز",
    "common.tagline": "ہر گھر کا ذائقہ",
    "common.search": "تلاش",
    "common.searchPlaceholder": "مصالحہ، خشک میوہ جات، بیج تلاش کریں...",
    "common.menu": "مینو",
    "common.close": "بند کریں",
    "common.loading": "لوڈ ہو رہا ہے...",
    "common.error": "کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔",
    "common.back": "واپس",
    "common.retry": "دوبارہ کوشش",
    "common.language": "زبان",
    "common.currency": "روپے",
    "common.viewAll": "سب دیکھیں",
    "common.whatsapp": "واٹس ایپ پر آرڈر کریں",
    "common.whatsappCta": "ہم سے بات کریں",
    "common.freeDelivery": "لاہور ڈیلیوری",
    "announcement.text": "اب پورے لاہور میں ڈیلیوری — واٹس ایپ پر آرڈر کریں، ہم تصدیق کے بعد آرڈر حتمی ہوتا ہے۔",
    "announcement.link": "ڈیلیوری کی تفصیل",

    "nav.home": "ہوم",
    "nav.shop": "دکان",
    "nav.categories": "اقسام",
    "nav.about": "ہمارے بارے میں",
    "nav.contact": "رابطہ",
    "nav.cart": "ٹوکری",
    "nav.delivery": "ڈیلیوری",
    "nav.returns": "واپسی",
    "nav.privacy": "رازداری",
    "nav.terms": "شرائط",

    "home.heroEyebrow": "پاکستانی کچن کی اعلیٰ چیزیں",
    "home.heroTitle": "ہر گھر کا ذائقہ",
    "home.heroSubtitle":
      "مصالحہ، خشک میوہ جات، بیج اور روزمرہ کی ضروری چیزیں — پورے لاہور میں ڈیلیوری۔",
    "home.heroCta": "کیٹلاگ دیکھیں",
    "home.heroSecondary": "واٹس ایپ پر آرڈر کریں",
    "home.bestsellers": "بہترین مصنوعات",
    "home.bestsellersSubtitle": "وہ مصنوعات جنہیں لاہور کے باورچی خانے سب سے زیادہ استعمال کرتے ہیں۔",
    "home.categories": "قسم کے مطابق خریدیں",
    "home.categoriesSubtitle": "پاکستانی باورچی خانے کے لیے سب کچھ، ایک جگہ۔",
    "home.essentials": "باورچی خانے کی ضروری چیزیں",
    "home.essentialsSubtitle": "دال، سبزی، بریانی اور بہت کچھ کے لیے روزمرہ کی اجزاء۔",
    "home.trustTitle": "کیوں KM Foods",
    "home.storyPoint1":
      "لاہور سے تیار، 100 گرام اور 1 کلو پیک میں — ایک ہی ڈش ہو یا پورا مہینہ، سب کو سہولت۔",
    "home.storyPoint2":
      "قیمتیں پرنٹ شدہ لسٹ کے مطابق ہیں — کوئی اضافی پیکنگ چارجز نہیں۔",
    "home.storyPoint3":
      "آرڈر حتمی ہونے سے پہلے ہماری ٹیم واٹس ایپ پر تصدیق کرتی ہے۔",
    "home.steps1": "اپنی چیزیں شامل کریں اور ڈیلیوری کی تفصیل دیں۔",
    "home.steps2": "واٹس ایپ پر KM Foods کو آرڈر کا خلاصہ بھیجیں۔",
    "home.steps3": "ہم دستیابی اور ڈیلیوری چارجز کی تصدیق کرتے ہیں۔",
    "home.trustQuality": "اعلیٰ معیار",
    "home.trustQualityBody": "تازگی اور خوشبو کے لیے چنے ہوئے ثابت اور پسیدہ مصالحے۔",
    "home.trustPricing": "ایماندارانہ قیمتیں",
    "home.trustPricingBody": "ہر پیک کی واضح قیمت، کوئی پوشیدہ چارجز نہیں۔",
    "home.trustDelivery": "لاہور ڈیلیوری",
    "home.trustDeliveryBody": "آرڈر سے پہلے ڈیلیوری چارجز کی تصدیق۔",
    "home.whatsappTitle": "ایک پیغام میں آرڈر کریں",
    "home.whatsappBody":
      "اپنی چیزیں شامل کریں، اپنا پتہ شیئر کریں، اور واٹس ایپ پر آرڈر کا خلاصہ بھیجیں۔ تمام چیزوں کے ساتھ ہم تصدیق کرتے ہیں۔",
    "home.whatsappCta": "واٹس ایپ آرڈر شروع کریں",

    "shop.title": "دکان",
    "shop.subtitle": "مکمل KM Foods کیٹلاگ دیکھیں۔",
    "shop.all": "تمام مصنوعات",
    "shop.empty": "آپ کی تلاش سے کوئی مصنوعات نہیں ملیں۔",
    "shop.emptyCta": "فلٹر صاف کریں",
    "shop.sortFeatured": "نمایاں",
    "shop.sortPriceAsc": "قیمت: کم سے زیادہ",
    "shop.sortPriceDesc": "قیمت: زیادہ سے کم",
    "shop.sortName": "نام A-Z",
    "shop.results": "{count} مصنوعات",
    "shop.filters": "فلٹر",
    "shop.category": "قسم",

    "product.addToCart": "ٹوکری میں ڈالیں",
    "product.added": "ٹوکری میں شامل ہو گیا",
    "product.packSize": "پیک سائز",
    "product.quantity": "مقدار",
    "product.price": "قیمت",
    "product.addToCartFor": "{name} ٹوکری میں ڈالیں",
    "home.navigatorEyebrow": "اجزاء کے مطابق دیکھیں",
    "home.navigatorTitle": "اجزاء نیویگیٹر",
    "home.navigatorSubtitle":
      "جو چیز آپ کے ڈش کو چاہیے اس سے شروع کریں۔ ہر ریل اس قسم کا اصل کیٹلاگ کھولتی ہے۔",
    "home.selectionEyebrow": "اس ہفتے کی رف",
    "home.selectionTitle": "روزمرہ کا انتخاب",
    "home.selectionSubtitle":
      "وہ پیک جنہیں لاہور کے باورچی خانے سب سے زیادہ استعمال کرتے ہیں — 100 گرام اور 1 کلو میں۔",
    "home.storyEyebrow": "رف سے",
    "home.storyTitle": "دو اجزاء، دو پیک سائز",
    "home.storySubtitle":
      "ہر مصنوعہ ہماری قیمت کی لسٹ میں درج پیک سائز میں بیچی جاتی ہے — کوئی تبدیلی نہیں، کوئی پوشیدہ وزن نہیں۔",
    "home.checkoutEyebrow": "ایک گفتگو",
    "home.stepsNote":
      "واٹس ایپ کھولنا آرڈر کی تصدیق نہیں ہے۔ ہم پہلے دستیابی اور ڈیلیوری چارجز کی تصدیق کرتے ہیں۔",
    "home.collectionsTitle": "لاہور کے باورچی خانے کے لیے",
    "home.collectionsSubtitle":
      "جس طرح آپ کھانا پکاتے ہیں اسی کے مطابق گروہ — روزمرہ مصالحے، بیج، خشک میوہ جات اور ضروری چیزیں۔",
    "product.view": "مصنوعہ دیکھیں",
    "pantry.eyebrow": "نمایاں ماڈیول",
    "pantry.title": "پینٹری شیلف",
    "pantry.subtitle":
      "رفلیں گہومتے ہیں۔ پیک سائز چنیں، ایک بار ٹیپ کریں، اور یہ آپ کی ٹوکری میں۔",
    "pantry.hint": "پہلے پیک سائز چنیں، پھر شامل کریں",
    "pantry.items": "آئٹمز",
    "pantry.viewAll": "مکمل کیٹلاگ کھولیں",
    "pantry.note":
      "قیمتیں PKR میں موجودہ لسٹ کی قیمتیں ہیں۔ ڈیلیوری کی تصدیق واٹس ایپ پر ہوتی ہے۔",
    "product.outOfStock": "دستیاب نہیں",
    "product.inStock": "دستیاب ہے",
    "product.stockUnavailable": "فی الحال دستیابی کی معلومات نہیں ہیں۔",
    "product.related": "آپ کو یہ بھی پسند آ سکتے ہیں",
    "product.description": "تفصیل",
    "product.priceOnRequest": "قیمت کے لیے درخواست کریں",
    "product.draftNotice": "یہ مصنوعہ ابھی آن لائن آرڈر کے لیے دستیاب نہیں ہے۔",

    "cart.title": "آپ کی ٹوکری",
    "cart.empty": "آپ کی ٹوکری خالی ہے۔",
    "cart.emptyCta": "کیٹلاگ دیکھیں",
    "cart.subtotal": "ذیلی کل",
    "cart.delivery": "ڈیلیوری",
    "cart.deliveryNote": "ڈیلیوری چارجز آرڈر سے پہلے واٹس ایپ پر تصدیق ہوتے ہیں۔",
    "cart.total": "کل",
    "cart.checkout": "چیک آؤٹ پر جائیں",
    "cart.continue": "خریداری جاری رکھیں",
    "cart.remove": "ہٹائیں",
    "cart.update": "اپ ڈیٹ",
    "cart.orderSummary": "آرڈر کا خلاصہ",
    "cart.item": "آئٹم",
    "cart.price": "قیمت",
    "cart.qty": "تعداد",
    "cart.emptyCart": "آپ کی ٹوکری خالی ہے",

    "checkout.title": "چیک آؤٹ",
    "checkout.subtitle": "ہمیں بتائیں کہ کہاں ڈیلیوری کرنی ہے۔ ادائیگی واٹس ایپ پر تصدیق ہوتی ہے۔",
    "checkout.name": "پورا نام",
    "checkout.phone": "فون (مثلاً 0321 1234567)",
    "checkout.city": "شہر",
    "checkout.area": "علاقہ / محلہ",
    "checkout.address": "مکمل پتہ",
    "checkout.notes": "ڈیلیوری نوٹس (اختیاری)",
    "checkout.placeOrder": "واٹس ایپ پر آرڈر کریں",
    "checkout.placing": "آپ کا آرڈر بن رہا ہے...",
    "checkout.areaNotServiceable": "ہم ابھی اس علاقے میں ڈیلیوری نہیں کرتے۔ براہ کرم واٹس ایپ پر رابطہ کریں۔",
    "checkout.phoneInvalid": "درست پاکستانی موبائل نمبر درج کریں۔",
    "checkout.required": "یہ فیلڈ ضروری ہے۔",
    "checkout.review": "اپنے آرڈر کا جائزہ لیں",
    "checkout.successTitle": "آرڈر ریفرنس بن گیا",
    "checkout.successBody":
      "ہم نے آپ کا آرڈر ریفرنس محفوظ کر لیا ہے۔ واٹس ایپ پر KM Foods کو آرڈر کا خلاصہ بھیجنے کے لیے نیچے دبائیں۔",
    "checkout.sendWhatsapp": "واٹس ایپ پر آرڈر بھیجیں",
    "checkout.backToShop": "دکان پر واپس",
    "checkout.duplicate": "یہ آرڈر پہلے ہی بنا ہے۔ جاری رکھنے کے لیے اپنا واٹس ایپ چیک کریں۔",

    "order.title": "آرڈر کی حیثیت",
    "order.notFound": "ہمیں وہ آرڈر ریفرنس نہیں ملا۔",
    "order.reference": "ریفرنس",
    "order.status": "حیثیت",
    "order.pending": "تصدیق کے لیے زیر الانتظار",
    "order.pendingBody":
      "آپ کا آرڈر KM Foods کی جانب سے واٹس ایپ پر دستیابی اور ڈیلیوری چارجز کی تصدیق کے لیے زیر الانتظار ہے۔",
    "order.items": "آئٹمز",
    "order.subtotal": "مصنوعات کا ذیلی کل",
    "order.contact": "ڈیلیوری کی تفصیلات",

    "footer.tagline": "ہر گھر کا ذائقہ — پاکستانی مصالحہ جات اور ضروری چیزیں۔",
    "footer.shop": "دکان",
    "footer.company": "کمپنی",
    "footer.policies": "پالیسیاں",
    "footer.contact": "رابطہ",
    "footer.rights": "جملہ حقوق محفوظ ہیں۔",
    "footer.draftNotice": "پالیسی کا مواد مالک کی منظوری کے لیے ڈرافٹ ہے۔",

    "contact.title": "ہم سے رابطہ کریں",
    "contact.subtitle": "آرڈر اور مصنوعات کے سوالات میں ہمیں خوشی ہوگی۔",
    "contact.whatsapp": "واٹس ایپ",
    "contact.name": "نام",
    "contact.email": "ای میل",
    "contact.message": "پیغام",
    "contact.send": "پیغام بھیجیں",
    "contact.note": "پیغامات ہماری ٹیم کے ذریعے کاروباری اوقات میں چلائے جاتے ہیں۔",

    "about.title": "KM Foods کے بارے میں",
    "about.body": "KM Foods لاہور میں قائم پاکستانی مصالحہ جات، خشک میوہ جات، بیج اور باورچی خانے کی ضروری چیزوں کا سپلائر ہے۔",
  },
};

/** Returns the translated string, falling back to English then the key. */
export function translate(
  locale: Locale,
  key: DictionaryKey,
  params?: Record<string, string | number>,
): string {
  const template = dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

export type { DictionaryKey as I18nKey };
