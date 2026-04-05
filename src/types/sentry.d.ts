/**
 * Type declarations for optional @sentry/nextjs dependency.
 * This allows the sentry module to compile without the package installed.
 * When @sentry/nextjs IS installed, its real types will override these.
 */
declare module '@sentry/nextjs' {
  export function init(options: Record<string, unknown>): void;
  export function captureException(error: unknown, context?: Record<string, unknown>): string;
  export function captureMessage(message: string, options?: Record<string, unknown>): string;
  export function addBreadcrumb(breadcrumb: Record<string, unknown>): void;
  export function setUser(user: Record<string, unknown> | null): void;
}
