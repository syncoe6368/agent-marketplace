import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Security headers applied to every response.
 * These protect against XSS, clickjacking, MIME sniffing, and more.
 */
function withSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking — only same-origin can iframe
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // Enable browser XSS filter (legacy but still useful)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy — only send origin to cross-origin
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy — deny features we don't use
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );

  // Content Security Policy — strict default, relaxed for dev
  const isDev = process.env.NODE_ENV === 'development';
  const csp = [
    // Default: only allow same-origin
    "default-src 'self'",
    // Scripts: self + Next.js inline (needs unsafe-eval in dev for HMR)
    isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'", // unsafe-inline needed for Next.js injected scripts
    // Styles: self + inline (Tailwind/Next.js needs inline)
    "style-src 'self' 'unsafe-inline'",
    // Images: self + data: (for OG images) + Supabase storage
    "img-src 'self' data: https://*.supabase.co",
    // Fonts: self + Google Fonts
    "font-src 'self' https://fonts.gstatic.com",
    // Connections: self + Supabase + Google Fonts
    `connect-src 'self' https://*.supabase.co ${isDev ? 'ws://localhost:*' : ''}`,
    // Frames: none (we don't use iframes)
    "frame-src 'none'",
    // Objects: none
    "object-src 'none'",
    // Base URI: self only
    "base-uri 'self'",
    // Form actions: self only
    "form-action 'self'",
    // Frame ancestors: same-origin only
    "frame-ancestors 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // HSTS — enforce HTTPS (only in production)
  if (!isDev) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  return response;
}

export async function middleware(request: NextRequest) {
  // Run Supabase session refresh first
  const response = await updateSession(request);

  // Apply security headers to the response
  return withSecurityHeaders(response);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
