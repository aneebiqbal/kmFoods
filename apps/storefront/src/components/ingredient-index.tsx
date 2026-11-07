"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORY_LABELS, type Category, type Locale } from "@kmfoods/shared";
import { categoryArt } from "@/lib/category-art";

/**
 * The Ingredient Index — the homepage signature.
 *
 * A numbered ledger of the real categories. Hovering or focusing a row reveals
 * that category's shelf in the panel beside it; the row itself carries the
 * destination. The first category is shown by default, so the panel is never
 * empty and the page works without the pointer.
 */
export function IngredientIndex({
  categories,
  counts,
  locale,
}: {
  categories: Array<{ id: string; name: string; handle: string }>;
  counts: Record<string, number>;
  locale: Locale;
}) {
  const [active, setActive] = useState<string>(categories[0]?.handle ?? "");

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <ol className="divide-y divide-rule border-y border-rule lg:col-span-7">
        {categories.map((category, index) => {
          const labels = CATEGORY_LABELS[category.handle as Category];
          const isActive = active === category.handle;
          return (
            <li key={category.id}>
              <Link
                href={`/shop?category=${category.handle}`}
                onMouseEnter={() => setActive(category.handle)}
                onFocus={() => setActive(category.handle)}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-baseline justify-between gap-4 py-4"
              >
                <span className="flex items-baseline gap-4">
                  <span className="numeral text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-title transition-colors duration-[220ms] ${
                      isActive ? "text-accent" : "text-ink group-hover:text-accent"
                    }`}
                  >
                    {labels ? labels[locale] : category.name}
                  </span>
                </span>
                <span className="small shrink-0">
                  {counts[category.handle] ?? 0} items
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="lg:col-span-5">
        <div className="photo aspect-[4/3]">
          {categories.map((category) => {
            const labels = CATEGORY_LABELS[category.handle as Category];
            const art = categoryArt(category.handle);
            const isActive = active === category.handle;
            const name = labels ? labels[locale] : category.name;
            const initial = name.trim().charAt(0);

            return art ? (
              /* eslint-disable-next-line @next/next/no-img-element -- a verified local asset */
              <img
                key={category.id}
                src={art}
                alt={name}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[500ms] ease-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : (
              <div
                key={category.id}
                className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-paper-2 transition-opacity duration-[500ms] ease-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden="true"
              >
                <span className="font-display text-7xl leading-none text-ink">
                  {initial}
                </span>
                <span className="text-xs text-muted">{name}</span>
              </div>
            );
          })}
        </div>
        <p className="small mt-3">
          {categories.find((category) => category.handle === active)?.name ?? ""}
        </p>
      </div>
    </div>
  );
}
