'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface EditAgentFormProps {
  agent: {
    id: string;
    name: string;
    description: string;
    long_description: string | null;
    category_id: string | null;
    pricing_model: string;
    price_amount: number | null;
    website_url: string | null;
    github_url: string | null;
    api_docs_url: string | null;
    tags: string[] | null;
  };
  categories: { id: string; name: string; slug: string }[];
}

export function EditAgentForm({ agent, categories }: EditAgentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: agent.name,
    description: agent.description,
    long_description: agent.long_description || '',
    category_id: agent.category_id || '',
    pricing_model: agent.pricing_model as 'free' | 'paid' | 'freemium' | 'subscription',
    price_amount: agent.price_amount ? (agent.price_amount / 100).toString() : '',
    website_url: agent.website_url || '',
    github_url: agent.github_url || '',
    api_docs_url: agent.api_docs_url || '',
    tags: agent.tags?.join(', ') || '',
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('agents')
      .update({
        name: form.name,
        description: form.description,
        long_description: form.long_description || null,
        category_id: form.category_id || null,
        pricing_model: form.pricing_model,
        price_amount: form.price_amount ? parseInt(form.price_amount) * 100 : null,
        website_url: form.website_url || null,
        github_url: form.github_url || null,
        api_docs_url: form.api_docs_url || null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      })
      .eq('id', agent.id);

    if (error) {
      toast.error('Failed to update agent: ' + error.message);
    } else {
      toast.success('Agent updated!');
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">Basic Information</h2>
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name *</Label>
            <Input id="name" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea id="description" maxLength={200} rows={2} value={form.description} onChange={(e) => updateField('description', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="long_description">Detailed Description</Label>
            <Textarea id="long_description" rows={5} value={form.long_description} onChange={(e) => updateField('long_description', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category_id} onValueChange={(v) => updateField('category_id', v || '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" value={form.tags} onChange={(e) => updateField('tags', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">Pricing</h2>
          <div className="space-y-2">
            <Label>Pricing Model *</Label>
            <Select value={form.pricing_model} onValueChange={(v) => updateField('pricing_model', v || '')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">One-time Payment</SelectItem>
                <SelectItem value="freemium">Freemium</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.pricing_model !== 'free' && (
            <div className="space-y-2">
              <Label htmlFor="price_amount">Price (USD)</Label>
              <Input id="price_amount" type="number" min="0" step="0.01" value={form.price_amount} onChange={(e) => updateField('price_amount', e.target.value)} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">Links</h2>
          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input id="website_url" type="url" value={form.website_url} onChange={(e) => updateField('website_url', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub Repository</Label>
            <Input id="github_url" type="url" value={form.github_url} onChange={(e) => updateField('github_url', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api_docs_url">API Documentation URL</Label>
            <Input id="api_docs_url" type="url" value={form.api_docs_url} onChange={(e) => updateField('api_docs_url', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
