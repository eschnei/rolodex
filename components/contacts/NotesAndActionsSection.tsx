'use client';

import { useCallback } from 'react';
import { NotesSection } from '@/components/notes';
import { ActionItemsSection } from '@/components/actionItems';
import { ContactSummary } from './ContactSummary';
import type { Contact, Note, ActionItem } from '@/lib/database.types';

interface NotesAndActionsSectionProps {
  /** The contact data */
  contact: Contact;
  /** Initial notes from server */
  initialNotes: Note[];
  /** Initial action items from server */
  initialActionItems: ActionItem[];
}

/**
 * Notes and Actions Section with AI Processing Integration
 *
 * This component wraps both NotesSection and ActionItemsSection
 * to coordinate AI processing state and updates.
 *
 * Features:
 * - Manages AI processing state across sections
 * - Updates summary display when processing completes
 * - Coordinates action items refresh after AI extraction
 */
export function NotesAndActionsSection({
  contact,
  initialNotes,
  initialActionItems,
}: NotesAndActionsSectionProps) {
  // Handle AI processing complete
  const handleProcessingComplete = useCallback(() => {
    // Force refresh the page data
    // In a production app, you might use SWR or React Query for this
    window.location.reload();
  }, []);

  return (
    <div className="mt-8">
      {/* Summary Section - shown above notes grid */}
      <section className="mb-6">
        <h2 className="type-h3 text-text-primary mb-3">About</h2>
        <ContactSummary
          summary={contact.ai_summary}
          updatedAt={contact.updated_at}
        />
      </section>

      {/* Notes and Action Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes Section */}
        <NotesSection
          contactId={contact.id}
          initialNotes={initialNotes}
          onProcessingComplete={handleProcessingComplete}
        />

        {/* Action Items Section */}
        <ActionItemsSection
          contactId={contact.id}
          initialActionItems={initialActionItems}
        />
      </div>
    </div>
  );
}
