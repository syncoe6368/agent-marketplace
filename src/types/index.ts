export type PricingModel = 'free' | 'paid' | 'freemium' | 'subscription';
export type AgentStatus = 'pending' | 'active' | 'suspended';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  agent_count?: number;
  created_at: string;
}

export interface Agent {
  id: string;
  creator_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string | null;
  pricing_model: PricingModel;
  price_amount: number | null;
  currency: string;
  website_url: string | null;
  github_url: string | null;
  api_docs_url: string | null;
  logo_url: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_verified: boolean;
  status: AgentStatus;
  views_count: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
  creator?: Profile;
  average_rating?: number;
  review_count?: number;
}

export interface Review {
  id: string;
  agent_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  // Joined
  user?: Profile;
}

export interface AgentFilters {
  search?: string;
  category?: string;
  pricing_model?: PricingModel;
  sort?: 'newest' | 'top_rated' | 'most_viewed';
}
