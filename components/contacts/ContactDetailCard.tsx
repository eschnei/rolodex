'use client';

import { Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { type Contact } from '@/lib/database.types';

interface ContactDetailCardProps {
  contact: Contact;
  className?: string;
}

const COMMUNICATION_LABELS: Record<string, string> = {
  email: 'Email',
  text: 'Text',
  phone: 'Phone',
  'in-person': 'In Person',
};

/**
 * Unified contact detail card with dark glass styling
 *
 * Combines:
 * - AI Summary section
 * - Quick Facts section
 * - Personal Intel (if available)
 */
export function ContactDetailCard({ contact, className }: ContactDetailCardProps) {
  const hasSummary = !!contact.ai_summary;

  return (
    <div
      className={cn(
        'rounded-[16px] overflow-hidden',
        'bg-[rgba(255,255,255,0.08)]',
        'backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]',
        'border border-[rgba(255,255,255,0.12)]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
        className
      )}
    >
      {/* Summary Section */}
      <div className="p-5 md:p-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.5)] mb-3">
          Summary
        </h3>
        {hasSummary ? (
          <>
            <p className="text-[15px] leading-[1.7] text-[rgba(255,255,255,0.95)]">
              {contact.ai_summary}
            </p>
            <p className="text-[12px] text-[rgba(255,255,255,0.4)] mt-4">
              Last updated <RelativeTime date={contact.updated_at} className="text-[rgba(255,255,255,0.4)]" />
            </p>
          </>
        ) : (
          <p className="text-[14px] italic text-[rgba(255,255,255,0.4)]">
            Add notes to generate a summary
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[rgba(255,255,255,0.08)]" />

      {/* Quick Facts Section */}
      <div className="p-5 md:p-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.5)] mb-4">
          Quick Facts
        </h3>

        <div className="grid grid-cols-[100px_1fr] gap-y-3 gap-x-4">
          {/* Name Phonetics */}
          {contact.name_phonetic && (
            <>
              <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Pronounced</span>
              <span className="text-[13px] text-[rgba(255,255,255,0.95)] italic">
                {contact.name_phonetic}
              </span>
            </>
          )}

          {/* Email */}
          {contact.email && (
            <>
              <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Email</span>
              <a
                href={`mailto:${contact.email}`}
                className="text-[13px] text-accent hover:text-accent-hover hover:underline truncate transition-colors"
              >
                {contact.email}
              </a>
            </>
          )}

          {/* Phone */}
          {contact.phone && (
            <>
              <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Phone</span>
              <a
                href={`tel:${contact.phone}`}
                className="text-[13px] text-accent hover:text-accent-hover hover:underline transition-colors"
              >
                {contact.phone}
              </a>
            </>
          )}

          {/* LinkedIn */}
          {contact.linkedin_url && (
            <>
              <span className="text-[12px] text-[rgba(255,255,255,0.5)]">LinkedIn</span>
              <a
                href={contact.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:text-accent-hover hover:underline transition-colors"
              >
                <Linkedin size={14} />
                <span>View Profile</span>
              </a>
            </>
          )}

          {/* How We Met */}
          {contact.how_we_met && (
            <>
              <span className="text-[12px] text-[rgba(255,255,255,0.5)]">How Met</span>
              <span className="text-[13px] text-[rgba(255,255,255,0.95)] line-clamp-1">
                {contact.how_we_met}
              </span>
            </>
          )}

          {/* Cadence */}
          <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Cadence</span>
          <span className="text-[13px] text-[rgba(255,255,255,0.95)]">
            Every {contact.cadence_days || 30} days
          </span>

          {/* Prefers */}
          <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Prefers</span>
          <span className="text-[13px] text-[rgba(255,255,255,0.95)]">
            {COMMUNICATION_LABELS[contact.communication_preference] || contact.communication_preference}
          </span>

          {/* Last Contact */}
          <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Last Contact</span>
          <span className="text-[13px] text-[rgba(255,255,255,0.95)]">
            {contact.last_contacted_at ? (
              <RelativeTime date={contact.last_contacted_at} className="text-[rgba(255,255,255,0.95)]" />
            ) : (
              <span className="text-[rgba(255,255,255,0.4)]">Never</span>
            )}
          </span>
        </div>
      </div>

      {/* Personal Intel (if available) */}
      {contact.personal_intel && (
        <>
          <div className="h-px bg-[rgba(255,255,255,0.08)]" />
          <div className="p-5 md:p-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.5)] mb-3">
              Personal Intel
            </h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.7)] whitespace-pre-wrap leading-relaxed">
              {contact.personal_intel}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
