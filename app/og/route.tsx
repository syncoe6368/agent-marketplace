import { ImageResponse } from 'next/og';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const title = searchParams.get('title');
  const description = searchParams.get('description');

  // If slug is provided, fetch agent details
  let agentName = title || 'AgentHub';
  let agentDesc = description || 'Discover & Deploy AI Agents';

  if (slug) {
    try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll() {},
          },
        }
      );

      const { data } = await supabase
        .from('agents')
        .select('name, description, category:categories(name)')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (data) {
        agentName = data.name;
        agentDesc = data.description;
      }
    } catch {
      // Fallback to defaults
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#0f0f23',
          backgroundImage:
            'radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.15), transparent 50%), radial-gradient(ellipse at bottom right, rgba(168, 85, 247, 0.15), transparent 50%)',
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '28px', color: 'white' }}>🏪</span>
          </div>
          <span style={{ fontSize: '28px', color: '#e2e8f0', fontWeight: 700 }}>
            AgentHub
          </span>
        </div>

        {/* Agent Name */}
        <div
          style={{
            fontSize: slug ? '56px' : '72px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '1000px',
          }}
        >
          {agentName.length > 40 ? agentName.slice(0, 40) + '…' : agentName}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            lineHeight: 1.4,
            maxWidth: '900px',
          }}
        >
          {agentDesc.length > 100 ? agentDesc.slice(0, 100) + '…' : agentDesc}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '40px',
          }}
        >
          <span style={{ fontSize: '20px', color: '#64748b' }}>
            agenthub.syncoe.com
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            <span style={{ fontSize: '18px', color: '#a5b4fc' }}>AI Agent Marketplace</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
