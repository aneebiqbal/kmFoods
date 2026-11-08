export default function ProductLoading() {
  return (
    <section className="container section">
      <div className="h-4 w-48 animate-pulse rounded bg-paper-3" />
      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="aspect-[4/5] animate-pulse border border-rule bg-paper-2 lg:col-span-6" />
        <div className="lg:col-span-6">
          <div className="h-12 w-3/4 animate-pulse rounded bg-paper-3" />
          <div className="mt-5 h-5 w-1/3 animate-pulse rounded bg-paper-3" />
          <div className="mt-8 space-y-3 border-y border-rule py-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="h-3 w-24 animate-pulse rounded bg-paper-3" />
                <div className="h-4 w-16 animate-pulse rounded bg-paper-3" />
              </div>
            ))}
          </div>
          <div className="well mt-8 space-y-4 p-5">
            <div className="h-5 w-24 animate-pulse rounded bg-paper-3" />
            <div className="h-11 w-full animate-pulse rounded-pill bg-paper-3" />
          </div>
        </div>
      </div>
    </section>
  );
}
