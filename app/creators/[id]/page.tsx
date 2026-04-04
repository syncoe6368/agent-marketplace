import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AgentCard } from '@/components/agents/agent-card';
import { Star, Eye, Calendar, ArrowLeft, Globe, ExternalLink } from 'lucide-react';

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { /* ignore in server components */ }
        },
      },
    }
  );
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

interface AgentRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricing_model: string;
  price_amount: number | null;
  currency: string;
  logo_url: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_verified: boolean;
  status: string;
  views_count: number;
  created_at: string;
  category?: { id: string; name: string; slug: string } | null;
}

interface CreatorProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CreatorProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await getSupabase();

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, bio')
    .eq('id', id)
    .single();

  if (!data) return { title: 'Creator Not Found' };

  const name = data.full_name || 'Anonymous Creator';
  return {
    title: `${name} — AgentHub Creator`,
    description: data.bio || `View all agents by ${name} on AgentHub.`,
    openGraph: {
      title: `${name} — AgentHub Creator`,
      description: data.bio || `View all agents by ${name} on AgentHub.`,
    },
  };
}

export default async function CreatorProfilePage({ params }: CreatorProfilePageProps) {
  const { id } = await params;
  const supabase = await getSupabase();

  // Fetch creator profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  const profile = profileData as ProfileRow | null;
  if (!profile) notFound();

  // Fetch their agents
  const { data: agentsData } = await supabase
    .from('agents')
    .select(`
      id, name, slug, description, pricing_model, price_amount, currency,
      logo_url, tags, is_featured, is_verified, status, views_count, created_at,
      category:categories(id, name, slug)
    `)
    .eq('creator_id', id)
    .eq('status', 'active')
    .order('views_count', { ascending: false });

  const agents = (agentsData || []).map((a: Record<string, unknown>) => ({
    ...a,
    category: Array.isArray(a.category) ? a.category[0] || null : a.category,
  })) as AgentRow[];

  // Fetch review stats for all their agents in one query
  const agentIds = agents.map((a) => a.id);
  let avgRating = 0;
  let totalReviews = 0;
  let totalViews = agents.reduce((sum, a) => sum + (a.views_count || 0), 0);

  if (agentIds.length > 0) {
    const { data: reviewStats } = await supabase
      .from('reviews')
      .select('rating')
      .in('agent_id', agentIds);

    const reviews = reviewStats || [];
    totalReviews = reviews.length;
    avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  }

  const creatorName = profile.full_name || 'Anonymous Creator';
  const joinedDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Gradient colors for avatar (deterministic from ID)
  const gradients = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-indigo-500 to-blue-600',
  ];
  const gradientIndex = profile.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
  const avatarGradient = gradients[gradientIndex];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back link */}
      <Link href="/agents" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to agents
      </Link>

      {/* Profile header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={creatorName}
                className="w-20 h-20 rounded-2xl object-cover shrink-0"
              />
            ) : (
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-3xl shrink-0`}>
                {creatorName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h1 className="text-2xl font-bold">{creatorName}</h1>
              {profile.bio && (
                <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-6 pt-2">
                <div className="text-center">
                  <p className="text-2xl font-bold">{agents.length}</p>
                  <p className="text-xs text-muted-foreground">Agents</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <p className="text-2xl font-bold">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{totalReviews} reviews</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <p className="text-2xl font-bold">{totalViews > 0 ? (totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews) : '0'}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Total views</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{joinedDate}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                </div>
              </div>
            </div>

            {/* Badges */}
            {agents.some((a) => a.is_verified) && (
              <Badge className="bg-primary/10 text-primary border-primary/20 shrink-0">
                ✓ Verified Creator
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agents grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Agents by {creatorName}</h2>
        <p className="text-sm text-muted-foreground">
          {agents.length} {agents.length === 1 ? 'agent' : 'agents'} published
        </p>
      </div>

      {agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No agents yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This creator hasn&apos;t published any agents yet.
            </p>
            <Link href="/submit">
              <Button>
                Be the first
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
