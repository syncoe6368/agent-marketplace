'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatPrice } from '@/lib/utils';
import { Eye, Edit, ExternalLink, Clock, CheckCircle2, XCircle, MessageSquare } from 'lucide-react';

interface DashboardContentProps {
  agents: {
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
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  pending: {
    label: 'Pending Review',
    icon: <Clock className="h-3.5 w-3.5" />,
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  active: {
    label: 'Active',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  suspended: {
    label: 'Suspended',
    icon: <XCircle className="h-3.5 w-3.5" />,
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
};

export function DashboardContent({ agents }: DashboardContentProps) {
  if (agents.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-lg text-muted-foreground mb-4">You haven&apos;t listed any agents yet</p>
          <Link href="/submit">
            <Button>List Your First Agent</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick nav */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard/reviews">
          <Button variant="outline" size="sm" className="gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            View Reviews
          </Button>
        </Link>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{agents.length}</p>
            <p className="text-sm text-muted-foreground">Total Agents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {agents.filter((a) => a.status === 'active').length}
            </p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {agents.reduce((sum, a) => sum + a.views_count, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {agents.filter((a) => a.status === 'pending').length}
            </p>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent list */}
      {agents.map((agent) => {
        const status = statusConfig[agent.status] || statusConfig.pending;
        return (
          <Card key={agent.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{agent.name}</h3>
                      <Badge variant="secondary" className={status.className}>
                        {status.icon}
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {agent.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {agent.category && <span>{agent.category.name}</span>}
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {agent.views_count} views
                      </span>
                      <span>{formatDate(agent.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/agents/${agent.slug}`}>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/agents/${agent.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
