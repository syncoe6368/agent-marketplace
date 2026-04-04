'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Star, MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  agent_id: string;
  agent_name: string;
  agent_slug: string;
  reviewer_name: string | null;
  reviewer_avatar: string | null;
}

interface AgentStat {
  name: string;
  slug: string;
  count: number;
  avg: number;
}

interface MyReviewsContentProps {
  reviews: ReviewRow[];
  agentStats: AgentStat[];
}

export function MyReviewsContent({ reviews, agentStats }: MyReviewsContentProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          My Agent Reviews
        </h1>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">← Back to Dashboard</Button>
        </Link>
      </div>

      {/* Per-agent summary cards */}
      {agentStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentStats.map((stat) => (
            <Card key={stat.slug}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      href={`/agents/${stat.slug}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {stat.name}
                    </Link>
                    <div className="flex items-center gap-1 mt-1">
                      <StarRating rating={stat.avg} />
                      <span className="text-sm text-muted-foreground ml-1">
                        {stat.avg.toFixed(1)} ({stat.count} review{stat.count !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>
                  <Link href={`/agents/${stat.slug}`}>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reviews list */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No reviews yet. Share your agents to start collecting feedback!
            </p>
          ) : (
            <div className="divide-y">
              {reviews.map((review) => (
                <div key={review.id} className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{review.reviewer_name}</span>
                        <Badge variant="outline" className="text-xs">
                          on <Link href={`/agents/${review.agent_slug}`} className="hover:text-primary">{review.agent_name}</Link>
                        </Badge>
                      </div>
                      <StarRating rating={review.rating} />
                      {review.comment && (
                        <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  );
}
