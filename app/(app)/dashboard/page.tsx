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
      <div className="p-4 md:p-6">
        <div className="p-5 bg-[rgba(229,72,77,0.15)] border border-[rgba(229,72,77,0.3)] rounded-[16px]">
          <p className="text-[14px] text-status-overdue">
            Failed to load dashboard data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 md:p-6">
        <EmptyDashboard hasContacts={false} />
      </div>
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
    <div className="p-4 md:p-6">
      {/* Stats grid */}
      {hasAnyContacts && <DashboardStats stats={stats} className="mb-4" />}

      {/* Empty state when no contacts */}
      {!hasAnyContacts && <EmptyDashboard hasContacts={false} />}

      {/* Contacts list with action items prioritized */}
      {hasAnyContacts && <DashboardContactsList contacts={allContacts} />}
    </div>
  );
}
