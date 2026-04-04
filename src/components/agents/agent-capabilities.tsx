import {
  Code, Search, Headphones, Zap, Shield, Globe,
  FileText, BarChart3, Bot, Brain, Wrench, MessageSquare,
  GitBranch, Database, Palette, TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AgentCapabilitiesProps {
  name: string;
  tags?: string[] | null;
  capabilities?: string[] | null;
}

// Map tag keywords to capability items with icons
const tagCapabilityMap: Record<string, { label: string; icon: React.ElementType; description: string }> = {
  'automation': { label: 'Workflow Automation', icon: Zap, description: 'Automate repetitive tasks and workflows' },
  'workflow': { label: 'Workflow Builder', icon: GitBranch, description: 'Visual workflow creation and management' },
  'productivity': { label: 'Productivity Boost', icon: TrendingUp, description: 'Increase team output and efficiency' },
  'research': { label: 'Deep Research', icon: Search, description: 'Comprehensive research and data gathering' },
  'analysis': { label: 'Data Analysis', icon: BarChart3, description: 'Analyze and interpret complex data' },
  'academic': { label: 'Academic Support', icon: FileText, description: 'Papers, citations, and scholarly work' },
  'reports': { label: 'Report Generation', icon: FileText, description: 'Auto-generate detailed reports' },
  'support': { label: 'Customer Support', icon: Headphones, description: '24/7 customer service automation' },
  'chatbot': { label: 'Conversational AI', icon: MessageSquare, description: 'Natural language conversations' },
  'customer-service': { label: 'Service Desk', icon: Headphones, description: 'Ticket handling and resolution' },
  'coding': { label: 'Code Generation', icon: Code, description: 'Write and generate code in 40+ languages' },
  'developer-tools': { label: 'Dev Tools Integration', icon: Wrench, description: 'Works with VS Code, JetBrains, etc.' },
  'code-review': { label: 'Code Review', icon: GitBranch, description: 'Automated code quality checks' },
  'marketing': { label: 'Marketing Automation', icon: TrendingUp, description: 'Campaign management and optimization' },
  'content': { label: 'Content Creation', icon: Palette, description: 'Generate blogs, social posts, and ads' },
  'seo': { label: 'SEO Optimization', icon: Search, description: 'Optimize content for search engines' },
  'social-media': { label: 'Social Media', icon: Globe, description: 'Manage and schedule social content' },
  'finance': { label: 'Financial Analysis', icon: BarChart3, description: 'Trading signals and budget insights' },
  'security': { label: 'Security Scanning', icon: Shield, description: 'Vulnerability detection and remediation' },
  'ai': { label: 'AI-Powered', icon: Brain, description: 'Advanced machine learning capabilities' },
  'integration': { label: 'API Integration', icon: Database, description: 'Connect with 50+ third-party services' },
  'multi-language': { label: 'Multi-Language', icon: Globe, description: 'Supports 40+ programming languages' },
};

// Fallback capabilities based on common agent types
const fallbackCapabilities = [
  { label: 'Natural Language Processing', icon: Brain, description: 'Understand and generate human language' },
  { label: 'Task Automation', icon: Bot, description: 'Automate complex multi-step tasks' },
  { label: 'API Integration', icon: Database, description: 'Connect with external services' },
];

export function AgentCapabilities({ name, tags, capabilities }: AgentCapabilitiesProps) {
  // Build capability list from tags
  const capabilityItems: { label: string; icon: React.ElementType; description: string }[] = [];

  if (tags && tags.length > 0) {
    for (const tag of tags) {
      const mapped = tagCapabilityMap[tag.toLowerCase()] || tagCapabilityMap[tag];
      if (mapped) {
        capabilityItems.push(mapped);
      }
    }
  }

  // If we have explicit capabilities, use them too
  if (capabilities && capabilities.length > 0) {
    for (const cap of capabilities) {
      if (!capabilityItems.find((c) => c.label === cap)) {
        capabilityItems.push({
          label: cap,
          icon: Bot,
          description: `${cap} capabilities for ${name}`,
        });
      }
    }
  }

  // Ensure at least some items
  if (capabilityItems.length === 0) {
    capabilityItems.push(...fallbackCapabilities);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-primary" />
          What {name} Can Do
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {capabilityItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="mt-0.5 rounded-md bg-primary/10 p-1.5">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
