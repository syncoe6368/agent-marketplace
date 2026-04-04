'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare } from 'lucide-react';

type FeedbackType = 'bug' | 'feature' | 'general' | 'praise';

interface FeedbackPayload {
  type: FeedbackType;
  message: string;
  page: string;
  timestamp: string;
}

const feedbackTypes: { value: FeedbackType; label: string; emoji: string }[] = [
  { value: 'bug', label: 'Bug Report', emoji: '🐛' },
  { value: 'feature', label: 'Feature Request', emoji: '💡' },
  { value: 'general', label: 'General Feedback', emoji: '💬' },
  { value: 'praise', label: 'Praise', emoji: '❤️' },
];

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showFab, setShowFab] = useState(false);

  // Show FAB after a short delay (don't distract on load)
  useEffect(() => {
    const timer = setTimeout(() => setShowFab(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    const payload: FeedbackPayload = {
      type,
      message: message.trim(),
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        setMessage('');
        setTimeout(() => {
          setOpen(false);
          setSubmitted(false);
        }, 2000);
      }
    } catch {
      // Silent fail — store to localStorage as fallback
      const existing = JSON.parse(localStorage.getItem('agenthub_feedback') || '[]');
      existing.push(payload);
      localStorage.setItem('agenthub_feedback', JSON.stringify(existing));
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  if (!showFab) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl hover:scale-105 active:scale-95"
        aria-label="Send feedback"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Feedback</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {submitted ? 'Thanks for your feedback! 🎉' : 'Share Feedback'}
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <p className="text-sm text-muted-foreground">
            We appreciate you taking the time to help us improve AgentHub.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {feedbackTypes.map((ft) => (
                    <SelectItem key={ft.value} value={ft.value}>
                      {ft.emoji} {ft.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-message">Your feedback</Label>
              <Textarea
                id="feedback-message"
                placeholder="Tell us what's on your mind..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                className="resize-none"
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting || !message.trim()}>
              {submitting ? 'Sending...' : 'Send Feedback'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
