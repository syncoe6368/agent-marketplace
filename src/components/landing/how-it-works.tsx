import { Bot, Search, Star, Zap } from 'lucide-react';

const steps = [
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Discover',
    description: 'Browse hundreds of AI agents across categories. Filter by use case, pricing, and ratings.',
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: 'Evaluate',
    description: 'Read verified reviews, compare features, and check real user feedback before committing.',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Deploy',
    description: 'Connect to your agent of choice in one click. Start automating your workflows immediately.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground">Get started in three simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center space-y-4">
              <div className="relative inline-flex">
                <div className="p-4 rounded-xl bg-primary/10 text-primary">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
