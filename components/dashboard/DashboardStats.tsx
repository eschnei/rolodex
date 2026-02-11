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
    default: 'bg-bg-secondary text-text-primary',
    overdue: 'bg-status-overdue-bg text-status-overdue-text',
    due: 'bg-status-due-bg text-status-due-text',
    ontrack: 'bg-status-ontrack-bg text-status-ontrack-text',
    streak: 'bg-accent-subtle text-accent-text',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-4 rounded-lg border border-border-subtle',
        'transition-all duration-fast',
        variantStyles[variant]
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-h2 font-semibold">{value}</span>
      </div>
      <span className="type-caption text-center">{label}</span>
    </div>
  );
}

/**
 * Dashboard stats component showing key metrics
 * - Total contacts
 * - Overdue count (red)
 * - Due today/soon count (amber)
 * - On track count (green)
 * - Current streak
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
