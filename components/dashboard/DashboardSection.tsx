'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { DashboardContact } from '@/lib/actions/dashboard';
import { DashboardItem } from './DashboardItem';

interface DashboardSectionProps {
  title: string;
  subtitle?: string;
  contacts: DashboardContact[];
  emptyMessage?: string;
  variant?: 'default' | 'overdue' | 'due' | 'ontrack';
  icon?: ReactNode;
  className?: string;
  showEmpty?: boolean;
}

/**
 * Dashboard section component for grouping contacts
 *
 * Features:
 * - Header with title, optional subtitle, and count badge
 * - List of DashboardItem components
 * - Optional empty state message
 * - Variant styling for visual hierarchy
 */
export function DashboardSection({
  title,
  subtitle,
  contacts,
  emptyMessage,
  variant = 'default',
  icon,
  className,
  showEmpty = false,
}: DashboardSectionProps) {
  // Don't render if no contacts and not showing empty state
  if (contacts.length === 0 && !showEmpty) {
    return null;
  }

  const variantStyles = {
    default: {
      header: 'text-text-primary',
      count: 'bg-bg-inset text-text-secondary',
    },
    overdue: {
      header: 'text-status-overdue-text',
      count: 'bg-status-overdue-bg text-status-overdue-text',
    },
    due: {
      header: 'text-status-due-text',
      count: 'bg-status-due-bg text-status-due-text',
    },
    ontrack: {
      header: 'text-status-ontrack-text',
      count: 'bg-status-ontrack-bg text-status-ontrack-text',
    },
  };

  const styles = variantStyles[variant];

  return (
    <section className={cn('space-y-3', className)}>
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <span className={cn('shrink-0', styles.header)}>{icon}</span>
          )}
          <div>
            <h2 className={cn('type-h3', styles.header)}>{title}</h2>
            {subtitle && (
              <p className="type-small text-text-tertiary">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Count badge */}
        <span
          className={cn(
            'inline-flex items-center justify-center',
            'min-w-[28px] h-7 px-2',
            'text-[13px] font-medium',
            'rounded-full',
            styles.count
          )}
        >
          {contacts.length}
        </span>
      </div>

      {/* Contact list */}
      {contacts.length > 0 ? (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <DashboardItem key={contact.id} contact={contact} />
          ))}
        </div>
      ) : (
        showEmpty &&
        emptyMessage && (
          <div className="p-5 bg-bg-secondary border border-border-subtle rounded-lg">
            <p className="type-small text-text-tertiary text-center">
              {emptyMessage}
            </p>
          </div>
        )
      )}
    </section>
  );
}
