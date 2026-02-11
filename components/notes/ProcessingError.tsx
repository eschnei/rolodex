'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface ProcessingErrorProps {
  /** Error message to display */
  message: string;
  /** Whether the error is retryable */
  retryable?: boolean;
  /** Callback when retry is clicked */
  onRetry?: () => void;
  /** Callback when dismiss is clicked */
  onDismiss?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * Error display for AI processing failures
 *
 * Features:
 * - User-friendly error messages
 * - Retry button for retryable errors
 * - Dismiss button to hide the error
 * - Note save is never blocked - this is informational only
 */
export function ProcessingError({
  message,
  retryable = true,
  onRetry,
  onDismiss,
  className,
}: ProcessingErrorProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg',
        'bg-status-overdue-bg border border-status-overdue/20',
        className
      )}
      role="alert"
    >
      {/* Icon */}
      <AlertCircle
        className="h-5 w-5 text-status-overdue flex-shrink-0 mt-0.5"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="type-body text-status-overdue-text">
          {message}
        </p>
        <p className="type-small text-text-tertiary mt-1">
          Your note was saved successfully. Summary update will be retried automatically.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {retryable && onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="text-status-overdue-text hover:text-status-overdue"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-text-tertiary"
          >
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Inline error indicator for compact spaces
 */
export function InlineProcessingError({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-status-overdue-text',
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 text-status-overdue" />
      <span className="type-small">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="type-small text-accent hover:text-accent-hover underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}
