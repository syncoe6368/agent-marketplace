import { AgentCard } from '@/components/agents/agent-card';
import { Flame } from 'lucide-react';

interface FeaturedAgent {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricing_model: string;
  price_amount: number | null;
  currency: string;
  logo_url?: string | null;
  tags?: string[] | null;
  is_featured?: boolean;
  is_verified?: boolean;
  average_rating?: number;
  review_count?: number;
  category?: { id: string; name: string; slug: string } | null;
}

interface FeaturedAgentsProps {
  agents: FeaturedAgent[];
}

export function FeaturedAgents({ agents }: FeaturedAgentsProps) {
  if (agents.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Flame className="h-5 w-5 text-orange-500" />
          <h2 className="text-2xl font-bold">Featured Agents</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </section>
  );
}
