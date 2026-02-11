'use client';

import { cn } from '@/lib/utils/cn';

interface ProcessingIndicatorProps {
  /** Additional className */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional label */
  label?: string;
}

/**
 * Subtle pulsing animation indicator for AI processing
 *
 * Features:
 * - Three dots with staggered pulse animation
 * - Size variants for different contexts
 * - Optional label text
 * - Uses accent color for brand consistency
 */
export function ProcessingIndicator({
  className,
  size = 'md',
  label,
}: ProcessingIndicatorProps) {
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const textSizes = {
    sm: 'text-[11px]',
    md: 'text-[12px]',
    lg: 'text-[13px]',
  };

  const gaps = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  return (
    <div
      className={cn('flex items-center', gaps[size], className)}
      role="status"
      aria-label={label || 'Processing'}
    >
      {/* Animated dots */}
      <div className={cn('flex items-center', gaps[size])}>
        <span
          className={cn(
            dotSizes[size],
            'rounded-full bg-accent animate-pulse'
          )}
          style={{ animationDelay: '0ms' }}
        />
        <span
          className={cn(
            dotSizes[size],
            'rounded-full bg-accent animate-pulse'
          )}
          style={{ animationDelay: '150ms' }}
        />
        <span
          className={cn(
            dotSizes[size],
            'rounded-full bg-accent animate-pulse'
          )}
          style={{ animationDelay: '300ms' }}
        />
      </div>

      {/* Optional label */}
      {label && (
        <span className={cn(textSizes[size], 'text-text-tertiary ml-1')}>
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * Inline processing indicator for use in text contexts
 */
export function InlineProcessingIndicator({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      className={cn('inline-flex items-center gap-1', className)}
      role="status"
      aria-label="Processing"
    >
      <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
      <span
        className="w-1 h-1 rounded-full bg-accent animate-pulse"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-1 h-1 rounded-full bg-accent animate-pulse"
        style={{ animationDelay: '300ms' }}
      />
    </span>
  );
}
