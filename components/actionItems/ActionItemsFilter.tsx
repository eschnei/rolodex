'use client';

import { cn } from '@/lib/utils/cn';

interface ActionItemsFilterProps {
  /** Whether to show only open items */
  showOpenOnly: boolean;
  /** Callback when filter changes */
  onChange: (showOpenOnly: boolean) => void;
  /** Count of open items */
  openCount?: number;
  /** Total count of items */
  totalCount?: number;
  /** Additional className */
  className?: string;
}

/**
 * Action items filter toggle
 *
 * Options:
 * - Open Only: Show only incomplete action items
 * - All: Show all action items
 */
export function ActionItemsFilter({
  showOpenOnly,
  onChange,
  openCount,
  totalCount,
  className,
}: ActionItemsFilterProps) {
  const options: { value: boolean; label: string; count: number | undefined }[] = [
    { value: true, label: 'Open', count: openCount },
    { value: false, label: 'All', count: totalCount },
  ];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1',
        'bg-bg-inset rounded-md',
        className
      )}
      role="tablist"
      aria-label="Filter action items"
    >
      {options.map((option) => (
        <button
          key={String(option.value)}
          role="tab"
          aria-selected={showOpenOnly === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 rounded-sm',
            'type-small font-medium',
            'transition-all duration-fast',
            'flex items-center gap-1.5',
            showOpenOnly === option.value
              ? 'bg-bg-secondary text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          {option.label}
          {option.count !== undefined && (
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-medium',
                showOpenOnly === option.value
                  ? 'bg-accent-subtle text-accent-text'
                  : 'bg-bg-hover text-text-tertiary'
              )}
            >
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
