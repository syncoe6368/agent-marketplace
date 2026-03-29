import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Zap, Search, MessageSquare, Code, Megaphone, TrendingUp,
} from 'lucide-react';
import type { Category } from '@/types';

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-6 w-6" />,
  Search: <Search className="h-6 w-6" />,
  MessageSquare: <MessageSquare className="h-6 w-6" />,
  Code: <Code className="h-6 w-6" />,
  Megaphone: <Megaphone className="h-6 w-6" />,
  TrendingUp: <TrendingUp className="h-6 w-6" />,
};

interface CategoriesGridProps {
  categories: Category[];
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Browse by Category</h2>
          <p className="text-muted-foreground">Find the right AI agent for your needs</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <div className="group flex flex-col items-center gap-3 p-6 rounded-xl border bg-card hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 cursor-pointer">
                <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 group-hover:scale-110 transition-transform">
                  {iconMap[category.icon || 'Zap'] || <Zap className="h-6 w-6" />}
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  {category.agent_count !== undefined && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.agent_count} agents
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
