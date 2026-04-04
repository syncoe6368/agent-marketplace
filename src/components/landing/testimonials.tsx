import { Star, Quote } from 'lucide-react';

interface Testimonial {
  user_name: string;
  rating: number;
  comment: string;
  agent_name: string;
  agent_slug: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">What Users Are Saying</h2>
          <p className="text-muted-foreground">Real reviews from the AgentHub community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative rounded-xl border bg-card p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-indigo-200 dark:text-indigo-900/50" />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${
                      j < t.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                &ldquo;{t.comment}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.user_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{t.user_name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    about <a href={`/agents/${t.agent_slug}`} className="text-indigo-600 hover:underline">{t.agent_name}</a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
