import Link from 'next/link';
import {
  Zap, Search, MessageSquare, Code, Megaphone, TrendingUp,
} from 'lucide-react';

// Per-category color mapping for visual distinction
const categoryStyles: Record<string, { bg: string; text: string; gradient: string }> = {
  automation: {
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500 to-orange-500',
  },
  'research-analysis': {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    text: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
  },
  'customer-support': {
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
  },
  development: {
    bg: 'bg-violet-100 dark:bg-violet-900/40',
    text: 'text-violet-600 dark:text-violet-400',
    gradient: 'from-violet-500 to-purple-500',
  },
  finance: {
    bg: 'bg-sky-100 dark:bg-sky-900/40',
    text: 'text-sky-600 dark:text-sky-400',
    gradient: 'from-sky-500 to-blue-500',
  },
  marketing: {
    bg: 'bg-rose-100 dark:bg-rose-900/40',
    text: 'text-rose-600 dark:text-rose-400',
    gradient: 'from-rose-500 to-pink-500',
  },
};

const defaultStyle = {
  bg: 'bg-primary/10',
  text: 'text-primary',
  gradient: 'from-primary to-primary/70',
};

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-6 w-6" />,
  Search: <Search className="h-6 w-6" />,
  MessageSquare: <MessageSquare className="h-6 w-6" />,
  Code: <Code className="h-6 w-6" />,
  Megaphone: <Megaphone className="h-6 w-6" />,
  TrendingUp: <TrendingUp className="h-6 w-6" />,
};

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  agent_count?: number;
}

interface CategoriesGridProps {
  categories: CategoryItem[];
}

export function getCategoryStyle(slug: string) {
  return categoryStyles[slug] || defaultStyle;
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
          {categories.map((category) => {
            const style = getCategoryStyle(category.slug);
            return (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <div className="group flex flex-col items-center gap-3 p-6 rounded-xl border bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer">
                  <div className={`p-3 rounded-lg ${style.bg} ${style.text} group-hover:scale-110 transition-transform`}>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
