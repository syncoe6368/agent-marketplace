export default function HomeLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-pulse">
            <div className="h-7 w-48 bg-muted rounded-full mx-auto" />
            <div className="space-y-3">
              <div className="h-12 w-80 bg-muted rounded mx-auto" />
              <div className="h-12 w-64 bg-muted rounded mx-auto" />
            </div>
            <div className="h-5 w-96 bg-muted rounded mx-auto" />
            <div className="flex gap-3 justify-center pt-4">
              <div className="h-11 w-36 bg-muted rounded-md" />
              <div className="h-11 w-36 bg-muted rounded-md" />
            </div>
            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="h-8 w-12 bg-muted rounded mx-auto" />
                <div className="h-3 w-16 bg-muted rounded mx-auto mt-1" />
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="h-8 w-12 bg-muted rounded mx-auto" />
                <div className="h-3 w-16 bg-muted rounded mx-auto mt-1" />
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="h-8 w-12 bg-muted rounded mx-auto" />
                <div className="h-3 w-16 bg-muted rounded mx-auto mt-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured agents skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="h-8 w-40 bg-muted rounded-md animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-5 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-muted rounded" />
                    <div className="h-3 w-16 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-3/4 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories skeleton */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 space-y-2 animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mx-auto" />
            <div className="h-4 w-72 bg-muted rounded mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-xl border bg-card animate-pulse">
                <div className="w-12 h-12 rounded-lg bg-muted" />
                <div className="h-4 w-16 bg-muted rounded" />
                <div className="h-3 w-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
