'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { DashboardContact } from '@/lib/actions/dashboard';
import { getTagStyles } from '@/lib/utils/tagColors';

interface DashboardContactsListProps {
  contacts: DashboardContact[];
  className?: string;
}

/**
 * Dashboard contacts list with dark glass treatment
 * Shows all contacts with action items prioritized at top
 *
 * Enhanced layout per contact row:
 * - Name + role/company on second line
 * - 1-line AI summary snippet (truncated)
 * - Status badges: "Last: Xd" and "Next: Xd"
 * - Tags with deterministic colors
 */
export function DashboardContactsList({
  contacts,
  className,
}: DashboardContactsListProps) {
  if (contacts.length === 0) {
    return null;
  }

  // Sort contacts: overdue first, then due_today, then due_soon, then on_track
  const sortedContacts = [...contacts].sort((a, b) => {
    const statusOrder = {
      overdue: 0,
      due_today: 1,
      due_soon: 2,
      on_track: 3,
    };
    const aOrder = statusOrder[a.cadenceInfo.status];
    const bOrder = statusOrder[b.cadenceInfo.status];

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    // Within same status, sort by urgency
    if (a.cadenceInfo.status === 'overdue') {
      return b.cadenceInfo.daysOverdue - a.cadenceInfo.daysOverdue;
    }
    return a.cadenceInfo.daysUntilDue - b.cadenceInfo.daysUntilDue;
  });

  return (
    <div
      className={cn(
        'rounded-[16px]',
        'bg-[rgba(255,255,255,0.08)]',
        'backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]',
        'border border-[rgba(255,255,255,0.12)]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
        'overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.7)]">
          Your Contacts
        </h3>
        <Link
          href="/contacts/new"
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5',
            'bg-transparent text-[rgba(255,255,255,0.9)]',
            'border border-[rgba(255,255,255,0.3)]',
            'rounded-[8px] text-[11px] font-semibold uppercase tracking-[0.5px]',
            'hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.5)]',
            'transition-all duration-150'
          )}
        >
          <Plus size={12} strokeWidth={2.5} />
          Contact
        </Link>
      </div>

      {/* Contact list */}
      <div className="divide-y divide-[rgba(255,255,255,0.06)]">
        {sortedContacts.map((contact) => (
          <ContactRow key={contact.id} contact={contact} />
        ))}
      </div>
    </div>
  );
}

function ContactRow({ contact }: { contact: DashboardContact }) {
  const { cadenceInfo } = contact;
  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  // Calculate last contacted display
  const lastLabel =
    cadenceInfo.daysSinceContact !== null
      ? cadenceInfo.daysSinceContact === 0
        ? 'Today'
        : `${cadenceInfo.daysSinceContact}d`
      : 'Never';

  // Calculate next due display
  const nextLabel =
    cadenceInfo.status === 'overdue'
      ? `-${cadenceInfo.daysOverdue}d`
      : cadenceInfo.daysUntilDue === 0
        ? 'Today'
        : `${cadenceInfo.daysUntilDue}d`;

  // Determine badge colors based on status
  const statusColors = {
    overdue: {
      bg: 'bg-[rgba(229,72,77,0.2)]',
      border: 'border-[rgba(229,72,77,0.4)]',
      text: 'text-[rgba(255,255,255,0.95)]',
    },
    due_today: {
      bg: 'bg-[rgba(229,72,77,0.2)]',
      border: 'border-[rgba(229,72,77,0.4)]',
      text: 'text-[rgba(255,255,255,0.95)]',
    },
    due_soon: {
      bg: 'bg-[rgba(240,158,0,0.2)]',
      border: 'border-[rgba(240,158,0,0.4)]',
      text: 'text-[rgba(255,255,255,0.95)]',
    },
    on_track: {
      bg: 'bg-[rgba(48,164,108,0.2)]',
      border: 'border-[rgba(48,164,108,0.4)]',
      text: 'text-[rgba(255,255,255,0.95)]',
    },
  };

  const colors = statusColors[cadenceInfo.status];

  // Get summary snippet (truncated to ~80 chars for single line)
  const summarySnippet = contact.ai_summary
    ? contact.ai_summary.slice(0, 80) +
      (contact.ai_summary.length > 80 ? '...' : '')
    : null;

  // Role/company subtitle
  const subtitle =
    contact.role && contact.company
      ? `${contact.role} at ${contact.company}`
      : contact.role || contact.company || null;

  return (
    <Link
      href={`/contacts/${contact.id}`}
      className={cn(
        'block px-4 py-3',
        'hover:bg-[rgba(255,255,255,0.04)]',
        'transition-colors duration-150'
      )}
    >
      {/* Top row: Name + Tags + Status badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Name row with tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] font-medium text-[rgba(255,255,255,0.95)] truncate">
              {fullName}
            </p>
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex gap-1 flex-shrink-0">
                {contact.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium border"
                    style={getTagStyles(tag)}
                  >
                    {tag}
                  </span>
                ))}
                {contact.tags.length > 2 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium text-[rgba(255,255,255,0.5)]">
                    +{contact.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Role/Company subtitle */}
          {subtitle && (
            <p className="text-[12px] text-[rgba(255,255,255,0.5)] truncate mt-0.5">
              {subtitle}
            </p>
          )}

          {/* AI Summary snippet */}
          {summarySnippet && (
            <p className="text-[12px] italic text-[rgba(255,255,255,0.4)] truncate mt-1">
              {summarySnippet}
            </p>
          )}
        </div>

        {/* Status badges: Last and Next */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Last contacted badge */}
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5',
              'text-[10px] font-medium',
              'rounded-full border',
              'bg-[rgba(255,255,255,0.08)]',
              'border-[rgba(255,255,255,0.2)]',
              'text-[rgba(255,255,255,0.7)]'
            )}
          >
            Last: {lastLabel}
          </span>

          {/* Next due badge */}
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5',
              'text-[10px] font-medium',
              'rounded-full border',
              colors.bg,
              colors.border,
              colors.text
            )}
          >
            Next: {nextLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
