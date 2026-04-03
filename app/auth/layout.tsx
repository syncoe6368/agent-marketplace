import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — AgentHub',
  description: 'Sign in to your AgentHub account to manage your AI agent listings, leave reviews, and more.',
  robots: { index: false, follow: true },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
