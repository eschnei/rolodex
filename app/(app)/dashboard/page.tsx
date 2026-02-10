import { PageContainer, PageHeader } from '@/components/ui';

export default async function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader title="Dashboard" />
      <div className="p-5 bg-bg-secondary border border-border-subtle rounded-lg">
        <p className="type-small text-text-tertiary">
          No contacts due for follow-up. You&apos;re all caught up!
        </p>
      </div>
    </PageContainer>
  );
}
