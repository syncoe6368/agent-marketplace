import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Starting seed...');

  // Fetch all categories
  const { data: categories, error: catErr } = await supabase.from('categories').select('*');
  if (catErr) {
    console.error('Failed to fetch categories', catErr);
    process.exit(1);
  }

  const catMap: Record<string, string> = {};
  categories?.forEach((c: any) => (catMap[c.slug] = c.id));

  // Fetch a demo user profile to use as creator
  const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
  if (!profiles || profiles.length === 0) {
    console.error('No profiles found. Please create a user account first.');
    process.exit(1);
  }
  const demoUserId = profiles[0].id;

  const agents = [
    {
      name: 'SynthMind Pro',
      slug: 'synthmind-pro',
      description: 'Autonomous workflow agent for enterprise automation. Builds complex multi-step pipelines from natural language descriptions.',
      pricing_model: 'freemium',
      price_amount: 29,
      category_id: catMap['automation'],
      tags: ['automation', 'workflow', 'enterprise', 'AI'],
      is_featured: true,
      is_verified: true,
    },
    {
      name: 'CodeWeaver AI',
      slug: 'codeweaver-ai',
      description: 'AI code review and refactoring agent with deep codebase understanding. Integrates into CI/CD pipeline.',
      pricing_model: 'subscription',
      price_amount: 15,
      category_id: catMap['development'],
      tags: ['code-review', 'CI/CD', 'security', 'developer-tools'],
      is_featured: true,
      is_verified: true,
    },
    {
      name: 'SentimentPulse',
      slug: 'sentiment-pulse',
      description: 'Real-time market and social sentiment analysis agent. Track brand mentions, monitor trends, generate intelligence reports.',
      pricing_model: 'paid',
      price_amount: 49,
      category_id: catMap['research-analysis'],
      tags: ['sentiment', 'market-intelligence', 'monitoring', 'brand-tracking'],
      is_featured: false,
      is_verified: true,
    },
    {
      name: 'SupportBot Zero',
      slug: 'supportbot-zero',
      description: 'Multilingual customer support agent. Handles tickets in 12 languages, escalates to humans when confidence is low.',
      pricing_model: 'free',
      price_amount: null,
      category_id: catMap['customer-support'],
      tags: ['customer-support', 'multilingual', 'ticket-handling', 'chatbot'],
      is_featured: false,
      is_verified: false,
    },
    {
      name: 'TradeSage',
      slug: 'tradesage',
      description: 'AI trading assistant. Technical analysis, portfolio monitoring, and market alerts with RSI, MACD, and ML signals.',
      pricing_model: 'subscription',
      price_amount: 19,
      category_id: catMap['finance'],
      tags: ['trading', 'technical-analysis', 'signals', 'portfolio'],
      is_featured: true,
      is_verified: false,
    },
  ];

  for (const agent of agents) {
    const { error } = await supabase.from('agents').insert({
      ...agent,
      creator_id: demoUserId,
      currency: 'USD',
      website_url: null,
      github_url: null,
      api_docs_url: null,
      logo_url: null,
      views_count: Math.floor(Math.random() * 1000),
      status: 'active',
    });

    if (error) {
      console.error(`Failed to insert ${agent.name}`, error);
    } else {
      console.log(`Inserted agent: ${agent.name}`);
    }
  }

  console.log('Seeding complete.');
}

seed();
