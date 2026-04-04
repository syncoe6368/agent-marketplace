'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Share2, Copy, Check, MessageCircle, Link2, ExternalLink } from 'lucide-react';

interface ShareAgentProps {
  agentName: string;
  agentSlug: string;
  agentDescription: string;
}

export function ShareAgent({ agentName, agentSlug, agentDescription }: ShareAgentProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/agents/${agentSlug}`
    : `https://agenthub.syncoe.com/agents/${agentSlug}`;

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`Check out ${agentName} on AgentHub — ${agentDescription.slice(0, 100)}`);
  const encodedTitle = encodeURIComponent(agentName);

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: ExternalLink,
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: 'hover:bg-black/10 dark:hover:bg-white/10',
    },
    {
      name: 'LinkedIn',
      icon: Link2,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-blue-500/10',
    },
    {
      name: 'Discord',
      icon: MessageCircle,
      href: `https://discord.com/channels/@me`,
      color: 'hover:bg-indigo-500/10',
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-1.5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {agentName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* URL copy */}
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground truncate">
              {url}
            </div>
            <Button variant="outline" size="sm" onClick={copyLink}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-3 gap-2">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 rounded-md border p-3 text-sm font-medium transition-colors ${link.color}`}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
