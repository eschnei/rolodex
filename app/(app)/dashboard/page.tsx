import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/ui';
import {
  DashboardStats,
  DashboardSection,
  EmptyDashboard,
} from '@/components/dashboard';
import { getDashboardData } from '@/lib/actions/dashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { data, error } = await getDashboardData();

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Dashboard" />
        <div className="p-5 bg-status-overdue-bg border border-status-overdue/20 rounded-lg">
          <p className="type-body text-status-overdue-text">
            Failed to load dashboard data. Please try refreshing the page.
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <PageHeader title="Dashboard" />
        <EmptyDashboard hasContacts={false} />
      </PageContainer>
    );
  }

  const { contacts, stats, isCaughtUp } = data;
  const hasAnyContacts = stats.totalContacts > 0;
  const hasNeedsAttention =
    contacts.overdue.length > 0 ||
    contacts.dueToday.length > 0 ||
    contacts.dueSoon.length > 0;

  return (
    <PageContainer>
      <PageHeader title="Dashboard" />

      {/* Stats grid */}
      {hasAnyContacts && <DashboardStats stats={stats} className="mb-6" />}

      {/* Empty or caught up state */}
      {!hasAnyContacts && <EmptyDashboard hasContacts={false} />}

      {hasAnyContacts && isCaughtUp && !hasNeedsAttention && (
        <EmptyDashboard hasContacts={true} />
      )}

      {/* Contact sections */}
      {hasAnyContacts && hasNeedsAttention && (
        <div className="space-y-8">
          {/* Overdue section */}
          <DashboardSection
            title="Overdue"
            subtitle="Contacts past their cadence deadline"
            contacts={contacts.overdue}
            variant="overdue"
            icon={<AlertCircle size={20} strokeWidth={1.5} />}
          />

          {/* Due Today section */}
          <DashboardSection
            title="Due Today"
            subtitle="Reach out to these contacts today"
            contacts={contacts.dueToday}
            variant="overdue"
            icon={<AlertCircle size={20} strokeWidth={1.5} />}
          />

          {/* Due Soon section */}
          <DashboardSection
            title="Due Soon"
            subtitle="Coming up in the next 3 days"
            contacts={contacts.dueSoon}
            variant="due"
            icon={<Clock size={20} strokeWidth={1.5} />}
          />

          {/* On Track section - collapsed by default, shown if no overdue/due soon */}
          {contacts.overdue.length === 0 &&
            contacts.dueToday.length === 0 &&
            contacts.dueSoon.length === 0 && (
              <DashboardSection
                title="On Track"
                subtitle="All your contacts are doing well"
                contacts={contacts.onTrack}
                variant="ontrack"
                icon={<CheckCircle size={20} strokeWidth={1.5} />}
              />
            )}
        </div>
      )}
    </PageContainer>
  );
}
