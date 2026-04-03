import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { AdminDashboardContent } from './admin-content';

export const metadata: Metadata = {
  title: 'Admin Dashboard — AgentHub',
  description: 'Moderate agent listings, manage users, and oversee the marketplace.',
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
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
  if (!user) redirect('/auth/login?redirect=/admin');

  // Check admin role from user metadata
  const isAdmin = user.user_metadata?.role === 'admin';
  if (!isAdmin) redirect('/dashboard');

  // Fetch all agents (including non-active) for moderation
  const { data: pendingAgents } = await supabase
    .from('agents')
    .select('*, category:categories(name, slug), creator:profiles(full_name, email:profiles!agents_creator_id_fkey(id))')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  const { data: activeAgents } = await supabase
    .from('agents')
    .select('id, name, status, views_count, is_featured, is_verified, created_at')
    .eq('status', 'active')
    .order('views_count', { ascending: false })
    .limit(10);

  const { data: suspendedAgents } = await supabase
    .from('agents')
    .select('id, name, status, created_at')
    .eq('status', 'suspended')
    .order('created_at', { ascending: false });

  // Stats
  const { count: totalAgents } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true });

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: totalReviews } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true });

  return (
    <AdminDashboardContent
      pendingAgents={pendingAgents || []}
      activeAgents={activeAgents || []}
      suspendedAgents={suspendedAgents || []}
      stats={{
        totalAgents: totalAgents || 0,
        totalUsers: totalUsers || 0,
        totalReviews: totalReviews || 0,
        pendingCount: (pendingAgents || []).length,
        activeCount: (activeAgents || []).length,
        suspendedCount: (suspendedAgents || []).length,
      }}
    />
  );
}
