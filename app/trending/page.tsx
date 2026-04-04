import { Sparkles, Eye, Star } from 'lucide-react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const categoryGradients: Record<string, string> = {
  automation: 'from-amber-500 to-orange-500',
  'research-analysis': 'from-blue-500 to-cyan-500',
  'customer-support': 'from-emerald-500 to-teal-500',
  development: 'from-violet-500 to-purple-500',
  finance: 'from-sky-500 to-blue-500',
  marketing: 'from-rose-500 to-pink-500',
};

export const metadata = {
  title: 'Trending Agents',
  description: 'Most popular AI agents this week on AgentHub.',
};

export default async function TrendingPage() {
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

  const { data: agents, error } = await supabase
    .from('agents')
    .select('id, name, slug, description, pricing_model, price_amount, currency, views_count, weekly_views, tags, is_verified, created_at, category:categories(id, name, slug)')
    .eq('status', 'active')
    .order('weekly_views', { ascending: false })
    .limit(20);

  const allAgents = agents || [];

  function isLast7Days(dateStr: string): boolean {
    const d = new Date(dateStr);
    const now = new Date();
    return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-6 w-6 text-amber-500" />
          <h1 className="text-3xl font-bold">Trending This Week</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Most viewed agents in the last 7 days — see what the community is loving.
        </p>
      </div>

      {allAgents.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No trending agents yet.</p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allAgents.map((agent, i) => (
            <Link key={agent.id} href={`/agents/${agent.slug}`}>
              <Card className="group h-full hover:shadow-lg hover:border-primary/30 transition-all duration-200 relative overflow-hidden">
                {i < 3 && (
                  <div className="absolute top-0 right-0">
                    <div className={`text-white text-xs font-bold px-2 py-0.5 rounded-bl-lg ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-gray-400' : 'bg-amber-700'}`}>
                      #{i + 1}
                    </div>
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${categoryGradients[(agent.category as { slug?: string } | null)?.slug || ''] || 'from-primary to-primary/70'} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {(agent.category as { name?: string } | null)?.name || 'Uncategorized'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {agent.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {(agent.weekly_views || agent.views_count || 0)}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {agent.views_count > 100 && (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-[10px] px-1.5 py-0">
                          🔥 Hot
                        </Badge>
                      )}
                      {isLast7Days(agent.created_at) && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-[10px] px-1.5 py-0">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>

                  {(agent.tags?.length || 0) > 0 && (
                    <div className="flex gap-1 flex-wrap mt-3">
                      {agent.tags!.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
