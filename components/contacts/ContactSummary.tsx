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
 * Contact Summary Component
 *
 * Displays the AI-generated "living summary" for a contact.
 * Follows brand guidelines: no "AI" labels - just shows content naturally.
 *
 * Features:
 * - Accent-left border styling (bg-bg-inset, border-l-2 border-accent)
 * - Last updated timestamp
 * - Empty state prompting note addition
 * - Loading/processing state with skeleton
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
          'bg-bg-inset border-l-2 border-accent rounded-r-lg p-4',
          className
        )}
      >
        <div className="flex items-center gap-2 mb-3">
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
          'bg-bg-inset border-l-2 border-border-subtle rounded-r-lg p-4',
          className
        )}
      >
        <p className="type-body text-text-tertiary italic">
          Add notes to generate a summary
        </p>
      </div>
    );
  }

  // Summary display
  return (
    <div
      className={cn(
        'bg-bg-inset border-l-2 border-accent rounded-r-lg p-4',
        className
      )}
    >
      {/* Summary text */}
      <p className="type-body text-text-primary leading-relaxed">
        {summary}
      </p>

      {/* Last updated */}
      <div className="mt-3 pt-3 border-t border-border-subtle">
        <p className="type-small text-text-tertiary">
          Last updated{' '}
          <RelativeTime date={updatedAt} className="text-text-tertiary" />
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
        'bg-bg-inset border-l-2 border-border-subtle rounded-r-lg p-4',
        className
      )}
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="mt-3 pt-3 border-t border-border-subtle">
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
