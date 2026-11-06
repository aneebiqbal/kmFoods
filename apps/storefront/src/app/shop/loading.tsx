import { ProductSkeleton } from "@/components/ui";

export default function ShopLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="h-7 w-24 animate-pulse rounded-full bg-cream-200" />
      <div className="mt-4 h-10 w-40 animate-pulse rounded bg-cream-200" />
      <div className="mt-3 h-5 w-64 animate-pulse rounded bg-cream-200" />

      <div className="mt-10 space-y-4">
        <div className="h-11 w-full max-w-md animate-pulse rounded-full bg-cream-200" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-7 w-24 animate-pulse rounded-full bg-cream-200"
            />
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
