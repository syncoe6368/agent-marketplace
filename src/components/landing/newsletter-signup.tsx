'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'cta-section' }),
      });

      const data = await res.json();

      if (res.ok || res.status === 200) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 justify-center text-green-600 dark:text-green-400 animate-in fade-in duration-300">
        <CheckCircle2 className="h-5 w-5" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') {
                setStatus('idle');
                setMessage('');
              }
            }}
            required
            className="pl-10"
            disabled={status === 'loading'}
          />
        </div>
        <Button
          type="submit"
          disabled={status === 'loading' || !email}
          className="shrink-0"
        >
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Subscribe
              <ArrowRight className="ml-1 h-3 w-3" />
            </>
          )}
        </Button>
      </div>
      {status === 'error' && (
        <p className="text-xs text-red-500 mt-2 text-center">{message}</p>
      )}
      <p className="text-xs text-muted-foreground mt-2 text-center">
        No spam · Unsubscribe anytime · Join 500+ builders
      </p>
    </form>
  );
}
