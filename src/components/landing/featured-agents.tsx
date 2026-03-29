import { AgentCard } from '@/components/agents/agent-card';
import { Flame } from 'lucide-react';

interface FeaturedAgentsProps {
  agents: any[];
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
