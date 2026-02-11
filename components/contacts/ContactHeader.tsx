import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui';
import { calculateCadenceStatus, getCadenceLabel, getCadenceMessage } from '@/lib/utils/cadence';
import { type Contact } from '@/lib/database.types';

interface ContactHeaderProps {
  contact: Contact;
}

/**
 * Header for contact detail page
 * Displays avatar, name, subtitle, cadence status, and edit button
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
        className="inline-flex items-center gap-2 type-small text-text-secondary hover:text-text-primary transition-colors duration-fast"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to Contacts
      </Link>

      {/* Contact info */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar
            firstName={contact.first_name}
            lastName={contact.last_name}
            size="lg"
          />
          <div>
            <h1 className="type-h1 text-text-primary">{fullName}</h1>
            {subtitle && (
              <p className="type-body text-text-secondary mt-1">{subtitle}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge
                status={cadenceInfo.status}
                label={getCadenceLabel(cadenceInfo.status)}
              />
              <span className="type-small text-text-tertiary">
                {getCadenceMessage(cadenceInfo)}
              </span>
            </div>
          </div>
        </div>

        <Link href={`/contacts/${contact.id}/edit`}>
          <Button variant="secondary" size="md">
            <Pencil size={14} strokeWidth={2} />
            Edit
          </Button>
        </Link>
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
