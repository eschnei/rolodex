'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { NoteInput } from '@/components/notes/NoteInput';
import { NotesFeed } from '@/components/notes/NotesFeed';
import { NotesFilter, type NotesFilterValue } from '@/components/notes/NotesFilter';
import { TranscriptUploadButton } from '@/components/notes/TranscriptUploadButton';
import { ProcessingError } from '@/components/notes/ProcessingError';
import { ActionItem } from '@/components/actionItems/ActionItem';
import { AddActionItem } from '@/components/actionItems/AddActionItem';
import { ActionItemsFilter } from '@/components/actionItems/ActionItemsFilter';
import { ExtractedItemsReview } from '@/components/actionItems/ExtractedItemsReview';
import { getNotes } from '@/lib/actions/notes';
import { getActionItems } from '@/lib/actions/actionItems';
import { useProcessingStatus } from '@/lib/hooks/useProcessingStatus';
import type { Contact, Note, ActionItem as ActionItemType, NoteType } from '@/lib/database.types';
import type { ExtractedNoteData } from '@/lib/ai/types';

interface ContactFullCardProps {
  contact: Contact;
  initialNotes: Note[];
  initialActionItems: ActionItemType[];
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
 * Contains: Summary, Quick Facts + Action Items, Notes
 */
export function ContactFullCard({
  contact,
  initialNotes,
  initialActionItems,
  className,
}: ContactFullCardProps) {
  // Notes state
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [notesFilter, setNotesFilter] = useState<NotesFilterValue>('all');
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [extractedItems, setExtractedItems] = useState<{
    items: string[];
    noteId: string;
  } | null>(null);
  const lastSavedNoteRef = useRef<Note | null>(null);

  // Action items state
  const [actionItems, setActionItems] = useState<ActionItemType[]>(initialActionItems);
  const [showOpenOnly, setShowOpenOnly] = useState(true);
  const [_isLoadingActions, setIsLoadingActions] = useState(false);

  const openCount = actionItems.filter((item) => !item.is_completed).length;
  const totalCount = actionItems.length;
  const filteredActionItems = showOpenOnly
    ? actionItems.filter((item) => !item.is_completed)
    : actionItems;

  // AI processing
  const {
    hasError,
    error: processingError,
    startProcessing,
    reset: resetProcessing,
    retry: retryProcessing,
  } = useProcessingStatus({
    onComplete: (result: ExtractedNoteData) => {
      if (result.action_items.length > 0 && lastSavedNoteRef.current) {
        setExtractedItems({
          items: result.action_items,
          noteId: lastSavedNoteRef.current.id,
        });
      }
      window.location.reload();
    },
    onError: () => {},
  });

  // Fetch functions
  const fetchNotes = useCallback(async () => {
    setIsLoadingNotes(true);
    try {
      const noteType: NoteType | undefined = notesFilter === 'all' ? undefined : notesFilter;
      const result = await getNotes(contact.id, noteType);
      if (result.success && result.notes) {
        setNotes(result.notes);
      }
    } finally {
      setIsLoadingNotes(false);
    }
  }, [contact.id, notesFilter]);

  const fetchActionItems = useCallback(async () => {
    setIsLoadingActions(true);
    try {
      const result = await getActionItems(contact.id, true);
      if (result.success && result.actionItems) {
        setActionItems(result.actionItems);
      }
    } finally {
      setIsLoadingActions(false);
    }
  }, [contact.id]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Handlers
  const handleNoteSaved = useCallback(async () => {
    await fetchNotes();
    const mostRecentNote = notes[0];
    if (mostRecentNote) {
      lastSavedNoteRef.current = mostRecentNote;
      startProcessing(mostRecentNote.id, contact.id);
    }
  }, [fetchNotes, notes, startProcessing, contact.id]);

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

      <div className="h-px bg-[rgba(255,255,255,0.08)]" />

      {/* Quick Facts + Action Items - Stacked Layout */}
      <div>
        {/* Quick Facts */}
        <div className="p-5 md:p-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.5)] mb-4">
            Quick Facts
          </h3>
          <div className="grid grid-cols-[100px_1fr] gap-y-3 gap-x-4">
            {contact.name_phonetic && (
              <>
                <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Pronounced</span>
                <span className="text-[13px] text-[rgba(255,255,255,0.95)] italic">{contact.name_phonetic}</span>
              </>
            )}
            {contact.email && (
              <>
                <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Email</span>
                <a href={`mailto:${contact.email}`} className="text-[13px] text-accent hover:text-accent-hover hover:underline truncate transition-colors">
                  {contact.email}
                </a>
              </>
            )}
            {contact.phone && (
              <>
                <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Phone</span>
                <a href={`tel:${contact.phone}`} className="text-[13px] text-accent hover:text-accent-hover hover:underline transition-colors">
                  {contact.phone}
                </a>
              </>
            )}
            {contact.linkedin_url && (
              <>
                <span className="text-[12px] text-[rgba(255,255,255,0.5)]">LinkedIn</span>
                <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:text-accent-hover hover:underline transition-colors">
                  <Linkedin size={14} />
                  <span>View Profile</span>
                </a>
              </>
            )}
            {contact.how_we_met && (
              <>
                <span className="text-[12px] text-[rgba(255,255,255,0.5)]">How Met</span>
                <span className="text-[13px] text-[rgba(255,255,255,0.95)] line-clamp-1">{contact.how_we_met}</span>
              </>
            )}
            <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Cadence</span>
            <span className="text-[13px] text-[rgba(255,255,255,0.95)]">Every {contact.cadence_days || 30} days</span>
            <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Prefers</span>
            <span className="text-[13px] text-[rgba(255,255,255,0.95)]">{COMMUNICATION_LABELS[contact.communication_preference] || contact.communication_preference}</span>
            <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Last Contact</span>
            <span className="text-[13px] text-[rgba(255,255,255,0.95)]">
              {contact.last_contacted_at ? (
                <RelativeTime date={contact.last_contacted_at} className="text-[rgba(255,255,255,0.95)]" />
              ) : (
                <span className="text-[rgba(255,255,255,0.4)]">Never</span>
              )}
            </span>
          </div>

          {contact.personal_intel && (
            <div className="mt-5 pt-5 border-t border-[rgba(255,255,255,0.08)]">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.5)] mb-2">
                Personal Intel
              </h4>
              <p className="text-[13px] text-[rgba(255,255,255,0.7)] whitespace-pre-wrap leading-relaxed">
                {contact.personal_intel}
              </p>
            </div>
          )}
        </div>

        <div className="h-px bg-[rgba(255,255,255,0.08)]" />

        {/* Action Items */}
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.5)]">
              Action Items
            </h3>
            <ActionItemsFilter
              showOpenOnly={showOpenOnly}
              onChange={setShowOpenOnly}
              openCount={openCount}
              totalCount={totalCount}
            />
          </div>
          <AddActionItem contactId={contact.id} onCreated={fetchActionItems} />
          <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto">
            {filteredActionItems.length === 0 ? (
              <p className="text-[13px] text-[rgba(255,255,255,0.4)] py-4 text-center">
                {showOpenOnly ? 'No open action items' : 'No action items yet'}
              </p>
            ) : (
              filteredActionItems.map((item) => (
                <ActionItem key={item.id} actionItem={item} onUpdated={fetchActionItems} />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.08)]" />

      {/* Notes Section */}
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.5)]">
            Notes
          </h3>
          <div className="flex items-center gap-2">
            <NotesFilter value={notesFilter} onChange={setNotesFilter} />
            <TranscriptUploadButton contactId={contact.id} onSaved={handleNoteSaved} />
          </div>
        </div>

        {hasError && processingError && (
          <ProcessingError
            message={processingError}
            retryable
            onRetry={() => retryProcessing(contact.id)}
            onDismiss={resetProcessing}
          />
        )}

        {extractedItems && (
          <ExtractedItemsReview
            items={extractedItems.items}
            contactId={contact.id}
            sourceNoteId={extractedItems.noteId}
            onItemsAccepted={fetchActionItems}
            onDismiss={() => setExtractedItems(null)}
          />
        )}

        <NoteInput contactId={contact.id} onNoteSaved={handleNoteSaved} />
        <div className="mt-4 max-h-[400px] overflow-y-auto">
          <NotesFeed notes={notes} isLoading={isLoadingNotes} onNoteDeleted={fetchNotes} />
        </div>
      </div>
    </div>
  );
}
