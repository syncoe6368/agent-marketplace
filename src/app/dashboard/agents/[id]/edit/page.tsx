import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { EditAgentForm } from './edit-agent-form';

interface EditAgentPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Agent',
};

export default async function EditAgentPage({ params }: EditAgentPageProps) {
  const { id } = await params;
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
  if (!user) redirect('/auth/login');

  const { data: agentData } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .eq('creator_id', user.id)
    .single();

  if (!agentData) notFound();

  const agent = agentData as {
    id: string;
    name: string;
    description: string;
    long_description: string | null;
    category_id: string | null;
    pricing_model: string;
    price_amount: number | null;
    website_url: string | null;
    github_url: string | null;
    api_docs_url: string | null;
    tags: string[] | null;
  };

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  const categories = (categoriesData || []) as { id: string; name: string; slug: string }[];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Agent</h1>
        <p className="text-muted-foreground">Update your agent listing details</p>
      </div>
      <EditAgentForm agent={agent} categories={categories} />
    </div>
  );
}
