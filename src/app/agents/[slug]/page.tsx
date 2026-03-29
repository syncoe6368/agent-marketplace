import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StarRating } from '@/components/agents/star-rating';
import { ReviewList } from '@/components/agents/review-list';
import { AgentCard } from '@/components/agents/agent-card';
import { formatDate, formatPrice } from '@/lib/utils';
import {
  ExternalLink, GitFork, Globe, BookOpen, Star, Eye,
  BadgeCheck, Tag, Calendar,
} from 'lucide-react';

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

interface AgentRow {
  id: string;
  creator_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  long_description: string | null;
  pricing_model: string;
  price_amount: number | null;
  currency: string;
  website_url: string | null;
  github_url: string | null;
  api_docs_url: string | null;
  logo_url: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_verified: boolean;
  status: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  category?: { id: string; name: string; slug: string; description: string | null; icon: string | null } | null;
  creator?: { id: string; full_name: string | null; avatar_url: string | null; bio: string | null } | null;
}

interface ReviewRow {
  id: string;
  agent_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: { id: string; full_name: string | null; avatar_url: string | null } | null;
}

interface AgentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AgentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await getSupabase();

  const { data } = await supabase
    .from('agents')
    .select('id, name, description, logo_url')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  const agent = data as AgentRow | null;

  if (!agent) return { title: 'Agent Not Found' };

  return {
    title: agent.name,
    description: agent.description,
    openGraph: {
      title: agent.name,
      description: agent.description,
      images: agent.logo_url ? [agent.logo_url] : [],
    },
  };
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { slug } = await params;
  const supabase = await getSupabase();

  // Fetch agent with full details
  const { data } = await supabase
    .from('agents')
    .select(`
      id, name, slug, description, long_description,
      pricing_model, price_amount, currency,
      website_url, github_url, api_docs_url, logo_url,
      tags, is_featured, is_verified, status, views_count,
      category_id, creator_id,
      created_at, updated_at,
      category:categories(id, name, slug, description, icon),
      creator:profiles(id, full_name, avatar_url, bio)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  const agent = data as AgentRow | null;
  if (!agent) notFound();

  // Increment views
  await supabase
    .from('agents')
    .update({ views_count: agent.views_count + 1 })
    .eq('id', agent.id);

  // Fetch reviews
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*, user:profiles(id, full_name, avatar_url)')
    .eq('agent_id', agent.id)
    .order('created_at', { ascending: false });

  const reviews = (reviewsData || []) as ReviewRow[];

  // Fetch related agents (same category)
  const { data: relatedData } = await supabase
    .from('agents')
    .select('*, category:categories(id, name, slug)')
    .eq('status', 'active')
    .neq('id', agent.id)
    .eq('category_id', agent.category_id)
    .order('views_count', { ascending: false })
    .limit(3);

  const relatedAgents = (relatedData || []) as AgentRow[];

  // Calculate average rating
  const ratings = reviews.map((r) => r.rating);
  const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  const pricingColors: Record<string, string> = {
    free: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    freemium: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    subscription: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
              {agent.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{agent.name}</h1>
                {agent.is_verified && (
                  <BadgeCheck className="h-5 w-5 text-indigo-600" />
                )}
              </div>
              {agent.category && (
                <Badge variant="outline">{agent.category.name}</Badge>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <StarRating rating={averageRating} size="sm" />
                  <span>({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {agent.views_count} views
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(agent.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {agent.long_description || agent.description}
            </p>
          </div>

          {/* Tags */}
          {agent.tags && agent.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {agent.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {agent.website_url && (
              <a href={agent.website_url} target="_blank" rel="noopener noreferrer">
                <Button>
                  <Globe className="mr-2 h-4 w-4" />
                  Visit Website
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </a>
            )}
            {agent.github_url && (
              <a href={agent.github_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <GitFork className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </a>
            )}
            {agent.api_docs_url && (
              <a href={agent.api_docs_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  API Docs
                </Button>
              </a>
            )}
          </div>

          <Separator />

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <ReviewList reviews={reviews} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <Badge className={pricingColors[agent.pricing_model] || ''}>
                  {agent.pricing_model === 'free' ? 'Free' : formatPrice(agent.price_amount, agent.currency)}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2 capitalize">
                  {agent.pricing_model}
                </p>
              </div>

              <Separator />

              {agent.creator && (
                <div className="text-center">
                  <p className="text-sm font-medium">Created by</p>
                  <p className="text-sm text-muted-foreground">{agent.creator.full_name || 'Anonymous'}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related agents */}
          {relatedAgents.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Related Agents</h3>
              <div className="space-y-3">
                {relatedAgents.map((relAgent) => (
                  <AgentCard key={relAgent.id} agent={relAgent} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
