'use client';

import { cn } from '@/lib/utils/cn';
import { type ReactNode } from 'react';

export type BadgeVariant = 'default' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Badge content */
  children: ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * Badge component for displaying labels, tags, and categorizations
 *
 * Features:
 * - Six variants: default, secondary, accent, success, warning, danger
 * - Compact sizing with rounded-full design
 * - Follows design system typography and colors
 */
export function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-bg-inset text-text-secondary',
    secondary: 'bg-bg-hover text-text-primary',
    accent: 'bg-accent-subtle text-accent-text',
    success: 'bg-status-ontrack-bg text-status-ontrack-text',
    warning: 'bg-status-due-bg text-status-due-text',
    danger: 'bg-status-overdue-bg text-status-overdue-text',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5',
        'text-[11px] font-medium leading-tight',
        'rounded-full whitespace-nowrap',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
