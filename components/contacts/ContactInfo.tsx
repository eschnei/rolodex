import { Card, CardBody } from '@/components/ui';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { type Contact } from '@/lib/database.types';

interface ContactInfoProps {
  contact: Contact;
}

const COMMUNICATION_LABELS: Record<string, string> = {
  email: 'Email',
  text: 'Text',
  phone: 'Phone',
  'in-person': 'In Person',
};

/**
 * Quick Facts component - compact key-value grid
 *
 * Features:
 * - Glass card treatment
 * - 2-column grid: Label | Value
 * - Clickable email/phone links
 * - Compact, scannable layout
 */
export function ContactInfo({ contact }: ContactInfoProps) {
  return (
    <Card variant="glass">
      <CardBody className="p-5">
        {/* Section label */}
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.6px] text-[rgba(26,26,28,0.45)] mb-4">
          Quick Facts
        </h3>

        {/* Key-value grid */}
        <div className="grid grid-cols-[100px_1fr] gap-y-3 gap-x-4">
          {/* Email */}
          {contact.email && (
            <>
              <span className="text-[12px] text-[rgba(26,26,28,0.45)]">Email</span>
              <a
                href={`mailto:${contact.email}`}
                className="text-[13px] text-accent-text hover:underline truncate"
              >
                {contact.email}
              </a>
            </>
          )}

          {/* Phone */}
          {contact.phone && (
            <>
              <span className="text-[12px] text-[rgba(26,26,28,0.45)]">Phone</span>
              <a
                href={`tel:${contact.phone}`}
                className="text-[13px] text-accent-text hover:underline"
              >
                {contact.phone}
              </a>
            </>
          )}

          {/* How We Met */}
          {contact.how_we_met && (
            <>
              <span className="text-[12px] text-[rgba(26,26,28,0.45)]">How Met</span>
              <span className="text-[13px] text-[rgba(26,26,28,0.95)] line-clamp-1">
                {contact.how_we_met}
              </span>
            </>
          )}

          {/* Cadence */}
          <span className="text-[12px] text-[rgba(26,26,28,0.45)]">Cadence</span>
          <span className="text-[13px] text-[rgba(26,26,28,0.95)]">
            Every {contact.cadence_days || 30} days
          </span>

          {/* Prefers */}
          <span className="text-[12px] text-[rgba(26,26,28,0.45)]">Prefers</span>
          <span className="text-[13px] text-[rgba(26,26,28,0.95)]">
            {COMMUNICATION_LABELS[contact.communication_preference] || contact.communication_preference}
          </span>

          {/* Last Contact */}
          <span className="text-[12px] text-[rgba(26,26,28,0.45)]">Last Contact</span>
          <span className="text-[13px] text-[rgba(26,26,28,0.95)]">
            {contact.last_contacted_at ? (
              <RelativeTime date={contact.last_contacted_at} />
            ) : (
              <span className="text-[rgba(26,26,28,0.45)]">Never</span>
            )}
          </span>
        </div>

        {/* Personal Intel (if available) */}
        {contact.personal_intel && (
          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.25)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-[rgba(26,26,28,0.45)] block mb-2">
              Personal Intel
            </span>
            <p className="text-[13px] text-[rgba(26,26,28,0.65)] whitespace-pre-wrap leading-relaxed">
              {contact.personal_intel}
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
