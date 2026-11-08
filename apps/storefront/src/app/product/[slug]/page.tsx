import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_LABELS, translate, type Category, type Locale } from "@kmfoods/shared";
import {
  getDefaultRegion,
  getProductByHandle,
  getRelatedProducts,
} from "@/lib/products";
import { getLocale } from "@/i18n/locale";
import { brandWithLogo, priceWithCurrency } from "@/lib/structured-data";
import { ProductCard, ProductMedia } from "@/components/product-card";
import { ProductPurchase, StickyPurchaseBar } from "@/components/product-purchase";
import { CatalogueUnavailable, Section } from "@/components/ui";

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

/* ── Dossier facts ──────────────────────────────────────────────────────── */
function DossierFacts({
  locale,
  product,
  categoryLabel,
}: {
  locale: Locale;
  product: {
    variants: Array<{ id: string; title: string; price: number | null }>;
    srNo: number | null;
  };
  categoryLabel: string;
}) {
  const pack = product.variants.map((variant) => variant.title).join(" / ");

  return (
    <dl className="divide-y divide-rule border-y border-rule">
      <div className="flex items-baseline justify-between gap-4 py-3">
        <dt className="small">{translate(locale, "shop.category")}</dt>
        <dd className="text-sm text-ink">{categoryLabel}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 py-3">
        <dt className="small">{translate(locale, "product.packSize")}</dt>
        <dd className="text-sm text-ink">{pack || "—"}</dd>
      </div>
      {product.srNo !== null && (
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="small">{translate(locale, "order.reference")}</dt>
          <dd className="price text-sm">No. {String(product.srNo).padStart(3, "0")}</dd>
        </div>
      )}
      {product.variants.length > 0 && (
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="small">{translate(locale, "product.price")}</dt>
          <dd className="text-sm text-ink">
            {product.variants
              .filter((variant) => variant.price !== null)
              .map((variant) => `${variant.title} ${priceWithCurrency(variant.price ?? 0)}`)
              .join(", ")}
          </dd>
        </div>
      )}
    </dl>
  );
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
  const pack = product.variants.map((variant) => variant.title).join(" / ");

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
    <>
    <Section className="section--tight">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="mb-8 small" aria-label="Breadcrumb">
        <Link href="/" className="link">
          {translate(locale, "nav.home")}
        </Link>
        <span className="mx-2 text-muted">/</span>
        <Link href="/shop" className="link">
          {translate(locale, "nav.shop")}
        </Link>
        {labels && (
          <>
            <span className="mx-2 text-muted">/</span>
            <Link href={`/shop?category=${product.category}`} className="link">
              {labels[locale]}
            </Link>
          </>
        )}
        <span className="mx-2 text-muted">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <figure>
            <ProductMedia
              product={product}
              locale={locale}
              className="aspect-[4/5] lg:aspect-auto lg:h-[520px]"
              variantLabel={pack}
            />
            <figcaption className="small mt-3">{pack}</figcaption>
          </figure>
        </div>

        <div className="lg:col-span-6">
          <h1 className="display-section text-4xl sm:text-5xl">
            {locale === "ur" && product.titleUr ? product.titleUr : product.title}
          </h1>
          {product.titleUr && locale === "en" && (
            <p className="lead mt-2">{product.titleUr}</p>
          )}

          <div className="well mt-8 p-5">
            <ProductPurchase product={product} />
          </div>

          <div className="mt-8">
            <DossierFacts
              locale={locale}
              product={product}
              categoryLabel={labels ? labels[locale] : "—"}
            />
          </div>

          {product.description && (
            <div className="mt-8">
              <h2 className="label">{translate(locale, "product.description")}</h2>
              <p className="mt-3 leading-relaxed text-ink-2">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Keeps the last section clear of the mobile purchase bar. */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
      <StickyPurchaseBar product={product} />
    </Section>

    {related.length > 0 && (
      <Section className="pt-16">
        <h2 className="display-section">
          {translate(locale, "product.related")}
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} locale={locale} />
          ))}
        </div>
      </Section>
    )}
    </>
  );
}
