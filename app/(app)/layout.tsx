import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TimezoneDetector } from '@/components/TimezoneDetector';
import { Sidebar, BottomNav } from '@/components/layout';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile for timezone
  const { data: profile } = await supabase
    .from('users')
    .select('timezone')
    .eq('id', user.id)
    .single();

  const timezone =
    (profile as { timezone?: string | null } | null)?.timezone ?? null;

  return (
    <div className="min-h-screen bg-bg-primary">
      <TimezoneDetector currentTimezone={timezone} />

      {/* Sidebar for desktop (>= 1024px) */}
      <Sidebar email={user.email || ''} />

      {/* Main content area */}
      <main className="lg:ml-[240px] min-h-screen pb-16 md:pb-0">{children}</main>

      {/* Bottom nav for mobile (< 768px) */}
      <BottomNav />
    </div>
  );
}
