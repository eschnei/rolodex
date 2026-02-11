import { cn } from '@/lib/utils/cn';
import { type CadenceStatus } from '@/lib/utils/cadence';

interface StatusBadgeProps {
  status: CadenceStatus;
  label?: string;
  className?: string;
}

/**
 * Status badge component for displaying contact cadence status
 * Colors based on status:
 * - overdue: red (status-overdue-bg, status-overdue-text)
 * - due: amber (status-due-bg, status-due-text)
 * - ontrack: green (status-ontrack-bg, status-ontrack-text)
 */
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const statusLabels: Record<CadenceStatus, string> = {
    overdue: 'Overdue',
    due: 'Due Soon',
    ontrack: 'On Track',
  };

  const statusColors: Record<CadenceStatus, string> = {
    overdue: 'bg-status-overdue-bg text-status-overdue-text',
    due: 'bg-status-due-bg text-status-due-text',
    ontrack: 'bg-status-ontrack-bg text-status-ontrack-text',
  };

  const displayLabel = label || statusLabels[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5',
        'text-[11px] font-medium leading-tight',
        'rounded-full whitespace-nowrap',
        statusColors[status],
        className
      )}
    >
      {displayLabel}
    </span>
  );
}
