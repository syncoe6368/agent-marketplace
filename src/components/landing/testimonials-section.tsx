import { Star } from 'lucide-react';

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
    <section className="py-16 bg-gradient-to-b from-muted/30 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Trusted by the Community</h2>
          <p className="text-muted-foreground">Real reviews from real users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card p-5 space-y-3"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                &ldquo;{t.comment}&rdquo;
              </p>

              {/* Attribution */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium">{t.user_name}</span>
                <span className="text-xs text-muted-foreground">
                  about <a href={`/agents/${t.agent_slug}`} className="text-indigo-600 hover:underline">{t.agent_name}</a>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
