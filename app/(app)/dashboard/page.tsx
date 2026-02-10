import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-page mx-auto px-6 py-16">
      <h1 className="type-h1 text-text-primary mb-4">Dashboard</h1>
      <p className="type-body text-text-secondary mb-8">
        Welcome back, {user?.email}
      </p>
      <div className="p-5 bg-bg-secondary border border-border-subtle rounded-lg">
        <p className="type-small text-text-tertiary">
          Your contacts and nudges will appear here once we finish building the app.
        </p>
      </div>
    </div>
  );
}
