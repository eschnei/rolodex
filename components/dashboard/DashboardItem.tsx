'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils/cn';
import { DashboardContact } from '@/lib/actions/dashboard';
import {
  getDetailedCadenceLabel,
  getDetailedCadenceMessage,
  DetailedCadenceStatus,
} from '@/lib/utils/cadence';

interface DashboardItemProps {
  contact: DashboardContact;
  className?: string;
}

/**
 * Get status indicator color based on cadence status
 */
function getStatusColor(status: DetailedCadenceStatus): string {
  switch (status) {
    case 'overdue':
      return 'bg-status-overdue';
    case 'due_today':
    case 'due_soon':
      return 'bg-status-due';
    case 'on_track':
      return 'bg-status-ontrack';
    default:
      return 'bg-text-tertiary';
  }
}

/**
 * Get badge styles based on cadence status
 */
function getBadgeStyles(status: DetailedCadenceStatus): string {
  switch (status) {
    case 'overdue':
      return 'bg-status-overdue-bg text-status-overdue-text';
    case 'due_today':
    case 'due_soon':
      return 'bg-status-due-bg text-status-due-text';
    case 'on_track':
      return 'bg-status-ontrack-bg text-status-ontrack-text';
    default:
      return 'bg-bg-inset text-text-tertiary';
  }
}

/**
 * Dashboard contact item component
 *
 * Displays:
 * - Avatar with status indicator
 * - Name and company/role
 * - Days since contact
 * - Cadence label badge
 * - AI summary snippet
 */
export function DashboardItem({ contact, className }: DashboardItemProps) {
  const { cadenceInfo } = contact;
  const status = cadenceInfo.status;

  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  const subtitle = getSubtitle(contact);
  const cadenceMessage = getDetailedCadenceMessage(cadenceInfo);
  const cadenceLabel = getDetailedCadenceLabel(status);

  // Get first line of AI summary as a snippet
  const summarySnippet = contact.ai_summary
    ? (contact.ai_summary.split('\n')[0] ?? '').slice(0, 100) +
      (contact.ai_summary.length > 100 ? '...' : '')
    : null;

  return (
    <Link
      href={`/contacts/${contact.id}`}
      className={cn(
        'group flex items-start gap-4 p-4',
        'bg-bg-secondary border border-border-subtle rounded-lg',
        'hover:bg-bg-hover hover:border-border-primary',
        'transition-all duration-fast',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        className
      )}
    >
      {/* Avatar with status indicator */}
      <div className="relative shrink-0">
        <Avatar firstName={contact.first_name} lastName={contact.last_name} />
        <div
          className={cn(
            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-secondary',
            getStatusColor(status)
          )}
          aria-hidden="true"
        />
      </div>

      {/* Contact info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <p className="type-body text-text-primary font-medium truncate">
              {fullName}
            </p>
            {subtitle && (
              <p className="type-small text-text-secondary truncate">
                {subtitle}
              </p>
            )}
          </div>

          {/* Cadence badge */}
          <span
            className={cn(
              'shrink-0 inline-flex items-center px-2 py-0.5',
              'text-[11px] font-medium leading-tight',
              'rounded-full whitespace-nowrap',
              getBadgeStyles(status)
            )}
          >
            {cadenceLabel}
          </span>
        </div>

        {/* Days info and summary */}
        <div className="mt-2">
          <p className="type-small text-text-tertiary mb-1">
            {cadenceInfo.daysSinceContact !== null
              ? `Last contact: ${cadenceInfo.daysSinceContact} day${cadenceInfo.daysSinceContact === 1 ? '' : 's'} ago`
              : 'Never contacted'}{' '}
            <span className="font-medium">({cadenceMessage})</span>
          </p>

          {summarySnippet && (
            <p className="type-small text-text-secondary line-clamp-2">
              {summarySnippet}
            </p>
          )}
        </div>
      </div>

      {/* Chevron indicator */}
      <ChevronRight
        size={20}
        className="shrink-0 text-text-tertiary group-hover:text-text-secondary transition-colors"
        strokeWidth={1.5}
      />
    </Link>
  );
}

/**
 * Generate subtitle from company and role
 */
function getSubtitle(contact: DashboardContact): string | null {
  const { company, role } = contact;

  if (role && company) {
    return `${role} at ${company}`;
  }

  if (role) {
    return role;
  }

  if (company) {
    return company;
  }

  return null;
}
