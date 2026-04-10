import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Users, DollarSign, Star } from 'lucide-react';

export function PricingStrategySection() {
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Star className="w-4 h-4 mr-2" />
            Southeast Asia's Leading AI Agent Marketplace
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Smart Pricing for Every Creator</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We've designed a pricing model that empowers everyone from hobbyists to enterprise teams 
            to build, share, and monetize AI agents. Our hybrid approach combines predictable 
            subscriptions with performance-based incentives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">$0</div>
            <div className="font-medium">Entry Point</div>
            <p className="text-sm text-muted-foreground">Start building today</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">$19/mo</div>
            <div className="font-medium">Sweet Spot</div>
            <p className="text-sm text-muted-foreground">Most popular tier</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">$99/mo</div>
            <div className="font-medium">Business Ready</div>
            <p className="text-sm text-muted-foreground">Teams & agencies</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">Custom</div>
            <div className="font-medium">Enterprise</div>
            <p className="text-sm text-muted-foreground">Fortune 500 ready</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                Hybrid Revenue Model
              </CardTitle>
              <CardDescription>
                Combine predictable subscriptions with performance incentives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <div>
                  <strong>80% SaaS Revenue</strong> - Monthly subscriptions
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <div>
                  <strong>20% Platform Fees</strong> - Usage-based commissions
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <div>
                  <strong>Future Streams</strong> - Sponsorships & API access
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Target Segments
              </CardTitle>
              <CardDescription>
                Pricing designed for specific creator needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong className="text-indigo-600">Hobbyists ($0-5)</strong>
                <p className="text-sm text-muted-foreground">Learn, experiment, build portfolio</p>
              </div>
              <div>
                <strong className="text-green-600">Freelancers ($19-50)</strong>
                <p className="text-sm text-muted-foreground">Generate leads, showcase skills</p>
              </div>
              <div>
                <strong className="text-purple-600">SME Teams ($99-200)</strong>
                <p className="text-sm text-muted-foreground">Deploy internal agents, productivity</p>
              </div>
              <div>
                <strong className="text-amber-600">Enterprise ($250+)</strong>
                <p className="text-sm text-muted-foreground">Production-grade deployment</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                Revenue Projections
              </CardTitle>
              <CardDescription>
                Year-over-year growth targets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">$15k</div>
                <div className="text-sm">Monthly Goal (Q4 2026)</div>
                <div className="text-xs text-muted-foreground mt-1">1,000 active creators</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$125k</div>
                <div className="text-sm">Monthly Goal (Q4 2027)</div>
                <div className="text-xs text-muted-foreground mt-1">5,000 active creators</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-2xl font-bold mb-4 text-center">Why Our Pricing Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold mb-2">Psychologically Optimized</h4>
              <p className="text-sm text-muted-foreground">
                Anchored at $19 (below market average) with strategic tier positioning
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Clear Upgrade Paths</h4>
              <p className="text-sm text-muted-foreground">
                Each tier unlocks meaningful value, creating natural progression
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Network Effects</h4>
              <p className="text-sm text-muted-foreground">
                More creators → more agents → more users → more creators
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}