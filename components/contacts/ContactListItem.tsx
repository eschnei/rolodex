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
 * Individual contact item for the contact list
 * Displays avatar, name, company/role, and cadence status badge
 * Links to contact detail page on click
 */
export function ContactListItem({ contact, className }: ContactListItemProps) {
  const { status } = calculateCadenceStatus(
    contact.last_contacted_at,
    contact.cadence_days
  );

  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  const subtitle = getSubtitle(contact);

  return (
    <Link
      href={`/contacts/${contact.id}`}
      className={cn(
        'flex items-center gap-4 p-4',
        'bg-bg-secondary border border-border-subtle rounded-lg',
        'hover:bg-bg-hover hover:border-border-primary',
        'transition-all duration-fast',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        className
      )}
    >
      <Avatar firstName={contact.first_name} lastName={contact.last_name} />

      <div className="flex-1 min-w-0">
        <p className="type-body text-text-primary font-medium truncate">
          {fullName}
        </p>
        {subtitle && (
          <p className="type-small text-text-secondary truncate">{subtitle}</p>
        )}
      </div>

      <StatusBadge status={status} label={getCadenceLabel(status)} />
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
