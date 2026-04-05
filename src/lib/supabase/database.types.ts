export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
        };
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
        };
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      agents: {
        Row: {
          id: string;
          creator_id: string;
          category_id: string | null;
          name: string;
          slug: string;
          description: string;
          long_description: string | null;
          pricing_model: 'free' | 'paid' | 'freemium' | 'subscription';
          price_amount: number | null;
          currency: string;
          website_url: string | null;
          github_url: string | null;
          api_docs_url: string | null;
          logo_url: string | null;
          tags: string[] | null;
          is_featured: boolean;
          is_verified: boolean;
          status: 'pending' | 'active' | 'suspended';
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          category_id?: string | null;
          name: string;
          slug?: string;
          description: string;
          long_description?: string | null;
          pricing_model?: 'free' | 'paid' | 'freemium' | 'subscription';
          price_amount?: number | null;
          currency?: string;
          website_url?: string | null;
          github_url?: string | null;
          api_docs_url?: string | null;
          logo_url?: string | null;
          tags?: string[] | null;
          is_featured?: boolean;
          is_verified?: boolean;
          status?: 'pending' | 'active' | 'suspended';
          views_count?: number;
        };
        Update: {
          creator_id?: string;
          category_id?: string | null;
          name?: string;
          slug?: string;
          description?: string;
          long_description?: string | null;
          pricing_model?: 'free' | 'paid' | 'freemium' | 'subscription';
          price_amount?: number | null;
          currency?: string;
          website_url?: string | null;
          github_url?: string | null;
          api_docs_url?: string | null;
          logo_url?: string | null;
          tags?: string[] | null;
          is_featured?: boolean;
          is_verified?: boolean;
          status?: 'pending' | 'active' | 'suspended';
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      reviews: {
        Row: {
          id: string;
          agent_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
        };
        Update: {
          rating?: number;
          comment?: string | null;
        };
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_unique_slug: {
        Args: {
          p_name: string;
        };
        Returns: string;
      };
    };
    Enums: {
      pricing_model: 'free' | 'paid' | 'freemium' | 'subscription';
      agent_status: 'pending' | 'active' | 'suspended';
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
