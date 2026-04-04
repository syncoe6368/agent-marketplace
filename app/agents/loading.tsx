export default function AgentsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-9 w-48 bg-muted rounded-md animate-pulse" />
        <div className="h-5 w-72 bg-muted rounded-md animate-pulse mt-3" />
      </div>

      {/* Search bar skeleton */}
      <div className="mb-6">
        <div className="h-12 w-full bg-muted rounded-lg animate-pulse" />
        <div className="flex gap-2 mt-3">
          <div className="h-8 w-24 bg-muted rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-muted rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-muted rounded-md animate-pulse" />
        </div>
      </div>

      {/* Agent cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 space-y-4 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
              </div>
              <div className="h-5 w-14 bg-muted rounded-md" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-3/4 bg-muted rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-3 w-12 bg-muted rounded" />
              <div className="flex gap-1">
                <div className="h-5 w-14 bg-muted rounded" />
                <div className="h-5 w-14 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
