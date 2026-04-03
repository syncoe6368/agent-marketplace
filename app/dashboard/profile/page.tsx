import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ProfileContent } from './profile-content';

export const metadata: Metadata = {
  title: 'My Profile — AgentHub',
  description: 'Manage your AgentHub profile.',
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(c) {
          try { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/dashboard/profile');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">My Profile</h1>
      <p className="text-muted-foreground mb-8">
        Manage your public profile information
      </p>
      <ProfileContent
        user={{
          id: user.id,
          email: user.email ?? '',
          avatarUrl: user.user_metadata?.avatar_url ?? '',
        }}
        profile={profile ?? { id: user.id, full_name: '', avatar_url: '', bio: '' }}
      />
    </div>
  );
}
