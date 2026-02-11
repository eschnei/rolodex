import { PageContainer, PageHeader } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <PageContainer>
      <PageHeader title="Settings" />

      <div className="space-y-6">
        {/* Account Info */}
        <section>
          <h2 className="type-h3 text-text-primary mb-3">Account</h2>
          <div className="p-5 bg-bg-secondary border border-border-subtle rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="type-body text-text-secondary">Email</span>
                <span className="type-body text-text-primary">
                  {profile?.email}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="type-body text-text-secondary">Name</span>
                <span className="type-body text-text-primary">
                  {profile?.name || 'Not set'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="type-body text-text-secondary">
                  Member since
                </span>
                <span className="type-body text-text-primary">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
