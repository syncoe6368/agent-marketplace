import { Key, Monitor, Globe, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AgentRequirementsProps {
  name: string;
  tags?: string[] | null;
  requirements?: string[] | null;
  platforms?: string[] | null;
}

// Map tags to plausible requirements
const tagRequirementMap: Record<string, string[]> = {
  'automation': ['API key for target services', 'Slack/GitHub workspace access'],
  'workflow': ['OAuth2 credentials for connected apps'],
  'coding': ['Node.js 18+ or Python 3.10+', 'Git installed', 'IDE with extension support'],
  'developer-tools': ['VS Code 1.80+ or JetBrains IDE', 'Git CLI'],
  'code-review': ['GitHub/GitLab repository access', 'CI/CD pipeline configured'],
  'research': ['OpenAI API key or Anthropic API key'],
  'analysis': ['Data source credentials'],
  'academic': ['University library access (optional)'],
  'support': ['Zendesk/Intercom account', 'Support team training data'],
  'chatbot': ['Website embedding permissions', 'Training data or FAQ documents'],
  'customer-service': ['CRM access (Salesforce, HubSpot, etc.)', 'Support ticket history'],
  'marketing': ['Social media API keys', 'Google Analytics access'],
  'content': ['Brand style guide', 'Target audience persona docs'],
  'seo': ['Google Search Console access', 'Ahrefs/SEMrush API key'],
  'social-media': ['Social media OAuth tokens', 'Content calendar'],
  'finance': ['Financial data API key', 'Brokerage account connection'],
  'security': ['Network access permissions', 'Security tool API keys'],
};

const defaultPlatforms = ['Web App', 'REST API', 'CLI'];

const tagPlatformMap: Record<string, string[]> = {
  'coding': ['VS Code Extension', 'JetBrains Plugin', 'CLI', 'Web App'],
  'developer-tools': ['VS Code', 'JetBrains', 'Neovim', 'CLI'],
  'code-review': ['GitHub App', 'GitLab Integration', 'CLI'],
  'automation': ['Web App', 'Slack Bot', 'Zapier', 'REST API'],
  'workflow': ['Web Dashboard', 'REST API', 'Slack Integration'],
  'support': ['Web Widget', 'Slack Integration', 'Zendesk App'],
  'chatbot': ['Web Widget', 'WhatsApp', 'Slack', 'Discord'],
  'customer-service': ['Web Widget', 'Zendesk', 'Intercom', 'Freshdesk'],
  'marketing': ['Web App', 'Chrome Extension', 'API'],
  'content': ['Web App', 'Google Docs Add-on', 'WordPress Plugin'],
  'social-media': ['Web Dashboard', 'Mobile App', 'Buffer Integration'],
  'research': ['Web App', 'API', 'CLI'],
  'analysis': ['Jupyter Notebook', 'Web App', 'API'],
};

export function AgentRequirements({ name, tags, requirements, platforms: propPlatforms }: AgentRequirementsProps) {
  // Build requirements list
  const reqs: string[] = [];
  if (requirements && requirements.length > 0) {
    reqs.push(...requirements);
  } else if (tags && tags.length > 0) {
    for (const tag of tags) {
      const mapped = tagRequirementMap[tag.toLowerCase()] || tagRequirementMap[tag];
      if (mapped) {
        for (const r of mapped) {
          if (!reqs.includes(r)) reqs.push(r);
        }
      }
    }
  }

  if (reqs.length === 0) {
    reqs.push('Modern web browser', 'Active internet connection');
  }

  // Build platforms list
  const platformList: string[] = [];
  if (propPlatforms && propPlatforms.length > 0) {
    platformList.push(...propPlatforms);
  } else if (tags && tags.length > 0) {
    for (const tag of tags) {
      const mapped = tagPlatformMap[tag.toLowerCase()] || tagPlatformMap[tag];
      if (mapped) {
        for (const p of mapped) {
          if (!platformList.includes(p)) platformList.push(p);
        }
      }
    }
  }

  if (platformList.length === 0) {
    platformList.push(...defaultPlatforms);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertCircle className="h-5 w-5 text-primary" />
          Requirements & Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* API Keys / Prerequisites */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Key className="h-4 w-4 text-amber-500" />
            Prerequisites
          </h4>
          <ul className="space-y-1.5">
            {reqs.map((req) => (
              <li key={req} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Compatible Platforms */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Monitor className="h-4 w-4 text-blue-500" />
            Compatible Platforms
          </h4>
          <div className="flex flex-wrap gap-2">
            {platformList.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
              >
                <Globe className="h-3 w-3" />
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Minimum Setup */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
            <AlertCircle className="h-4 w-4 text-green-500" />
            Minimum Setup
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Setup time: ~5 minutes</p>
            <p>• No credit card required for free tier</p>
            <p>• Works on desktop and mobile browsers</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
