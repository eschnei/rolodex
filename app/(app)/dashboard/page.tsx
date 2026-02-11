import Link from 'next/link';
import { Plus } from 'lucide-react';
import {
  DashboardStats,
  DashboardContactsList,
  EmptyDashboard,
} from '@/components/dashboard';
import { getDashboardData } from '@/lib/actions/dashboard';
import { cn } from '@/lib/utils/cn';

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
      {/* Header with Add Contact */}
      <div className="flex items-center justify-end mb-4">
        <Link
          href="/contacts/new"
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2',
            'bg-accent text-text-inverse',
            'rounded-[12px] text-[13px] font-medium',
            'hover:bg-accent-hover hover:translate-y-[-1px]',
            'transition-all duration-150',
            'shadow-[0_2px_8px_rgba(91,91,214,0.3)]'
          )}
        >
          <Plus size={16} strokeWidth={2} />
          Add Contact
        </Link>
      </div>

      {/* Stats grid */}
      {hasAnyContacts && <DashboardStats stats={stats} className="mb-4" />}

      {/* Empty state when no contacts */}
      {!hasAnyContacts && <EmptyDashboard hasContacts={false} />}

      {/* Contacts list with action items prioritized */}
      {hasAnyContacts && <DashboardContactsList contacts={allContacts} />}
    </div>
  );
}
