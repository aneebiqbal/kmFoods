export default function ShopLoading() {
  return (
    <section className="container section">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <div className="h-12 w-40 animate-pulse rounded bg-paper-3" />
          <div className="mt-4 h-5 w-64 animate-pulse rounded bg-paper-3" />
        </div>
        <div className="aspect-[4/3] animate-pulse border border-rule bg-paper-2 lg:col-span-5" />
      </div>

      <div className="mt-10 space-y-4">
        <div className="h-12 w-full max-w-md animate-pulse border border-rule bg-paper-2" />
      </div>

      <div className="mt-12">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 border-b border-rule py-4">
            <div className="h-4 w-8 animate-pulse rounded bg-paper-3" />
            <div className="h-16 w-16 animate-pulse border border-rule bg-paper-2 sm:h-20 sm:w-20" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 animate-pulse rounded bg-paper-3" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-paper-3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
