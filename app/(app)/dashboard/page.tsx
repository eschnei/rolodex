import { createClient } from '@/lib/supabase/server';
import { PageContainer, PageHeader } from '@/components/ui';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.email}`}
      />
      <div className="p-5 bg-bg-secondary border border-border-subtle rounded-lg">
        <p className="type-small text-text-tertiary">
          Your contacts and nudges will appear here once we finish building the
          app.
        </p>
      </div>
    </PageContainer>
  );
}
