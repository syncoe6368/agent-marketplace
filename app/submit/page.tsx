import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SubmitAgentForm } from './submit-agent-form';

export const metadata: Metadata = {
  title: 'List Your Agent',
  description: 'Submit your AI agent to AgentHub and reach thousands of potential users.',
};

export default async function SubmitPage() {
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
  if (!user) redirect('/auth/login?redirect=/submit');

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  const categories = (categoriesData || []) as { id: string; name: string; slug: string }[];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">List Your Agent</h1>
        <p className="text-muted-foreground">
          Share your AI agent with the world. Fill in the details below and we&apos;ll review your submission.
        </p>
      </div>
      <SubmitAgentForm userId={user.id} categories={categories} />
    </div>
  );
}
