'use client';

import { ContactSummary } from './ContactSummary';
import { cn } from '@/lib/utils/cn';
import type { Contact } from '@/lib/database.types';

interface ContactSummarySectionProps {
  /** The contact data */
  contact: Contact;
  /** Whether AI processing is in progress */
  isProcessing?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Contact Summary Section
 *
 * Wrapper component that displays the AI summary for a contact.
 * Handles the display logic including processing state.
 */
export function ContactSummarySection({
  contact,
  isProcessing = false,
  className,
}: ContactSummarySectionProps) {
  return (
    <section className={cn('', className)}>
      <h2 className="type-h3 text-text-primary mb-3">About</h2>
      <ContactSummary
        summary={contact.ai_summary}
        updatedAt={contact.updated_at}
        isProcessing={isProcessing}
      />
    </section>
  );
}
