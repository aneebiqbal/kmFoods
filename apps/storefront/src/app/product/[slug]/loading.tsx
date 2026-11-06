export default function ProductLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="h-4 w-48 animate-pulse rounded bg-bone-200" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="shell">
          <div className="core aspect-square animate-pulse bg-bone-200" />
        </div>
        <div className="space-y-5">
          <div className="h-7 w-32 animate-pulse rounded-full bg-bone-200" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-bone-200" />
          <div className="h-5 w-1/3 animate-pulse rounded bg-bone-200" />
          <div className="flex gap-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-16 w-24 animate-pulse rounded-2xl bg-bone-200"
              />
            ))}
          </div>
          <div className="shell">
            <div className="core space-y-4 p-5">
              <div className="h-5 w-24 animate-pulse rounded-full bg-bone-200" />
              <div className="h-11 w-full animate-pulse rounded-full bg-paprika-600/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
