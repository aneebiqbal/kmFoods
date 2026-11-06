import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_LABELS, translate, type Category } from "@kmfoods/shared";
import {
  getDefaultRegion,
  getProductByHandle,
  getRelatedProducts,
} from "@/lib/products";
import { getLocale } from "@/i18n/locale";
import { brandWithLogo, priceWithCurrency } from "@/lib/structured-data";
import { ProductCard, ProductMedia } from "@/components/product-card";
import { ProductPurchase, StickyPurchaseBar } from "@/components/product-purchase";
import { CatalogueUnavailable, Reveal, Section } from "@/components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const region = await getDefaultRegion();
  if (!region) return { title: "Product not found" };
  const product = await getProductByHandle(slug, region.id);
  if (!product) return { title: "Product not found" };

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    title: product.title,
    description: product.description ?? undefined,
    alternates: { canonical: `${base}/product/${product.handle}` },
    openGraph: {
      title: product.title,
      description: product.description ?? undefined,
      type: "website",
      url: `${base}/product/${product.handle}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const region = await getDefaultRegion();

  if (!region) {
    return (
      <Section>
        <CatalogueUnavailable />
      </Section>
    );
  }

  const product = await getProductByHandle(slug, region.id);
  if (!product || product.status !== "published") notFound();

  const related = await getRelatedProducts(product, region.id);
  const labels = product.category
    ? CATEGORY_LABELS[product.category as Category]
    : null;

  const offer = product.minPrice
    ? {
        "@type": "Offer",
        price: product.minPrice,
        priceCurrency: "PKR",
        availability:
          product.variants.length > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: `/product/${product.handle}`,
      }
    : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? undefined,
    url: `/product/${product.handle}`,
    category: labels ? labels.en : undefined,
    brand: brandWithLogo(),
    ...(offer ? { offers: offer } : {}),
  };

  return (
    <Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="mb-8 text-xs text-ink-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-paprika-700">
          {translate(locale, "nav.home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-paprika-700">
          {translate(locale, "nav.shop")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-700">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="shell">
            <div className="core overflow-hidden">
              <ProductMedia
                product={product}
                locale={locale}
                className="aspect-square"
                variantLabel={product.variants
                  .map((variant) => variant.title)
                  .join(" / ")}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex flex-col gap-6">
            {labels && <span className="eyebrow">{labels[locale]}</span>}

            <div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                {locale === "ur" && product.titleUr
                  ? product.titleUr
                  : product.title}
              </h1>
              {product.titleUr && locale === "en" && (
                <p className="mt-2 text-lg text-ink-500">{product.titleUr}</p>
              )}
            </div>

            {product.variants.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="rounded-2xl border border-ink-900/10 bg-bone-100 px-4 py-3"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      {variant.title}
                    </p>
                    <p className="mt-1 font-semibold text-ink-900">
                      {variant.price === null
                        ? "—"
                        : priceWithCurrency(variant.price)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {product.description && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                  {translate(locale, "product.description")}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-600">
                  {product.description}
                </p>
              </div>
            )}

            <div className="shell">
              <div className="core p-5">
                <ProductPurchase product={product} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            {translate(locale, "product.related")}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item, index) => (
              <Reveal key={item.id} delay={index * 70}>
                <ProductCard product={item} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* Keeps the last section clear of the mobile purchase bar. */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
      <StickyPurchaseBar product={product} />
    </Section>
  );
}
