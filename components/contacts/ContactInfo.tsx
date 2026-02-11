import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  MessageSquare,
  Calendar,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { type Contact } from '@/lib/database.types';

interface ContactInfoProps {
  contact: Contact;
}

const COMMUNICATION_LABELS: Record<string, string> = {
  email: 'Email',
  text: 'Text Message',
  phone: 'Phone Call',
  'in-person': 'In Person',
};

/**
 * Contact information display component
 * Shows contact details, how we met, and personal intel in organized sections
 */
export function ContactInfo({ contact }: ContactInfoProps) {
  return (
    <div className="space-y-6">
      {/* Contact Details */}
      <Card>
        <CardHeader>
          <h2 className="type-h3 text-text-primary">Contact Details</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {contact.email && (
            <InfoRow icon={Mail} label="Email">
              <a
                href={`mailto:${contact.email}`}
                className="text-accent hover:text-accent-hover transition-colors duration-fast"
              >
                {contact.email}
              </a>
            </InfoRow>
          )}

          {contact.phone && (
            <InfoRow icon={Phone} label="Phone">
              <a
                href={`tel:${contact.phone}`}
                className="text-accent hover:text-accent-hover transition-colors duration-fast"
              >
                {contact.phone}
              </a>
            </InfoRow>
          )}

          {contact.location && (
            <InfoRow icon={MapPin} label="Location">
              {contact.location}
            </InfoRow>
          )}

          {contact.company && (
            <InfoRow icon={Building2} label="Company">
              {contact.company}
            </InfoRow>
          )}

          {contact.role && (
            <InfoRow icon={Briefcase} label="Role">
              {contact.role}
            </InfoRow>
          )}

          <InfoRow icon={MessageSquare} label="Preferred Contact">
            {COMMUNICATION_LABELS[contact.communication_preference] || contact.communication_preference}
          </InfoRow>

          <InfoRow icon={Calendar} label="Contact Cadence">
            Every {contact.cadence_days || 30} days
          </InfoRow>

          <InfoRow icon={Calendar} label="Last Contacted">
            {contact.last_contacted_at ? (
              <RelativeTime date={contact.last_contacted_at} />
            ) : (
              <span className="text-text-tertiary">Never</span>
            )}
          </InfoRow>

          <InfoRow icon={Users} label="Added">
            <RelativeTime date={contact.created_at} />
          </InfoRow>

          {/* Show if no contact info at all */}
          {!contact.email && !contact.phone && !contact.location && (
            <p className="type-small text-text-tertiary italic">
              No contact details added yet
            </p>
          )}
        </CardBody>
      </Card>

      {/* How We Met */}
      {contact.how_we_met && (
        <Card>
          <CardHeader>
            <h2 className="type-h3 text-text-primary">How We Met</h2>
          </CardHeader>
          <CardBody>
            <p className="type-body text-text-secondary whitespace-pre-wrap">
              {contact.how_we_met}
            </p>
          </CardBody>
        </Card>
      )}

      {/* Personal Intel */}
      {contact.personal_intel && (
        <Card>
          <CardHeader>
            <h2 className="type-h3 text-text-primary">Personal Intel</h2>
          </CardHeader>
          <CardBody>
            <p className="type-body text-text-secondary whitespace-pre-wrap">
              {contact.personal_intel}
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}

function InfoRow({ icon: Icon, label, children }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} className="text-text-tertiary mt-0.5 shrink-0" strokeWidth={1.5} />
      <div className="flex-1 min-w-0">
        <dt className="type-caption text-text-tertiary">{label}</dt>
        <dd className="type-body text-text-primary mt-0.5">{children}</dd>
      </div>
    </div>
  );
}
