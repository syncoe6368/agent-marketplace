'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';

interface AgentSearchProps {
  categories: { id: string; name: string; slug: string }[];
  initialSearch?: string;
  initialCategory?: string;
  initialPricing?: string;
  initialSort?: string;
}

export function AgentSearch({
  categories,
  initialSearch = '',
  initialCategory = '',
  initialPricing = '',
  initialSort = 'newest',
}: AgentSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/agents?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateParams('q', formData.get('search') as string);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search agents..."
            defaultValue={initialSearch}
            className="pl-10"
          />
        </div>
        <Sheet>
          <SheetTrigger>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle>Filters</SheetTitle>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={initialCategory} onValueChange={(v) => updateParams('category', v || '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pricing</Label>
                <Select value={initialPricing} onValueChange={(v) => updateParams('pricing', v || '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="All pricing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All pricing</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort by</Label>
                <Select value={initialSort} onValueChange={(v) => updateParams('sort', v || '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="top_rated">Top Rated</SelectItem>
                    <SelectItem value="most_viewed">Most Viewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </form>

      {/* Desktop filters */}
      <div className="hidden lg:flex items-center gap-3">
        <Select value={initialCategory} onValueChange={(v) => updateParams('category', v || '')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={initialPricing} onValueChange={(v) => updateParams('pricing', v || '')}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All pricing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All pricing</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="freemium">Freemium</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
          </SelectContent>
        </Select>

        <Select value={initialSort} onValueChange={(v) => updateParams('sort', v || '')}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="top_rated">Top Rated</SelectItem>
            <SelectItem value="most_viewed">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
