import { PageContainer } from '@/components/ui';
import {
  DashboardStats,
  DashboardContactsList,
  EmptyDashboard,
} from '@/components/dashboard';
import { getDashboardData } from '@/lib/actions/dashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { data, error } = await getDashboardData();

  if (error) {
    return (
      <PageContainer>
        <DashboardTitle />
        <div className="p-5 bg-[rgba(229,72,77,0.15)] border border-[rgba(229,72,77,0.3)] rounded-[16px]">
          <p className="text-[14px] text-status-overdue">
            Failed to load dashboard data. Please try refreshing the page.
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <DashboardTitle />
        <EmptyDashboard hasContacts={false} />
      </PageContainer>
    );
  }

  const { contacts, stats } = data;
  const hasAnyContacts = stats.totalContacts > 0;

  // Combine all contacts for the list
  const allContacts = [
    ...contacts.overdue,
    ...contacts.dueToday,
    ...contacts.dueSoon,
    ...contacts.onTrack,
  ];

  return (
    <PageContainer>
      <DashboardTitle />

      {/* Stats grid */}
      {hasAnyContacts && <DashboardStats stats={stats} className="mb-6" />}

      {/* Empty state when no contacts */}
      {!hasAnyContacts && <EmptyDashboard hasContacts={false} />}

      {/* Contacts list with action items prioritized */}
      {hasAnyContacts && <DashboardContactsList contacts={allContacts} />}
    </PageContainer>
  );
}

function DashboardTitle() {
  return (
    <div className="mb-8">
      <h1 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.95)]">
        DASHBOARD
      </h1>
    </div>
  );
}
