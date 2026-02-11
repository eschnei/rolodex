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
 * Badge component with subtle borders for glass surfaces
 *
 * Features:
 * - Six variants: default, secondary, accent, success, warning, danger
 * - Compact sizing with rounded-full design
 * - Subtle borders for definition on glass backgrounds
 * - Follows design system typography and colors
 */
export function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-bg-inset text-text-secondary border border-[rgba(0,0,0,0.08)]',
    secondary: 'bg-bg-hover text-text-primary border border-[rgba(0,0,0,0.08)]',
    accent: 'bg-accent-subtle text-accent-text border border-[rgba(91,91,214,0.2)]',
    success: 'bg-status-ontrack-bg text-status-ontrack-text border border-[rgba(48,164,108,0.2)]',
    warning: 'bg-status-due-bg text-status-due-text border border-[rgba(240,158,0,0.2)]',
    danger: 'bg-status-overdue-bg text-status-overdue-text border border-[rgba(229,72,77,0.2)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-[10px] py-[3px]',
        'text-[11px] font-semibold leading-tight',
        'rounded-full whitespace-nowrap',
        'tracking-[0.2px]',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
