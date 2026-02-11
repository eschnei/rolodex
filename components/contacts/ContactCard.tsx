'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { calculateCadenceStatus } from '@/lib/utils/cadence';
import { type Contact } from '@/lib/database.types';
import { cn } from '@/lib/utils/cn';
import { getTagStyles } from '@/lib/utils/tagColors';

interface ContactCardProps {
  contact: Contact;
  className?: string;
}

/**
 * Contact card component for grid layout
 *
 * Features:
 * - Glass morphism styling matching dashboard
 * - Shows: name, role/company, tags, last contact, summary snippet
 * - Hover elevation effect
 * - Tags with deterministic colors
 */
export function ContactCard({ contact, className }: ContactCardProps) {
  const { status, daysSinceContact } = calculateCadenceStatus(
    contact.last_contacted_at,
    contact.cadence_days
  );

  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  const subtitle = getSubtitle(contact);

  // Get summary snippet (truncated for card display)
  const summarySnippet = contact.ai_summary
    ? contact.ai_summary.slice(0, 120) +
      (contact.ai_summary.length > 120 ? '...' : '')
    : null;

  // Format last contacted
  const lastContactedLabel =
    daysSinceContact !== null
      ? daysSinceContact === 0
        ? 'Today'
        : daysSinceContact === 1
          ? 'Yesterday'
          : `${daysSinceContact}d ago`
      : 'Never';

  // Status badge colors
  const statusColors = {
    overdue: {
      bg: 'bg-[rgba(229,72,77,0.2)]',
      border: 'border-[rgba(229,72,77,0.4)]',
      text: 'text-[rgba(255,255,255,0.95)]',
    },
    due: {
      bg: 'bg-[rgba(240,158,0,0.2)]',
      border: 'border-[rgba(240,158,0,0.4)]',
      text: 'text-[rgba(255,255,255,0.95)]',
    },
    ontrack: {
      bg: 'bg-[rgba(48,164,108,0.2)]',
      border: 'border-[rgba(48,164,108,0.4)]',
      text: 'text-[rgba(255,255,255,0.95)]',
    },
  };

  const colors = statusColors[status];

  return (
    <Link
      href={`/contacts/${contact.id}`}
      className={cn(
        'block p-4',
        'rounded-[16px]',
        'bg-[rgba(255,255,255,0.08)]',
        'backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]',
        'border border-[rgba(255,255,255,0.12)]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
        'transition-all duration-150 ease-out',
        'hover:bg-[rgba(255,255,255,0.12)]',
        'hover:border-[rgba(255,255,255,0.2)]',
        'hover:translate-y-[-2px]',
        'hover:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        className
      )}
    >
      {/* Header: Avatar + Name/Role */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar
          firstName={contact.first_name}
          lastName={contact.last_name}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-[rgba(255,255,255,0.95)] truncate">
            {fullName}
          </p>
          {subtitle && (
            <p className="text-[12px] text-[rgba(255,255,255,0.6)] truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {contact.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
              style={getTagStyles(tag)}
            >
              {tag}
            </span>
          ))}
          {contact.tags.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] font-medium text-[rgba(255,255,255,0.5)]">
              +{contact.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Summary snippet */}
      {summarySnippet && (
        <p className="text-[12px] italic text-[rgba(255,255,255,0.45)] line-clamp-2 leading-[1.5] mb-3">
          {summarySnippet}
        </p>
      )}

      {/* Footer: Last contact info */}
      <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.08)]">
        <span className="text-[11px] text-[rgba(255,255,255,0.5)]">
          Last: {lastContactedLabel}
        </span>
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
          {status === 'overdue'
            ? 'Overdue'
            : status === 'due'
              ? 'Due Soon'
              : 'On Track'}
        </span>
      </div>
    </Link>
  );
}

/**
 * Generate subtitle from company and role
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
