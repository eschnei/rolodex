'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow, format, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils/cn';

interface RelativeTimeProps {
  /** ISO date string or Date object */
  date: string | Date;
  /** Additional className */
  className?: string;
  /** Show full date in tooltip */
  showTooltip?: boolean;
}

/**
 * Display relative time (e.g., "3 days ago") with optional tooltip showing full date
 * Uses date-fns for formatting
 */
export function RelativeTime({
  date,
  className,
  showTooltip = true,
}: RelativeTimeProps) {
  const [mounted, setMounted] = useState(false);

  // Only render on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return <span className={cn('text-text-tertiary', className)}>Invalid date</span>;
  }

  // During SSR or before mount, show a placeholder
  if (!mounted) {
    return (
      <span className={cn('text-text-primary', className)}>
        {format(dateObj, 'MMM d, yyyy')}
      </span>
    );
  }

  const relativeTime = formatDistanceToNow(dateObj, { addSuffix: true });
  const fullDate = format(dateObj, 'EEEE, MMMM d, yyyy \'at\' h:mm a');

  if (showTooltip) {
    return (
      <span
        className={cn('cursor-help border-b border-dotted border-text-tertiary', className)}
        title={fullDate}
      >
        {relativeTime}
      </span>
    );
  }

  return <span className={className}>{relativeTime}</span>;
}

/**
 * Format a date as relative time string
 * Utility function for use outside of React components
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return 'Invalid date';
  }

  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format a date as a full date string
 * Utility function for use outside of React components
 */
export function getFullDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return 'Invalid date';
  }

  return format(dateObj, 'EEEE, MMMM d, yyyy \'at\' h:mm a');
}
