export default function AgentDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content skeleton */}
        <div className="lg:col-span-2 space-y-6 animate-pulse">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-muted" />
            <div className="space-y-2 flex-1">
              <div className="h-7 w-48 bg-muted rounded" />
              <div className="h-5 w-24 bg-muted rounded" />
              <div className="flex gap-4">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>

          {/* Tags */}
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-muted rounded" />
            <div className="h-5 w-20 bg-muted rounded" />
            <div className="h-5 w-14 bg-muted rounded" />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-muted rounded-md" />
            <div className="h-10 w-24 bg-muted rounded-md" />
          </div>

          <div className="h-px bg-border" />

          {/* Reviews skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-24 bg-muted rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted" />
                  <div className="h-4 w-28 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-3/4 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-6 animate-pulse">
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="h-6 w-16 bg-muted rounded-md mx-auto" />
            <div className="h-px bg-border" />
            <div className="space-y-1 text-center">
              <div className="h-3 w-16 bg-muted rounded mx-auto" />
              <div className="h-4 w-24 bg-muted rounded mx-auto" />
            </div>
          </div>

          {/* Related agents skeleton */}
          <div className="space-y-3">
            <div className="h-5 w-28 bg-muted rounded" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-4 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
