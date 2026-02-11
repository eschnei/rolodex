'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { calculateCadenceStatus, getCadenceLabel } from '@/lib/utils/cadence';
import { type Contact } from '@/lib/database.types';
import { cn } from '@/lib/utils/cn';

interface ContactListItemProps {
  contact: Contact;
  className?: string;
}

/**
 * Contact list item with summary-first layout and glass treatment
 *
 * Layout:
 * - Avatar (48px) | Name + Role + Summary | Status + Last contacted
 * - Glass card with hover elevation
 * - Summary snippet (2-line clamp, italic)
 */
export function ContactListItem({ contact, className }: ContactListItemProps) {
  const { status, daysSinceContact } = calculateCadenceStatus(
    contact.last_contacted_at,
    contact.cadence_days
  );

  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  const subtitle = getSubtitle(contact);

  // Get summary snippet (first 100 chars)
  const summarySnippet = contact.ai_summary
    ? contact.ai_summary.slice(0, 150) + (contact.ai_summary.length > 150 ? '...' : '')
    : null;

  // Format last contacted
  const lastContactedLabel = daysSinceContact !== null
    ? `Last: ${daysSinceContact === 0 ? 'Today' : daysSinceContact === 1 ? 'Yesterday' : `${daysSinceContact}d ago`}`
    : 'Never contacted';

  return (
    <Link
      href={`/contacts/${contact.id}`}
      className={cn(
        'block',
        'p-4 md:p-5',
        'rounded-[16px]',
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
      <div className="grid grid-cols-[48px_1fr_auto] gap-4">
        {/* Avatar */}
        <Avatar
          firstName={contact.first_name}
          lastName={contact.last_name}
          size="lg"
        />

        {/* Content column */}
        <div className="min-w-0">
          {/* Name */}
          <p className="text-[15px] font-semibold text-[rgba(26,26,28,0.95)] truncate">
            {fullName}
          </p>

          {/* Role @ Company */}
          {subtitle && (
            <p className="text-[13px] text-[rgba(26,26,28,0.65)] truncate mt-0.5">
              {subtitle}
            </p>
          )}

          {/* Summary snippet */}
          {summarySnippet && (
            <p
              className={cn(
                'text-[13px] italic text-[rgba(26,26,28,0.45)]',
                'mt-2 line-clamp-2 leading-[1.5]'
              )}
            >
              {summarySnippet}
            </p>
          )}
        </div>

        {/* Status column */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusBadge status={status} label={getCadenceLabel(status)} />
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
 * Formats as "Role at Company", "Role", or "Company"
 */
function getSubtitle(contact: Contact): string | null {
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
