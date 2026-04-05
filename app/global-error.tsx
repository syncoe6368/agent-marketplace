'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background">
          <div className="space-y-6 max-w-md">
            <div className="relative">
              <span className="text-7xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                500
              </span>
            </div>

            <h1 className="text-2xl font-bold">Something Went Wrong</h1>
            <p className="text-muted-foreground">
              We hit an unexpected error. Our team has been notified. Please try again.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center h-10 px-6 rounded-md border text-sm font-medium hover:bg-muted transition-colors"
              >
                Go Home
              </a>
            </div>

            {error.digest && (
              <p className="text-xs text-muted-foreground pt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
