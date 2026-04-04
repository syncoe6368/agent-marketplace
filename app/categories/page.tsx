import type { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CategoriesGrid } from '@/components/landing/categories-grid';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse AI agents by category. Find agents for automation, research, customer support, development, marketing, and finance.',
};

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  agents?: { count: number }[];
}

export default async function CategoriesPage() {
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

  const { data } = await supabase
    .from('categories')
    .select('*, agents(count)')
    .order('name');

  const categories = ((data || []) as CategoryRow[]).map((cat) => ({
    ...cat,
    agent_count: (cat.agents as unknown as { count: number }[])?.[0]?.count || 0,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">
          Find the right AI agent for your specific needs
        </p>
      </div>
      <CategoriesGrid categories={categories} />
    </div>
  );
}
