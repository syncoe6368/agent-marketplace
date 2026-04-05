import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { DashboardContent } from './dashboard-content';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your AI agent listings on AgentHub.',
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(c) { try { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {} },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/dashboard');

  const { data: agentsData } = await supabase
    .from('agents')
    .select('*, category:categories(name)')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false });

  const agents = (agentsData || []) as {
    id: string;
    name: string;
    slug: string;
    description: string;
    pricing_model: string;
    price_amount: number | null;
    currency: string;
    status: string;
    views_count: number;
    created_at: string;
    website_url: string | null;
    category: { name: string } | null;
  }[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your agent listings</p>
        </div>
        <a href="/submit">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            + New Agent
          </button>
        </a>
      </div>
      <DashboardContent agents={agents} />
    </div>
  );
}
