import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils/cn';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="p-4 md:p-6">
      <div
        className={cn(
          'rounded-[16px] overflow-hidden',
          'bg-[rgba(255,255,255,0.08)]',
          'backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]',
          'border border-[rgba(255,255,255,0.12)]',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
        )}
      >
        <div className="p-5 md:p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.5)] mb-4">
            Account
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
              <span className="text-[13px] text-[rgba(255,255,255,0.6)]">Email</span>
              <span className="text-[13px] text-[rgba(255,255,255,0.95)]">
                {profile?.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
              <span className="text-[13px] text-[rgba(255,255,255,0.6)]">Name</span>
              <span className="text-[13px] text-[rgba(255,255,255,0.95)]">
                {profile?.name || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] text-[rgba(255,255,255,0.6)]">Member since</span>
              <span className="text-[13px] text-[rgba(255,255,255,0.95)]">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
