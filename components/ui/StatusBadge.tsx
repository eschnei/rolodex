import { cn } from '@/lib/utils/cn';
import { type CadenceStatus } from '@/lib/utils/cadence';

interface StatusBadgeProps {
  status: CadenceStatus;
  label?: string;
  className?: string;
}

/**
 * Status badge component with subtle borders for glass surfaces
 *
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
    overdue: 'bg-status-overdue-bg text-status-overdue-text border border-[rgba(229,72,77,0.2)]',
    due: 'bg-status-due-bg text-status-due-text border border-[rgba(240,158,0,0.2)]',
    ontrack: 'bg-status-ontrack-bg text-status-ontrack-text border border-[rgba(48,164,108,0.2)]',
  };

  const displayLabel = label || statusLabels[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-[10px] py-[3px]',
        'text-[11px] font-semibold leading-tight',
        'rounded-full whitespace-nowrap',
        'tracking-[0.2px]',
        statusColors[status],
        className
      )}
      aria-label={`Status: ${displayLabel}`}
    >
      {displayLabel}
    </span>
  );
}
