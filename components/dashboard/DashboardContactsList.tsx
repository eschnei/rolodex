'use client';

import Link from 'next/link';
import { AlertCircle, Clock, CheckCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { DashboardContact } from '@/lib/actions/dashboard';

interface DashboardContactsListProps {
  contacts: DashboardContact[];
  className?: string;
}

/**
 * Dashboard contacts list with dark glass treatment
 * Shows all contacts with action items prioritized at top
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

  const statusConfig = {
    overdue: {
      icon: AlertCircle,
      color: 'text-status-overdue',
      bg: 'bg-[rgba(229,72,77,0.15)]',
      label: `${cadenceInfo.daysOverdue}d overdue`,
    },
    due_today: {
      icon: AlertCircle,
      color: 'text-status-overdue',
      bg: 'bg-[rgba(229,72,77,0.15)]',
      label: 'Due today',
    },
    due_soon: {
      icon: Clock,
      color: 'text-status-due',
      bg: 'bg-[rgba(240,158,0,0.15)]',
      label: `${cadenceInfo.daysUntilDue}d left`,
    },
    on_track: {
      icon: CheckCircle,
      color: 'text-status-ontrack',
      bg: 'bg-[rgba(48,164,108,0.15)]',
      label: 'On track',
    },
  };

  const config = statusConfig[cadenceInfo.status];
  const StatusIcon = config.icon;

  return (
    <Link
      href={`/contacts/${contact.id}`}
      className={cn(
        'flex items-center justify-between gap-3',
        'px-4 py-3',
        'hover:bg-[rgba(255,255,255,0.04)]',
        'transition-colors duration-150'
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-[rgba(255,255,255,0.95)] truncate">
          {fullName}
        </p>
        {(contact.company || contact.role) && (
          <p className="text-[12px] text-[rgba(255,255,255,0.5)] truncate">
            {contact.role && contact.company
              ? `${contact.role} at ${contact.company}`
              : contact.company || contact.role}
          </p>
        )}
      </div>

      <div
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-full',
          config.bg
        )}
      >
        <StatusIcon size={12} className={config.color} strokeWidth={2} />
        <span className={cn('text-[11px] font-medium', config.color)}>
          {config.label}
        </span>
      </div>
    </Link>
  );
}
