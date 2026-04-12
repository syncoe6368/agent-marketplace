/**
 * Sentry Error Tracking Integration for AgentHub
 *
 * Set NEXT_PUBLIC_SENTRY_DSN to enable.
 * If unset, all functions are no-ops (zero bundle impact).
 * @sentry/nextjs is optional — install it to enable tracking.
 *
 * Setup:
 *   1. npm install @sentry/nextjs
 *   2. Create project at sentry.io
 *   3. Copy DSN to NEXT_PUBLIC_SENTRY_DSN env var
 *   4. Deploy — errors auto-reported
 */

type SentryBreadcrumb = {
  category?: string;
  message?: string;
  level?: 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
};

type CaptureContext = {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  user?: { id: string; email?: string };
};

// Dynamic import reference (resolved at runtime only if package installed)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _sentry: any = null;
let _initAttempted = false;

async function getSentry() {
  if (_sentry) return _sentry;
  if (_initAttempted) return null;

  _initAttempted = true;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return null;

  try {
    _sentry = await import('@sentry/nextjs');
    _sentry.init({
      dsn,
      environment: process.env.NODE_ENV || 'development',
      release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || 'agenthub@dev',
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeSend(event: any) {
        // Scrub PII
        if (event.request?.headers) {
          delete event.request.headers['Authorization'];
          delete event.request.headers['Cookie'];
        }
        if (event.user) {
          delete event.user.ip_address;
          if (event.user.email) {
            event.user.email = event.user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
          }
        }
        return event;
      },
    });
    return _sentry;
  } catch {
    // @sentry/nextjs not installed — silent fallback
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Sentry] @sentry/nextjs not installed. Error tracking disabled.');
    }
    return null;
  }
}

/**
 * Capture an exception and send to Sentry.
 * Safe to call anywhere — no-ops if Sentry is not configured.
 */
export async function captureException(error: Error | unknown, context?: CaptureContext) {
  const sentry = await getSentry();
  if (!sentry) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[AgentHub Error]', error, context);
    }
    return;
  }

  sentry.captureException(error, {
    tags: context?.tags,
    extra: context?.extra,
    user: context?.user,
  });
}

/**
 * Capture a message (info/warning) to Sentry.
 */
export async function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: CaptureContext) {
  const sentry = await getSentry();
  if (!sentry) return;

  sentry.captureMessage(message, { level, tags: context?.tags, extra: context?.extra });
}

/**
 * Add a breadcrumb for error context tracing.
 */
export async function addBreadcrumb(breadcrumb: SentryBreadcrumb) {
  const sentry = await getSentry();
  if (!sentry) return;

  sentry.addBreadcrumb(breadcrumb);
}

/**
 * Set user context for error attribution.
 */
export async function setUser(user: { id: string; email?: string; username?: string } | null) {
  const sentry = await getSentry();
  if (!sentry) return;

  if (user) {
    sentry.setUser(user);
  } else {
    sentry.setUser(null);
  }
}

/**
 * Server-side API error logging helper.
 * Use in API routes: logApiError(request, error, { status: 500 })
 */
export function logApiError(
  request: { method?: string; nextUrl?: { pathname?: string } },
  error: unknown,
  context?: Record<string, unknown>
) {
  const method = request.method || 'UNKNOWN';
  const path = request.nextUrl?.pathname || '/unknown';
  const message = error instanceof Error ? error.message : String(error);

  captureException(error, {
    tags: {
      api_route: path,
      http_method: method,
    },
    extra: context,
  });

  // Also console.error for Vercel/Render logs
  console.error(`[API ${method} ${path}] ${message}`, context || '');
}
