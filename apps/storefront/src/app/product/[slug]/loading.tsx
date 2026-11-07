export default function ProductLoading() {
  return (
    <section className="container section">
      <div className="h-4 w-48 animate-pulse rounded bg-paper-3" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square animate-pulse border border-rule bg-paper-2" />
        <div className="space-y-5">
          <div className="h-12 w-3/4 animate-pulse rounded bg-paper-3" />
          <div className="h-5 w-1/3 animate-pulse rounded bg-paper-3" />
          <div className="flex gap-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-16 w-24 animate-pulse border border-rule bg-paper-2" />
            ))}
          </div>
          <div className="well space-y-4 p-5">
            <div className="h-5 w-24 animate-pulse rounded bg-paper-3" />
            <div className="h-11 w-full animate-pulse rounded-pill bg-paper-3" />
          </div>
        </div>
      </div>
    </section>
  );
}
