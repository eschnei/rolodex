import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TimezoneDetector } from '@/components/TimezoneDetector';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile for timezone
  const { data: profile } = await supabase
    .from('users')
    .select('timezone')
    .eq('id', user.id)
    .single();

  const timezone = (profile as { timezone?: string | null } | null)?.timezone ?? null;

  return (
    <div className="min-h-screen bg-bg-primary">
      <TimezoneDetector currentTimezone={timezone} />
      {children}
    </div>
  );
}
