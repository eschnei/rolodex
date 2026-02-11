import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui';
import { calculateCadenceStatus, getCadenceLabel, getCadenceMessage } from '@/lib/utils/cadence';
import { type Contact } from '@/lib/database.types';
import { cn } from '@/lib/utils/cn';

interface ContactHeaderProps {
  contact: Contact;
}

/**
 * Contact detail header with glass morphism treatment
 *
 * Layout:
 * - Back navigation
 * - Avatar (64px) + Name + Role + Location
 * - Status badge + days until due
 * - Edit button
 */
export function ContactHeader({ contact }: ContactHeaderProps) {
  const cadenceInfo = calculateCadenceStatus(
    contact.last_contacted_at,
    contact.cadence_days
  );

  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  const subtitle = getSubtitle(contact);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/contacts"
        className={cn(
          'inline-flex items-center gap-2',
          'text-[13px] text-[rgba(255,255,255,0.7)]',
          'hover:text-[rgba(255,255,255,0.95)]',
          'transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.8)] focus-visible:outline-offset-2'
        )}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to Contacts
      </Link>

      {/* Contact info row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div
            className={cn(
              'w-16 h-16 rounded-full shrink-0',
              'flex items-center justify-center',
              'text-[24px] font-semibold',
              'bg-accent-subtle text-accent-text'
            )}
            aria-hidden="true"
          >
            {getInitials(contact.first_name, contact.last_name)}
          </div>

          {/* Name and details */}
          <div>
            {/* Name */}
            <h1
              className={cn(
                'text-[24px] font-bold',
                'text-[rgba(255,255,255,0.95)]',
                'tracking-[-0.3px]'
              )}
            >
              {fullName}
            </h1>

            {/* Role @ Company */}
            {subtitle && (
              <p className="text-[15px] text-[rgba(255,255,255,0.7)] mt-0.5">
                {subtitle}
              </p>
            )}

            {/* Location */}
            {contact.location && (
              <p className="text-[13px] text-[rgba(255,255,255,0.5)] mt-0.5">
                {contact.location}
              </p>
            )}

            {/* Status row */}
            <div className="flex items-center gap-3 mt-3">
              <StatusBadge
                status={cadenceInfo.status}
                label={getCadenceLabel(cadenceInfo.status)}
              />
              <span className="text-[13px] text-[rgba(255,255,255,0.7)]">
                {getCadenceMessage(cadenceInfo)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/contacts/${contact.id}/edit`}>
            <Button variant="secondary" size="md">
              <Pencil size={14} strokeWidth={2} />
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

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

function getInitials(firstName: string, lastName?: string | null): string {
  const first = firstName.trim().charAt(0).toUpperCase();

  if (lastName && lastName.trim()) {
    return first + lastName.trim().charAt(0).toUpperCase();
  }

  if (firstName.trim().length > 1) {
    return first + firstName.trim().charAt(1).toUpperCase();
  }

  return first;
}
