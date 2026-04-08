'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle } from 'lucide-react';

export function FeedbackInline() {
  const [feedback, setFeedback] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'general',
          message: feedback.trim(),
        }),
      });
      setSent(true);
      setFeedback('');
    } catch {
      // Fallback: store locally
      try {
        const existing = JSON.parse(localStorage.getItem('agenthub_feedback') || '[]');
        existing.push({ message: feedback.trim(), timestamp: new Date().toISOString() });
        localStorage.setItem('agenthub_feedback', JSON.stringify(existing.slice(-20)));
      } catch {}
      setSent(true);
      setFeedback('');
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <CheckCircle className="h-4 w-4" />
        Thanks for your feedback!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Share feedback..."
        maxLength={500}
        className="flex-1 min-w-0 rounded-md border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <Button type="submit" size="sm" variant="ghost" disabled={!feedback.trim() || sending}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
