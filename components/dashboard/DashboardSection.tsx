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
 * Dashboard section with status-tinted glass cards
 *
 * Features:
 * - Status-tinted glass backgrounds (overdue red, due amber)
 * - 11px uppercase section headers
 * - Count badge with matching status color
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
      container: '',
      header: 'text-[rgba(26,26,28,0.95)]',
      count: 'bg-[rgba(255,255,255,0.5)] text-[rgba(26,26,28,0.65)]',
    },
    overdue: {
      container: cn(
        'p-4 rounded-[16px]',
        'bg-[rgba(229,72,77,0.08)]',
        'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
        'border border-[rgba(229,72,77,0.2)]',
        'border-l-[3px] border-l-[rgba(229,72,77,0.6)]'
      ),
      header: 'text-status-overdue-text',
      count: 'bg-status-overdue-bg text-status-overdue-text border border-[rgba(229,72,77,0.2)]',
    },
    due: {
      container: cn(
        'p-4 rounded-[16px]',
        'bg-[rgba(240,158,0,0.08)]',
        'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
        'border border-[rgba(240,158,0,0.2)]',
        'border-l-[3px] border-l-[rgba(240,158,0,0.5)]'
      ),
      header: 'text-status-due-text',
      count: 'bg-status-due-bg text-status-due-text border border-[rgba(240,158,0,0.2)]',
    },
    ontrack: {
      container: cn(
        'p-4 rounded-[16px]',
        'bg-[rgba(48,164,108,0.08)]',
        'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
        'border border-[rgba(48,164,108,0.2)]',
        'border-l-[3px] border-l-[rgba(48,164,108,0.5)]'
      ),
      header: 'text-status-ontrack-text',
      count: 'bg-status-ontrack-bg text-status-ontrack-text border border-[rgba(48,164,108,0.2)]',
    },
  };

  const styles = variantStyles[variant];

  return (
    <section className={cn('space-y-3', styles.container, className)}>
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <span className={cn('shrink-0', styles.header)}>{icon}</span>
          )}
          <div>
            {/* 11px uppercase header */}
            <h2 className={cn('text-[11px] font-semibold uppercase tracking-[0.6px]', styles.header)}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-[12px] text-[rgba(26,26,28,0.45)] mt-0.5">{subtitle}</p>
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
          <div
            className={cn(
              'p-5 text-center',
              'rounded-[16px]',
              'bg-[rgba(255,255,255,0.6)]',
              'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
              'border border-[rgba(255,255,255,0.25)]'
            )}
          >
            <p className="text-[13px] text-[rgba(26,26,28,0.45)]">
              {emptyMessage}
            </p>
          </div>
        )
      )}
    </section>
  );
}
