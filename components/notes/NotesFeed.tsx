'use client';

import { Skeleton } from '@/components/ui';
import { NoteEntry } from './NoteEntry';
import { cn } from '@/lib/utils/cn';
import type { Note } from '@/lib/database.types';

interface NotesFeedProps {
  /** List of notes to display */
  notes: Note[];
  /** Whether notes are loading */
  isLoading?: boolean;
  /** Callback when a note is deleted */
  onNoteDeleted?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * Notes feed component displaying a list of notes
 *
 * Features:
 * - Shows notes in reverse chronological order (newest first)
 * - Empty state when no notes
 * - Loading skeleton state
 * - Delete callback propagation
 */
export function NotesFeed({
  notes,
  isLoading = false,
  onNoteDeleted,
  className,
}: NotesFeedProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 bg-bg-secondary rounded-lg border border-border-subtle"
          >
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (notes.length === 0) {
    return (
      <div
        className={cn(
          'py-8 text-center',
          'border border-dashed border-border-subtle rounded-lg',
          className
        )}
      >
        <p className="type-body text-text-tertiary">No notes yet</p>
        <p className="type-small text-text-tertiary mt-1">
          Add your first note above
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {notes.map((note) => (
        <NoteEntry key={note.id} note={note} onDeleted={onNoteDeleted} />
      ))}
    </div>
  );
}
