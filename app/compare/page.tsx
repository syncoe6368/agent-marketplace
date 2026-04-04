import { Suspense } from 'react';
import ComparePageClient from './compare-client';

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ComparePageClient />
    </Suspense>
  );
}
