import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation — AgentHub',
  description: 'REST API reference for AgentHub. Browse agents, skill packages, stats, and embed widgets programmatically.',
  openGraph: {
    title: 'API Documentation — AgentHub',
    description: 'REST API reference for AgentHub. Browse agents, skill packages, stats, and embed widgets programmatically.',
    type: 'article',
  },
};

const BASE_URL = 'https://agenthub.syncoe.com';

interface Endpoint {
  method: string;
  path: string;
  description: string;
  params?: string;
  response?: string;
}

const endpoints: { group: string; icon: string; items: Endpoint[] }[] = [
  {
    group: 'Agents',
    icon: '🤖',
    items: [
      {
        method: 'GET',
        path: '/api/agents',
        description: 'List and search agents with filtering, sorting, and pagination.',
        params: '?q=<search>&category=<slug>&pricingModel=free|paid|freemium|subscription&featured=true&sort=newest|popular|top_rated&limit=20&offset=0',
        response: '{ "agents": [...], "total": 22, "limit": 20, "offset": 0 }',
      },
      {
        method: 'GET',
        path: '/api/agents/[id]',
        description: 'Get full details for a single agent including reviews and creator info.',
        params: 'Path param: id (uuid)',
      },
    ],
  },
  {
    group: 'Skill Packages',
    icon: '📦',
    items: [
      {
        method: 'GET',
        path: '/api/skills',
        description: 'List all skill packages with filtering by category, tag, pricing model, and search.',
        params: '?category=<name>&tag=<tag>&model=free|paid|freemium|subscription&search=<query>&sort=name|category|pricingModel&order=asc|desc',
        response: '{ "skills": [...], "total": 5, "filters": { ... } }',
      },
      {
        method: 'GET',
        path: '/api/skills/[slug]',
        description: 'Get skill package manifest, features, and documentation.',
        params: 'Path param: slug (string)',
      },
      {
        method: 'GET',
        path: '/api/skills/[slug]/download',
        description: 'Download an individual file from a skill package (whitelist-secured).',
        params: '?file=SKILL.md (or any file in the package)',
      },
      {
        method: 'GET',
        path: '/api/skills/[slug]/install',
        description: 'Get installation instructions or a shell script to install the skill.',
        params: '?format=sh (returns executable shell script)',
      },
    ],
  },
  {
    group: 'Categories & Stats',
    icon: '📊',
    items: [
      {
        method: 'GET',
        path: '/api/categories',
        description: 'List all categories with agent counts.',
        response: '{ "categories": [...], "total": 6 }',
      },
      {
        method: 'GET',
        path: '/api/stats',
        description: 'Live marketplace statistics (cached 60s). Total agents, reviews, breakdown by pricing model.',
        response: '{ "status": "ok", "total_agents": 22, "free_agents": 14, ... }',
      },
    ],
  },
  {
    group: 'Embed & Widgets',
    icon: '🏷️',
    items: [
      {
        method: 'GET',
        path: '/api/embed',
        description: 'Generate an SVG badge for an agent listing. Perfect for README files and external sites.',
        params: '?agent=<slug>&style=flat|flat-square|for-the-badge|social',
        response: 'Content-Type: image/svg+xml — renders an SVG badge',
      },
    ],
  },
  {
    group: 'Health & Monitoring',
    icon: '💚',
    items: [
      {
        method: 'GET',
        path: '/api/health',
        description: 'Health check endpoint. Returns database status, latency, agent count.',
        response: '{ "status": "healthy", "timestamp": "...", "checks": { ... } }',
      },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
};

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="mt-2 rounded-lg border border-border/50 bg-muted/30 overflow-hidden">
      {label && (
        <div className="px-3 py-1.5 text-xs text-muted-foreground border-b border-border/50 font-mono">
          {label}
        </div>
      )}
      <pre className="p-3 text-xs text-foreground/80 overflow-x-auto font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
              📡
            </div>
            <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Everything you need to integrate with AgentHub programmatically. Browse agents, skill packages, stats, and generate embed widgets.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              All systems operational
            </span>
            <span>Base URL: <code className="text-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{BASE_URL}</code></span>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">⚡ Quick Start</h2>
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            No API key required for read endpoints. Rate limited to 100 requests/minute per IP.
          </p>
          <CodeBlock
            label="List all agents"
            code={`curl -s ${BASE_URL}/api/agents | jq '.agents[:3]'`}
          />
          <CodeBlock
            label="Search for free agents"
            code={`curl -s "${BASE_URL}/api/agents?pricingModel=free&q=automation&sort=popular" | jq '.total'`}
          />
          <CodeBlock
            label="Get marketplace stats"
            code={`curl -s ${BASE_URL}/api/stats`}
          />
          <CodeBlock
            label="Get a skill package"
            code={`curl -s ${BASE_URL}/api/skills/code-review-agent | jq '.manifest.name'`}
          />
          <CodeBlock
            label="Install a skill (shell)"
            code={`curl -s ${BASE_URL}/api/skills/code-review-agent/install?format=sh | bash`}
          />
          <CodeBlock
            label="Embed badge in README"
            code={`![AgentHub](${BASE_URL}/api/embed?agent=my-agent&style=flat-square)`}
          />
        </div>
      </div>

      {/* Endpoints */}
      <div className="container mx-auto px-4 pb-16 max-w-4xl">
        <h2 className="text-xl font-semibold mb-6">📖 Endpoints</h2>
        <div className="space-y-8">
          {endpoints.map((group) => (
            <div key={group.group}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span>{group.icon}</span>
                {group.group}
              </h3>
              <div className="space-y-3">
                {group.items.map((ep) => (
                  <div
                    key={`${ep.method}-${ep.path}`}
                    className="rounded-lg border bg-card overflow-hidden hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-md border font-mono w-fit ${methodColors[ep.method] || 'bg-muted text-muted-foreground'}`}>
                        {ep.method}
                      </span>
                      <code className="text-sm font-mono text-foreground font-medium">
                        {BASE_URL}{ep.path}
                      </code>
                    </div>
                    <div className="px-4 pb-4 space-y-2">
                      <p className="text-sm text-muted-foreground">{ep.description}</p>
                      {ep.params && (
                        <CodeBlock label="Parameters" code={ep.params} />
                      )}
                      {ep.response && (
                        <CodeBlock label="Response" code={ep.response} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Rate Limits */}
        <div className="mt-12 rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">⚡ Rate Limits</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Read endpoints:</strong> 100 requests/minute per IP</p>
            <p><strong className="text-foreground">Write endpoints:</strong> 10 requests/minute (auth required)</p>
            <p><strong className="text-foreground">Cached endpoints</strong> (stats, embed): serve from cache, fresh on miss</p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              Rate limit info returned in <code className="font-mono bg-muted px-1 rounded">X-RateLimit-Remaining</code> and <code className="font-mono bg-muted px-1 rounded">Retry-After</code> headers.
            </p>
          </div>
        </div>

        {/* Auth */}
        <div className="mt-6 rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">🔐 Authentication</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Read endpoints (<span className="font-mono text-foreground">GET</span>) require <strong className="text-foreground">no authentication</strong>.</p>
            <p>Write endpoints (<span className="font-mono text-foreground">POST/PUT/DELETE</span>) require a valid Supabase auth session cookie or <code className="font-mono bg-muted px-1 rounded">Authorization: Bearer &lt;token&gt;</code> header.</p>
          </div>
        </div>

        {/* CORS */}
        <div className="mt-6 rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">🌐 CORS</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>The API supports cross-origin requests for the embed endpoint and read APIs.</p>
            <p><code className="font-mono bg-muted px-1 rounded">Access-Control-Allow-Origin: *</code> is set on <code className="font-mono">/api/embed</code>.</p>
            <p>Other endpoints allow origin based on the <code className="font-mono bg-muted px-1 rounded">Origin</code> request header.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
