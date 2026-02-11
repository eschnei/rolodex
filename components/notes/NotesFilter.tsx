'use client';

import { cn } from '@/lib/utils/cn';
import type { NoteType } from '@/lib/database.types';

export type NotesFilterValue = 'all' | NoteType;

interface NotesFilterProps {
  /** Current filter value */
  value: NotesFilterValue;
  /** Callback when filter changes */
  onChange: (value: NotesFilterValue) => void;
  /** Additional className */
  className?: string;
}

/**
 * Notes filter toggle for filtering by note type
 *
 * Options:
 * - All: Show all notes
 * - Notes: Show only manual notes
 * - Transcripts: Show only transcript notes
 */
export function NotesFilter({ value, onChange, className }: NotesFilterProps) {
  const options: { value: NotesFilterValue; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'manual', label: 'Notes' },
    { value: 'transcript', label: 'Transcripts' },
  ];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1',
        'bg-bg-inset rounded-md',
        className
      )}
      role="tablist"
      aria-label="Filter notes by type"
    >
      {options.map((option) => (
        <button
          key={option.value}
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 rounded-sm',
            'type-small font-medium',
            'transition-all duration-fast',
            value === option.value
              ? 'bg-bg-secondary text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
