'use client';

import { cn } from '@/lib/utils/cn';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProcessingIndicator } from '@/components/ui/ProcessingIndicator';

interface ContactSummaryProps {
  /** The AI-generated summary text */
  summary: string | null;
  /** When the contact was last updated */
  updatedAt: string;
  /** Whether AI processing is in progress */
  isProcessing?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Contact Summary Component - HERO treatment
 *
 * The most prominent element on the contact detail page.
 * Features:
 * - Inset glass card with accent left border
 * - Prominent styling for summary text
 * - Last updated timestamp
 * - Empty state prompting note addition
 */
export function ContactSummary({
  summary,
  updatedAt,
  isProcessing = false,
  className,
}: ContactSummaryProps) {
  // Loading/processing state
  if (isProcessing) {
    return (
      <div
        className={cn(
          'p-5 md:p-6',
          'rounded-[16px]',
          'bg-[rgba(255,255,255,0.45)]',
          'backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)]',
          'border border-[rgba(255,255,255,0.25)]',
          'border-l-[3px] border-l-accent',
          className
        )}
        aria-label="AI-generated summary loading"
      >
        <div className="flex items-center gap-2 mb-4">
          <ProcessingIndicator size="sm" label="Updating summary" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  // Empty state
  if (!summary) {
    return (
      <div
        className={cn(
          'p-5 md:p-6',
          'rounded-[16px]',
          'bg-[rgba(255,255,255,0.45)]',
          'backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)]',
          'border border-[rgba(255,255,255,0.25)]',
          'border-l-[3px] border-l-[rgba(255,255,255,0.3)]',
          className
        )}
        aria-label="AI-generated summary"
      >
        <p className="text-[14px] italic text-[rgba(26,26,28,0.45)]">
          Add notes to generate a summary
        </p>
      </div>
    );
  }

  // Summary display - HERO treatment
  return (
    <div
      className={cn(
        'p-5 md:p-6',
        'rounded-[16px]',
        'bg-[rgba(255,255,255,0.45)]',
        'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
        'border border-[rgba(255,255,255,0.25)]',
        'border-l-[3px] border-l-accent',
        'shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]',
        className
      )}
      aria-label="AI-generated summary"
    >
      {/* Section label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-[rgba(26,26,28,0.45)]">
          Summary
        </span>
      </div>

      {/* Summary text */}
      <p className="text-[15px] leading-[1.7] text-[rgba(26,26,28,0.95)]">
        {summary}
      </p>

      {/* Last updated */}
      <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.25)]">
        <p className="text-[12px] text-[rgba(26,26,28,0.45)]">
          Last updated{' '}
          <RelativeTime date={updatedAt} className="text-[rgba(26,26,28,0.45)]" />
        </p>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for ContactSummary
 */
export function ContactSummarySkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        'p-5 md:p-6',
        'rounded-[16px]',
        'bg-[rgba(255,255,255,0.45)]',
        'backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)]',
        'border border-[rgba(255,255,255,0.25)]',
        'border-l-[3px] border-l-[rgba(255,255,255,0.3)]',
        className
      )}
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.25)]">
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
