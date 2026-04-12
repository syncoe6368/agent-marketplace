#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Agent Marketplace Sample Data Seeder
 * 
 * This script populates the agent marketplace with sample agent listings
 * to demonstrate the platform capabilities and provide a rich browsing experience.
 * 
 * Usage:
 *   npm run seed:agents   # Seed all sample agents
 *   npm run seed:agents -- --category automation   # Seed specific category
 */

const fs = require('fs');
const path = require('path');

// Sample agent data - 5 high-quality agents across different categories
const sampleAgents = [
  {
    name: "Syncoe Trading Bot",
    category: "automation",
    description: "Automated BTC RSI Turtle strategy with real-time market analysis",
    longDescription: "A sophisticated trading bot that implements the proven Turtle RSI strategy for Bitcoin. Features real-time market monitoring, automated entry/exit signals, risk management, and comprehensive performance tracking. Built for systematic trading with predefined rules to eliminate emotional decision-making.",
    pricingModel: "subscription",
    priceAmount: 99,
    currency: "USD",
    websiteUrl: "https://syncoe.trading",
    githubUrl: "https://github.com/syncoe/trading-bot",
    tags: ["bitcoin", "trading", "automation", "rsi", "crypto"],
    features: [
      "Automated RSI-based entry/exit",
      "Real-time market monitoring",
      "Risk management protocols",
      "Performance analytics dashboard",
      "Multi-timeframe analysis"
    ]
  },
  {
    name: "Code Review Assistant",
    category: "development", 
    description: "AI-powered code review focusing on security, performance, and best practices",
    longDescription: "An intelligent code review assistant that analyzes your codebase for security vulnerabilities, performance bottlenecks, and adherence to best practices. Supports multiple programming languages and provides actionable feedback with explanations and suggested fixes.",
    pricingModel: "freemium",
    priceAmount: 49,
    currency: "USD", 
    websiteUrl: "https://syncoe.securitypad",
    githubUrl: "https://github.com/syncoe/securitypad",
    tags: ["code-review", "security", "performance", "ai", "automation"],
    features: [
      "Security vulnerability detection",
      "Performance optimization suggestions",
      "Code quality metrics",
      "Multi-language support",
      "Integration with GitHub/GitLab"
    ]
  },
  {
    name: "Market Research Pro",
    category: "research-analysis",
    description: "Comprehensive market research and competitive analysis agent",
    longDescription: "Advanced market research agent that gathers and analyzes market data, competitor intelligence, and industry trends. Performs sentiment analysis, market size estimation, and provides strategic insights for business decision-making. Updates research in real-time and generates comprehensive reports.",
    pricingModel: "paid",
    priceAmount: 199,
    currency: "USD",
    websiteUrl: "https://syncoe.research",
    tags: ["market-research", "competitive-analysis", "data-mining", "ai", "insights"],
    features: [
      "Real-time market data collection",
      "Competitive intelligence analysis",
      "Sentiment analysis",
      "Market trend forecasting",
      "Automated report generation"
    ]
  },
  {
    name: "Customer Support Bot",
    category: "customer-support",
    description: "Intelligent customer support chatbot with multi-language support",
    longDescription: "A sophisticated customer support bot that handles common customer inquiries, processes support tickets, and provides instant responses. Features natural language understanding, multi-language support, and seamless escalation to human agents when needed. Integrates with popular helpdesk systems.",
    pricingModel: "subscription",
    priceAmount: 299,
    currency: "USD",
    websiteUrl: "https://syncoe.support",
    githubUrl: "https://github.com/syncoe/support-bot",
    tags: ["customer-support", "chatbot", "nlp", "automation", "multi-language"],
    features: [
      "Natural language understanding",
      "Multi-language support (10+ languages)",
      "Ticket management integration",
      "Human handoff capabilities",
      "Analytics and reporting"
    ]
  },
  {
    name: "Content Marketing Assistant",
    category: "marketing",
    description: "AI-powered content creation and social media automation",
    longDescription: "A comprehensive content marketing assistant that creates engaging content, manages social media schedules, and optimizes content for maximum reach. Features AI-powered writing, content calendar management, performance analytics, and automated posting across multiple platforms.",
    pricingModel: "freemium",
    priceAmount: 79,
    currency: "USD",
    websiteUrl: "https://syncoe.content",
    githubUrl: "https://github.com/syncoe/content-ai",
    tags: ["content-creation", "social-media", "marketing", "ai", "automation"],
    features: [
      "AI-powered content generation",
      "Social media scheduling",
      "Performance analytics",
      "Multi-platform posting",
      "Content strategy suggestions"
    ]
  }
];

// Category mappings
const categorySlugs = {
  'automation': 'automation',
  'research-analysis': 'research-analysis', 
  'customer-support': 'customer-support',
  'development': 'development',
  'marketing': 'marketing',
  'finance': 'finance'
};

// Feature icons mapping
const featureIcons = {
  'Automated RSI-based entry/exit': 'TrendingUp',
  'Real-time market monitoring': 'Eye',
  'Risk management protocols': 'Shield',
  'Performance analytics dashboard': 'BarChart3',
  'Multi-timeframe analysis': 'Clock',
  'Security vulnerability detection': 'Shield',
  'Performance optimization suggestions': ' Zap',
  'Code quality metrics': 'Code',
  'Multi-language support': 'Globe',
  'Integration with GitHub/GitLab': 'Github',
  'Real-time market data collection': 'Database',
  'Competitive intelligence analysis': 'Users',
  'Sentiment analysis': 'MessageSquare',
  'Market trend forecasting': 'TrendingUp',
  'Automated report generation': 'FileText',
  'Natural language understanding': 'MessageSquare',
  'Multi-language support': 'Globe',
  'Ticket management integration': 'Ticket',
  'Human handoff capabilities': 'UserPlus',
  'Analytics and reporting': 'BarChart3',
  'AI-powered content generation': 'Type',
  'Social media scheduling': 'Calendar',
  'Performance analytics': 'BarChart3',
  'Multi-platform posting': 'Share2',
  'Content strategy suggestions': 'Lightbulb'
};

// Sample reviews for agents
const sampleReviews = [
  {
    rating: 5,
    comment: "Incredible trading bot! Has been consistently profitable with the RSI strategy.",
    userName: "Crypto Trader Pro"
  },
  {
    rating: 4,
    comment: "Great code review tool, caught several security issues I missed.",
    userName: "Senior Developer"
  },
  {
    rating: 5,
    comment: "Saved us hundreds of hours in market research. Highly accurate insights.",
    userName: "Marketing Director"
  },
  {
    rating: 4,
    comment: "Excellent customer support bot, handles 80% of our inquiries now.",
    userName: "Support Manager"
  },
  {
    rating: 5,
    comment: "Content creation quality is amazing, helps us maintain consistent posting.",
    userName: "Content Manager"
  }
];

/**
 * Generate agent markdown file for documentation
 */
function generateAgentMarkdown(agent) {
  const categorySlug = categorySlugs[agent.category];
  const fileName = `${agent.name.toLowerCase().replace(/\s+/g, '-')}.md`;
  const filePath = path.join(__dirname, '..', '..', 'docs', 'agents', fileName);
  
  const featuresList = agent.features.map(feature => `- ${feature}`).join('\n');
  const pricingText = agent.pricingModel === 'free' ? 'Free' : 
                     agent.pricingModel === 'freemium' ? 'Freemium (Free + Premium)' :
                     `$${agent.priceAmount}/month (${agent.pricingModel})`;
  
  const markdown = `# ${agent.name}

**Category:** ${agent.category.charAt(0).toUpperCase() + agent.category.slice(1)}  
**Pricing:** ${pricingText}

## Description

${agent.description}

## Long Description

${agent.longDescription}

## Features

${featuresList}

## Pricing Model

- **Model:** ${agent.pricingModel}
${agent.pricingModel !== 'free' ? `- **Price:** $${agent.priceAmount}/month` : ''}
${agent.priceAmount ? `- **Currency:** ${agent.currency}` : ''}

## Links

- **Website:** ${agent.websiteUrl}
${agent.githubUrl ? `- **GitHub:** ${agent.githubUrl}` : ''}

## Tags

${agent.tags.map(tag => `\`#${tag}\``).join(' ')}

## Installation

\`\`\`bash
# Install the agent
npm install ${agent.name.toLowerCase().replace(/\s+/g, '-')}

# Configure with your API keys
cp config.example.json config.json
\`\`\`

## Usage

\`\`\`javascript
const ${agent.name.toLowerCase().replace(/\s+/g, '-')} = require('${agent.name.toLowerCase().replace(/\s+/g, '-')}');

// Initialize agent
const agent = new ${agent.name.toLowerCase().replace(/\s+/g, '-')}({
  apiKey: 'your-api-key',
  // ... other config
});

// Run agent
agent.run();
\`\`\`

## Reviews

${sampleReviews.map(review => `
### ${review.rating}/5 Stars

> "${review.comment}"
> 
> — ${review.userName}
`).join('\n')}

---

*This is a sample agent listing for demonstration purposes.*
`;
  
  // Ensure directory exists
  const docsDir = path.dirname(filePath);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, markdown);
  console.log(`✅ Generated agent documentation: ${filePath}`);
}

/**
 * Generate deployment configuration
 */
function generateDeploymentConfig() {
  const config = {
    "name": "Agent Marketplace",
    "description": "AI Agent Marketplace for discovering and deploying AI agents",
    "version": "1.0.0",
    "repository": "https://github.com/syncoe/agent-marketplace",
    "homepage": "https://agent-marketplace.syncoe.com",
    "keywords": ["ai", "agents", "marketplace", "automation", "ai-tools"],
    "author": "Syncoe",
    "license": "MIT",
    "engines": {
      "node": ">=18.0.0",
      "npm": ">=8.0.0"
    },
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "seed:agents": "node scripts/seed-agents.js",
      "type-check": "tsc --noEmit"
    },
    "dependencies": {
      "@supabase/supabase-js": "^2.100.1",
      "@supabase/auth-helpers-nextjs": "^0.15.0",
      "next": "16.2.1",
      "react": "19.2.4",
      "react-dom": "19.2.4",
      "lucide-react": "^1.7.0",
      "tailwindcss": "^4.0.0"
    },
    "devDependencies": {
      "@types/node": "^20.0.0",
      "@types/react": "^19.0.0",
      "typescript": "^5.0.0"
    },
    "deployment": {
      "platform": "vercel",
      "environment": "production",
      "env": {
        "NEXT_PUBLIC_SUPABASE_URL": "your-supabase-url",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY": "your-supabase-anon-key",
        "NEXT_PUBLIC_VERCEL_URL": "your-vercel-url"
      }
    }
  };
  
  const configPath = path.join(__dirname, '..', '..', 'config', 'deployment.json');
  const configDir = path.dirname(configPath);
  
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`✅ Generated deployment configuration: ${configPath}`);
}

/**
 * Generate sample data file for development
 */
function generateSampleData() {
  const data = {
    agents: sampleAgents.map((agent, index) => ({
      id: `agent-${index + 1}`,
      ...agent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      isVerified: true,
      isFeatured: index < 2, // Feature first 2 agents
      viewsCount: Math.floor(Math.random() * 1000) + 100,
      averageRating: 4.5 + (Math.random() * 0.5),
      reviewCount: Math.floor(Math.random() * 50) + 10
    })),
    categories: Object.entries(categorySlugs).map(([name, slug]) => ({
      id: `category-${slug}`,
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
      slug: slug,
      description: `Sample ${name} category for demonstration`,
      icon: featureIcons[name] || 'Zap',
      createdAt: new Date().toISOString()
    }))
  };
  
  const dataPath = path.join(__dirname, '..', '..', 'data', 'sample.json');
  const dataDir = path.dirname(dataPath);
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`✅ Generated sample data: ${dataPath}`);
}

/**
 * Main function - seed all sample data
 */
function main() {
  console.log('🚀 Starting Agent Marketplace Sample Data Seeding...\n');
  
  try {
    // Generate agent documentation
    sampleAgents.forEach(agent => {
      generateAgentMarkdown(agent);
    });
    
    // Generate deployment configuration
    generateDeploymentConfig();
    
    // Generate sample data
    generateSampleData();
    
    console.log('\n✅ Sample data seeding completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Review generated documentation in docs/agents/');
    console.log('2. Check deployment configuration in config/deployment.json');
    console.log('3. Use sample data in data/sample.json for development');
    console.log('4. Deploy to production using the configuration');
    
  } catch (error) {
    console.error('❌ Error during sample data seeding:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  sampleAgents,
  generateAgentMarkdown,
  generateDeploymentConfig,
  generateSampleData
};