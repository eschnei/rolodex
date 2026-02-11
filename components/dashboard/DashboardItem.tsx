'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils/cn';
import { DashboardContact } from '@/lib/actions/dashboard';
import {
  getDetailedCadenceLabel,
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
      return 'bg-status-overdue-bg text-status-overdue-text border border-[rgba(229,72,77,0.2)]';
    case 'due_today':
    case 'due_soon':
      return 'bg-status-due-bg text-status-due-text border border-[rgba(240,158,0,0.2)]';
    case 'on_track':
      return 'bg-status-ontrack-bg text-status-ontrack-text border border-[rgba(48,164,108,0.2)]';
    default:
      return 'bg-[rgba(255,255,255,0.5)] text-[rgba(26,26,28,0.45)]';
  }
}

/**
 * Dashboard contact item with glass treatment
 *
 * Layout:
 * - Avatar with status indicator | Name + Company + Summary | Status badge + Last contacted
 * - Glass card with hover elevation
 */
export function DashboardItem({ contact, className }: DashboardItemProps) {
  const { cadenceInfo } = contact;
  const status = cadenceInfo.status;

  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  const subtitle = getSubtitle(contact);
  const cadenceLabel = getDetailedCadenceLabel(status);

  // Get first line of AI summary as a snippet
  const summarySnippet = contact.ai_summary
    ? (contact.ai_summary.split('\n')[0] ?? '').slice(0, 100) +
      (contact.ai_summary.length > 100 ? '...' : '')
    : null;

  // Format last contacted
  const lastContactedLabel = cadenceInfo.daysSinceContact !== null
    ? `Last: ${cadenceInfo.daysSinceContact === 0 ? 'Today' : cadenceInfo.daysSinceContact === 1 ? 'Yesterday' : `${cadenceInfo.daysSinceContact}d ago`}`
    : 'Never contacted';

  return (
    <Link
      href={`/contacts/${contact.id}`}
      className={cn(
        'group block',
        'p-4',
        'rounded-[12px]',
        'bg-[rgba(255,255,255,0.6)]',
        'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
        'border border-[rgba(255,255,255,0.25)]',
        'shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
        'transition-all duration-150 ease-out',
        'hover:bg-[rgba(255,255,255,0.75)]',
        'hover:translate-y-[-1px]',
        'hover:shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        className
      )}
    >
      {/* Grid layout: Avatar | Content | Status */}
      <div className="grid grid-cols-[40px_1fr_auto] gap-4 items-start">
        {/* Avatar with status indicator */}
        <div className="relative shrink-0">
          <Avatar firstName={contact.first_name} lastName={contact.last_name} />
          <div
            className={cn(
              'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full',
              'border-2 border-[rgba(255,255,255,0.8)]',
              getStatusColor(status)
            )}
            aria-hidden="true"
          />
        </div>

        {/* Contact info */}
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-[rgba(26,26,28,0.95)] truncate">
                {fullName}
              </p>
              {subtitle && (
                <p className="text-[13px] text-[rgba(26,26,28,0.65)] truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Summary snippet */}
          {summarySnippet && (
            <p className="text-[13px] italic text-[rgba(26,26,28,0.45)] line-clamp-2 mt-1">
              {summarySnippet}
            </p>
          )}
        </div>

        {/* Status column */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {/* Cadence badge */}
          <span
            className={cn(
              'inline-flex items-center px-[10px] py-[3px]',
              'text-[11px] font-semibold leading-tight',
              'rounded-full whitespace-nowrap',
              getBadgeStyles(status)
            )}
          >
            {cadenceLabel}
          </span>
          <span className="text-[11px] font-mono text-[rgba(26,26,28,0.45)]">
            {lastContactedLabel}
          </span>
        </div>
      </div>
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
