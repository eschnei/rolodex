'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui';
import { NoteInput } from './NoteInput';
import { NotesFeed } from './NotesFeed';
import { NotesFilter, type NotesFilterValue } from './NotesFilter';
import { TranscriptUploadButton } from './TranscriptUploadButton';
import { ProcessingError } from './ProcessingError';
import { ExtractedItemsReview } from '@/components/actionItems/ExtractedItemsReview';
import { getNotes } from '@/lib/actions/notes';
import { useProcessingStatus } from '@/lib/hooks/useProcessingStatus';
import { cn } from '@/lib/utils/cn';
import type { Note, NoteType } from '@/lib/database.types';
import type { ExtractedNoteData } from '@/lib/ai/types';

interface NotesSectionProps {
  /** Contact ID to display notes for */
  contactId: string;
  /** Initial notes from server */
  initialNotes?: Note[];
  /** Callback when AI processing completes (for summary update) */
  onProcessingComplete?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * Complete notes section with input, filter, and feed
 *
 * Features:
 * - Sticky note input at top
 * - Note type filter (All/Notes/Transcripts)
 * - Scrollable notes feed with max height
 * - Transcript upload button
 * - Auto-refresh when notes are added/deleted
 * - Async AI processing after note save
 * - Extracted action items review
 */
export function NotesSection({
  contactId,
  initialNotes = [],
  onProcessingComplete,
  className,
}: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [filter, setFilter] = useState<NotesFilterValue>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedItems, setExtractedItems] = useState<{
    items: string[];
    noteId: string;
  } | null>(null);

  // Track the last saved note for AI processing
  const lastSavedNoteRef = useRef<Note | null>(null);

  // AI processing status
  const {
    hasError,
    error: processingError,
    startProcessing,
    reset: resetProcessing,
    retry: retryProcessing,
  } = useProcessingStatus({
    onComplete: (result: ExtractedNoteData) => {
      // Show extracted action items if any
      if (result.action_items.length > 0 && lastSavedNoteRef.current) {
        setExtractedItems({
          items: result.action_items,
          noteId: lastSavedNoteRef.current.id,
        });
      }
      // Notify parent about processing completion (for summary update)
      onProcessingComplete?.();
    },
    onError: () => {
      // Error is handled in the UI
    },
  });

  // Fetch notes with optional filter
  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const noteType: NoteType | undefined = filter === 'all' ? undefined : filter;
      const result = await getNotes(contactId, noteType);
      if (result.success && result.notes) {
        setNotes(result.notes);
      }
    } finally {
      setIsLoading(false);
    }
  }, [contactId, filter]);

  // Refetch when filter changes
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Handle note saved - refresh the list and trigger AI processing
  const handleNoteSaved = useCallback(async () => {
    // Fetch notes first to get the new note
    await fetchNotes();

    // Get the most recent note (it should be the one just saved)
    const mostRecentNote = notes[0];
    if (mostRecentNote) {
      lastSavedNoteRef.current = mostRecentNote;
      // Trigger AI processing asynchronously (don't await)
      startProcessing(mostRecentNote.id, contactId);
    }
  }, [fetchNotes, notes, startProcessing, contactId]);

  // Handle note deleted - refresh the list
  const handleNoteDeleted = () => {
    fetchNotes();
  };

  // Handle retry
  const handleRetry = () => {
    retryProcessing(contactId);
  };

  // Handle dismiss processing error
  const handleDismissError = () => {
    resetProcessing();
  };

  // Handle extracted items dismissed
  const handleExtractedItemsDismiss = () => {
    setExtractedItems(null);
  };

  // Handle extracted items accepted
  const handleExtractedItemsAccepted = () => {
    // Refresh action items in the parent component
    onProcessingComplete?.();
  };

  return (
    <Card className={cn('flex flex-col', className)}>
      {/* Header with title and actions */}
      <CardHeader className="flex flex-row items-center justify-between gap-3 sticky top-0 z-10 bg-bg-secondary">
        <h2 className="type-h3 text-text-primary">Notes</h2>
        <div className="flex items-center gap-2">
          <NotesFilter value={filter} onChange={setFilter} />
          <TranscriptUploadButton
            contactId={contactId}
            onSaved={handleNoteSaved}
          />
        </div>
      </CardHeader>

      <CardBody className="flex flex-col gap-4">
        {/* Processing error */}
        {hasError && processingError && (
          <ProcessingError
            message={processingError}
            retryable
            onRetry={handleRetry}
            onDismiss={handleDismissError}
          />
        )}

        {/* Extracted action items review */}
        {extractedItems && (
          <ExtractedItemsReview
            items={extractedItems.items}
            contactId={contactId}
            sourceNoteId={extractedItems.noteId}
            onItemsAccepted={handleExtractedItemsAccepted}
            onDismiss={handleExtractedItemsDismiss}
          />
        )}

        {/* Note input - sticky */}
        <div className="sticky top-0 z-10 bg-bg-secondary pb-4 -mt-1">
          <NoteInput
            contactId={contactId}
            onNoteSaved={handleNoteSaved}
          />
        </div>

        {/* Notes feed - scrollable */}
        <div className="max-h-[400px] overflow-y-auto pr-1 -mr-1">
          <NotesFeed
            notes={notes}
            isLoading={isLoading}
            onNoteDeleted={handleNoteDeleted}
          />
        </div>
      </CardBody>
    </Card>
  );
}
