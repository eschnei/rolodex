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
  variant?: 'default' | 'overdue' | 'due' | 'ontrack' | 'streak';
}

function StatCard({ label, value, icon, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: cn(
      'bg-[rgba(255,255,255,0.6)]',
      'border-[rgba(255,255,255,0.25)]',
      'text-[rgba(26,26,28,0.95)]'
    ),
    overdue: cn(
      'bg-status-overdue-bg',
      'border-[rgba(229,72,77,0.2)]',
      'text-status-overdue-text'
    ),
    due: cn(
      'bg-status-due-bg',
      'border-[rgba(240,158,0,0.2)]',
      'text-status-due-text'
    ),
    ontrack: cn(
      'bg-status-ontrack-bg',
      'border-[rgba(48,164,108,0.2)]',
      'text-status-ontrack-text'
    ),
    streak: cn(
      'bg-accent-subtle',
      'border-[rgba(91,91,214,0.2)]',
      'text-accent-text'
    ),
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'p-4 rounded-[16px] border',
        'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
        'transition-all duration-150',
        variantStyles[variant]
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[22px] font-semibold">{value}</span>
      </div>
      <span className="text-[12px] font-medium text-center opacity-80">{label}</span>
    </div>
  );
}

/**
 * Dashboard stats with glass treatment
 */
export function DashboardStats({ stats, className }: DashboardStatsProps) {
  const needsAttention = stats.overdueCount + stats.dueTodayCount;

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
      <StatCard
        label="Total Contacts"
        value={stats.totalContacts}
        icon={<Users size={18} strokeWidth={1.5} />}
        variant="default"
      />
      <StatCard
        label="Need Attention"
        value={needsAttention}
        icon={<AlertCircle size={18} strokeWidth={1.5} />}
        variant={needsAttention > 0 ? 'overdue' : 'default'}
      />
      <StatCard
        label="Due Soon"
        value={stats.dueSoonCount}
        icon={<Clock size={18} strokeWidth={1.5} />}
        variant={stats.dueSoonCount > 0 ? 'due' : 'default'}
      />
      <StatCard
        label="Day Streak"
        value={stats.streak}
        icon={<Flame size={18} strokeWidth={1.5} />}
        variant={stats.streak > 0 ? 'streak' : 'default'}
      />
    </div>
  );
}
