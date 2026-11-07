import { ProductSkeleton } from "@/components/ui";

export default function ShopLoading() {
  return (
    <section className="container section">
      <div className="h-10 w-40 animate-pulse rounded bg-paper-3" />
      <div className="mt-4 h-5 w-64 animate-pulse rounded bg-paper-3" />

      <div className="mt-10 space-y-4">
        <div className="h-12 w-full max-w-md animate-pulse border border-rule bg-paper-2" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-8 w-24 animate-pulse rounded-pill bg-paper-3" />
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
