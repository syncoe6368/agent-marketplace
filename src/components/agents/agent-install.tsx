'use client';

import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface AgentInstallProps {
  slug: string;
  name: string;
  tags?: string[] | null;
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  getCommand: (slug: string) => string;
}

const platforms: Platform[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    icon: '🤖',
    getCommand: (slug) => `claude install-agent ${slug}`,
  },
  {
    id: 'codex-cli',
    name: 'Codex CLI',
    icon: '⚡',
    getCommand: (slug) => `codex --agent ${slug}`,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    icon: '🎯',
    getCommand: (slug) => `# In Cursor Settings > Agents > Add\n# Agent: ${slug}\n# Paste in the agent URL from the marketplace`,
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    icon: '🏄',
    getCommand: (slug) => `windsurf agent add ${slug}`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      title="Copy command"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function AgentInstall({ slug, name, tags }: AgentInstallProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Terminal className="h-5 w-5 text-primary" />
          Quick Start — Install {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="claude-code">
          <TabsList className="mb-4 flex-wrap">
            {platforms.map((p) => (
              <TabsTrigger key={p.id} value={p.id}>
                <span className="mr-1.5">{p.icon}</span>
                {p.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {platforms.map((p) => {
            const command = p.getCommand(slug);
            return (
              <TabsContent key={p.id} value={p.id}>
                <div className="relative">
                  <pre className="bg-zinc-950 text-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 rounded-lg p-4 text-sm font-mono overflow-x-auto pr-12">
                    <code>{command}</code>
                  </pre>
                  <CopyButton text={command} />
                </div>
                {p.id === 'cursor' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Copy the agent config and paste it into Cursor&apos;s agent settings.
                  </p>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        {tags && tags.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Compatible with:</span>
            {tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
