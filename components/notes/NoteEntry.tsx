'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { RelativeTime, ConfirmModal } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { deleteNote } from '@/lib/actions/notes';
import type { Note, NoteType } from '@/lib/database.types';

interface NoteEntryProps {
  /** Note data */
  note: Note;
  /** Callback when note is deleted */
  onDeleted?: (() => void) | undefined;
  /** Additional className */
  className?: string | undefined;
}

/**
 * Individual note entry component
 *
 * Features:
 * - Content display with proper formatting
 * - Type badge (Manual/Transcript)
 * - Relative timestamp
 * - Delete button with confirmation
 */
export function NoteEntry({ note, onDeleted, className }: NoteEntryProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteNote(note.id);
      if (result.success) {
        onDeleted?.();
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const noteTypeBadge: Record<NoteType, { label: string; variant: 'default' | 'accent' }> = {
    manual: { label: 'Manual', variant: 'default' },
    transcript: { label: 'Transcript', variant: 'accent' },
  };

  const { label, variant } = noteTypeBadge[note.note_type];

  return (
    <>
      <div
        className={cn(
          'group relative p-4 bg-bg-secondary rounded-lg border border-border-subtle',
          'hover:border-border-primary transition-colors duration-fast',
          className
        )}
      >
        {/* Header with type badge and timestamp */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Badge variant={variant}>{label}</Badge>
            <span className="type-small text-text-tertiary">
              <RelativeTime date={note.created_at} showTooltip />
            </span>
          </div>

          {/* Delete button */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={cn(
              'p-1.5 rounded-md',
              'text-text-tertiary hover:text-status-overdue',
              'hover:bg-status-overdue-bg',
              'opacity-0 group-hover:opacity-100',
              'transition-all duration-fast',
              'focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'
            )}
            aria-label="Delete note"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="type-body text-text-primary whitespace-pre-wrap break-words">
          {note.content}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
