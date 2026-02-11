'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui';
import { NoteInput } from './NoteInput';
import { NotesFeed } from './NotesFeed';
import { NotesFilter, type NotesFilterValue } from './NotesFilter';
import { TranscriptUploadButton } from './TranscriptUploadButton';
import { getNotes } from '@/lib/actions/notes';
import { cn } from '@/lib/utils/cn';
import type { Note, NoteType } from '@/lib/database.types';

interface NotesSectionProps {
  /** Contact ID to display notes for */
  contactId: string;
  /** Initial notes from server */
  initialNotes?: Note[];
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
 */
export function NotesSection({
  contactId,
  initialNotes = [],
  className,
}: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [filter, setFilter] = useState<NotesFilterValue>('all');
  const [isLoading, setIsLoading] = useState(false);

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

  // Handle note saved - refresh the list
  const handleNoteSaved = () => {
    fetchNotes();
  };

  // Handle note deleted - refresh the list
  const handleNoteDeleted = () => {
    fetchNotes();
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
