'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  TrendingUp,
  Users,
  MessageSquare,
  Bot,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PendingAgent {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string | null;
  pricing_model: string;
  price_amount: number | null;
  currency: string;
  website_url: string | null;
  github_url: string | null;
  tags: string[] | null;
  created_at: string;
  category: { name: string; slug: string } | null;
  creator: { full_name: string | null } | null;
}

interface ActiveAgent {
  id: string;
  name: string;
  status: string;
  views_count: number;
  is_featured: boolean;
  is_verified: boolean;
  created_at: string;
}

interface SuspendedAgent {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

interface Stats {
  totalAgents: number;
  totalUsers: number;
  totalReviews: number;
  pendingCount: number;
  activeCount: number;
  suspendedCount: number;
}

interface AdminDashboardContentProps {
  pendingAgents: PendingAgent[];
  activeAgents: ActiveAgent[];
  suspendedAgents: SuspendedAgent[];
  stats: Stats;
}

export function AdminDashboardContent({
  pendingAgents,
  activeAgents,
  suspendedAgents,
  stats,
}: AdminDashboardContentProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pending, setPending] = useState(pendingAgents);

  async function handleAction(agentId: string, action: 'approve' | 'suspend' | 'feature' | 'unfeature' | 'verify' | 'unverify') {
    setActionLoading(agentId + action);
    try {
      const res = await fetch(`/api/admin/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, action }),
      });
      if (res.ok) {
        if (action === 'approve') {
          setPending((prev) => prev.filter((a) => a.id !== agentId));
        }
      }
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Moderate listings, manage marketplace</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">Admin</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={<Bot className="h-5 w-5 text-primary" />} label="Total Agents" value={stats.totalAgents} />
        <StatCard icon={<Users className="h-5 w-5 text-blue-500" />} label="Users" value={stats.totalUsers} />
        <StatCard icon={<MessageSquare className="h-5 w-5 text-green-500" />} label="Reviews" value={stats.totalReviews} />
        <StatCard icon={<Clock className="h-5 w-5 text-yellow-500" />} label="Pending" value={stats.pendingCount} highlight={stats.pendingCount > 0} />
        <StatCard icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />} label="Active" value={stats.activeCount} />
        <StatCard icon={<XCircle className="h-5 w-5 text-red-500" />} label="Suspended" value={stats.suspendedCount} />
      </div>

      {/* Pending Review Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Review Queue
            {stats.pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2">{stats.pendingCount}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No pending agents to review 🎉</p>
          ) : (
            <div className="space-y-4">
              {pending.map((agent) => (
                <PendingAgentCard
                  key={agent.id}
                  agent={agent}
                  onAction={handleAction}
                  isLoading={actionLoading === agent.id + 'approve' || actionLoading === agent.id + 'suspend'}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Active Agents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Top Active Agents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeAgents.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No active agents yet</p>
          ) : (
            <div className="divide-y">
              {activeAgents.map((agent, i) => (
                <div key={agent.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">#{i + 1}</span>
                    <span className="font-medium">{agent.name}</span>
                    <div className="flex gap-1">
                      {agent.is_featured && <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">Featured</Badge>}
                      {agent.is_verified && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">Verified</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{agent.views_count}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction(agent.id, agent.is_featured ? 'unfeature' : 'feature')}
                      disabled={actionLoading === agent.id + 'feature'}
                    >
                      <Star className={`h-4 w-4 ${agent.is_featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suspended Agents */}
      {suspendedAgents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Suspended Agents
              <Badge variant="destructive">{suspendedAgents.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {suspendedAgents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">Suspended {formatDate(agent.created_at)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(agent.id, 'approve')}
                    disabled={actionLoading === agent.id + 'approve'}
                  >
                    Reactivate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: number; highlight?: boolean }) {
  return (
    <Card className={highlight ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20' : ''}>
      <CardContent className="p-4 text-center">
        <div className="flex justify-center mb-1">{icon}</div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function PendingAgentCard({
  agent,
  onAction,
  isLoading,
}: {
  agent: PendingAgent;
  onAction: (id: string, action: 'approve' | 'suspend') => void;
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-l-4 border-l-yellow-400">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{agent.name}</h3>
              <Badge variant="secondary">{agent.pricing_model}</Badge>
              {agent.category && <Badge variant="outline">{agent.category.name}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{agent.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>By: {agent.creator?.full_name || 'Unknown'}</span>
              <span>Submitted: {formatDate(agent.created_at)}</span>
              {agent.tags && agent.tags.length > 0 && (
                <span>Tags: {agent.tags.join(', ')}</span>
              )}
            </div>
            {agent.website_url && (
              <a
                href={agent.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
              >
                <ExternalLink className="h-3 w-3" /> Visit website
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              size="sm"
              onClick={() => onAction(agent.id, 'approve')}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onAction(agent.id, 'suspend')}
              disabled={isLoading}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {expanded && agent.long_description && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{agent.long_description}</p>
            {agent.github_url && (
              <a href={agent.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                <ExternalLink className="h-3 w-3" /> GitHub
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
