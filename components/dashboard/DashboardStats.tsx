'use client';

import { Users, AlertCircle, Clock, Flame } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { DashboardStats as StatsType } from '@/lib/actions/dashboard';

interface DashboardStatsProps {
  stats: StatsType;
  className?: string;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-6 px-4 rounded-[16px] border',
        'bg-[rgba(255,255,255,0.08)]',
        'backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]',
        'border-[rgba(255,255,255,0.12)]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
        'transition-all duration-150'
      )}
    >
      <div className="flex items-center gap-2 mb-1 text-[rgba(255,255,255,0.95)]">
        {icon}
        <span className="text-[28px] font-semibold">{value}</span>
      </div>
      <span className="text-[12px] font-medium text-center text-[rgba(255,255,255,0.7)]">{label}</span>
    </div>
  );
}

/**
 * Dashboard stats with dark glass treatment matching sidebar
 */
export function DashboardStats({ stats, className }: DashboardStatsProps) {
  const needsAttention = stats.overdueCount + stats.dueTodayCount;

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
      <StatCard
        label="Total Contacts"
        value={stats.totalContacts}
        icon={<Users size={18} strokeWidth={1.5} />}
      />
      <StatCard
        label="Need Attention"
        value={needsAttention}
        icon={<AlertCircle size={18} strokeWidth={1.5} />}
      />
      <StatCard
        label="Due Soon"
        value={stats.dueSoonCount}
        icon={<Clock size={18} strokeWidth={1.5} />}
      />
      <StatCard
        label="Day Streak"
        value={stats.streak}
        icon={<Flame size={18} strokeWidth={1.5} />}
      />
    </div>
  );
}
