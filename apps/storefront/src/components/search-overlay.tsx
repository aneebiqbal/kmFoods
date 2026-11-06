"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/language-context";
import { money, productTitle } from "@/lib/format";
import type { StoreProduct } from "@/lib/types";
import { ProductVisual } from "@/components/product-visual";
import { BodyPortal } from "@/components/body-portal";

type Category = { id: string; name: string; handle: string };

export function SearchOverlay({
  open,
  onClose,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  categories: Category[];
}) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setResults([]);
    setError(null);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const term = query.trim();

    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        const body = (await response.json()) as {
          results: StoreProduct[];
          error?: string;
        };
        setResults(body.results ?? []);
        setError(body.error ?? null);
      } catch {
        if (!controller.signal.aborted) {
          setError(t("common.error"));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, open, t]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <BodyPortal>
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-aubergine-900/55 px-4 pt-20 backdrop-blur-md sm:pt-28"
      role="dialog"
      aria-modal="true"
      aria-label={t("common.search")}
      onClick={onClose}
    >
      <div
        className="stage w-full max-w-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="core p-3 sm:p-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const term = query.trim();
              if (term) {
                onClose();
                router.push(`/shop?q=${encodeURIComponent(term)}`);
              }
            }}
          >
            <div className="flex items-center gap-3 border-b border-ink-900/10 pb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-paprika-600"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("common.searchPlaceholder")}
                className="w-full bg-transparent text-lg text-ink-900 outline-none placeholder:text-ink-500/70"
                aria-label={t("common.search")}
              />
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ink-500 transition-colors hover:text-ink-900"
              >
                {t("common.close")}
              </button>
            </div>
          </form>

          <div className="mt-4 min-h-40">
            {loading && (
              <ul className="space-y-2" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, index) => (
                  <li key={index} className="flex animate-pulse items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-bone-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 rounded bg-bone-200" />
                      <div className="h-3 w-1/3 rounded bg-bone-200" />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {!loading && query.trim().length < 2 && (
              <div className="py-6">
                <p className="text-[0.625rem] uppercase tracking-[0.22em] text-ink-500">
                  {t("nav.categories")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/shop?category=${category.handle}`}
                      onClick={onClose}
                      className="chip"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!loading && query.trim().length >= 2 && results.length === 0 && (
              <p className="py-8 text-center text-sm text-ink-500">
                {error ?? t("shop.empty")}
              </p>
            )}

            {!loading && results.length > 0 && (
              <ul className="divide-y divide-ink-900/6">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.handle}`}
                      onClick={onClose}
                      className="flex items-center gap-3 py-2.5 transition-colors hover:bg-bone-200/60"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
                        <ProductVisual
                          title={product.title}
                          titleUr={product.titleUr}
                          category={product.category}
                          locale={locale}
                          className="h-full w-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-900">
                          {productTitle(product.title, product.titleUr, locale)}
                        </p>
                        <p className="text-xs text-ink-500">
                          {product.variants.map((variant) => variant.title).join(" / ")}
                        </p>
                      </div>
                      <span className="price text-sm">
                        {product.minPrice !== null ? money(product.minPrice, locale) : "—"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
    </BodyPortal>
  );
}
