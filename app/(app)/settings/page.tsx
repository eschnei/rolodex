import { PageContainer, PageHeader } from '@/components/ui';
import { GmailConnection, DigestSettings } from '@/components/settings';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
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

  const isGmailConnected = !!profile?.gmail_refresh_token;
  const success = params?.success;
  const error = params?.error;

  return (
    <PageContainer>
      <PageHeader title="Settings" />

      {/* Success/Error messages */}
      {success === 'gmail_connected' && (
        <div className="mb-6 p-4 bg-status-ontrack-bg border border-status-ontrack/20 rounded-lg">
          <p className="type-body text-status-ontrack-text">
            Gmail connected successfully! You can now receive email digests.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-status-overdue-bg border border-status-overdue/20 rounded-lg">
          <p className="type-body text-status-overdue-text">
            {error === 'gmail_auth_denied'
              ? 'Gmail connection was cancelled.'
              : error === 'gmail_no_refresh_token'
                ? 'Could not get full access to Gmail. Please try connecting again.'
                : 'Failed to connect Gmail. Please try again.'}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Gmail Connection */}
        <section>
          <h2 className="type-h3 text-text-primary mb-3">Email Integration</h2>
          <GmailConnection
            isConnected={isGmailConnected}
            userEmail={profile?.email}
          />
        </section>

        {/* Digest Settings */}
        <section>
          <h2 className="type-h3 text-text-primary mb-3">Notifications</h2>
          <DigestSettings
            digestEnabled={profile?.digest_enabled ?? true}
            digestTime={profile?.digest_time ?? '08:00:00'}
            skipWhenCaughtUp={profile?.skip_when_caught_up ?? false}
            timezone={profile?.timezone ?? 'America/New_York'}
            isGmailConnected={isGmailConnected}
          />
        </section>

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
