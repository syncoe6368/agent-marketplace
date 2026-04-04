import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FeedbackWidget } from '@/components/feedback-widget';
import { CompareTray } from '@/components/agents/compare-tray';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://agenthub.syncoe.com'),
  title: {
    default: 'AgentHub — Discover & Deploy AI Agents',
    template: '%s | AgentHub',
  },
  description: 'The #1 marketplace for AI agents. Browse, compare, and deploy verified AI agents for automation, research, customer support, and more.',
  keywords: ['AI agents', 'agent marketplace', 'artificial intelligence', 'automation', 'AI tools'],
  openGraph: {
    type: 'website',
    siteName: 'AgentHub',
    title: 'AgentHub — Discover & Deploy AI Agents',
    description: 'The #1 marketplace for AI agents. Browse, compare, and deploy verified AI agents.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <Analytics />
          <FeedbackWidget />
          <CompareTray />
          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'AgentHub',
                url: 'https://agenthub.syncoe.com',
                description: 'The #1 marketplace for AI agents. Browse, compare, and deploy verified AI agents.',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://agenthub.syncoe.com/agents?q={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'AgentHub',
                url: 'https://agenthub.syncoe.com',
                logo: 'https://agenthub.syncoe.com/favicon.png',
                sameAs: [
                  'https://github.com/syncoe6368/agent-marketplace',
                  'https://discord.com/invite/clawd',
                ],
              }),
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
