'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { TranscriptUploadModal } from './TranscriptUploadModal';

interface TranscriptUploadButtonProps {
  /** Contact ID to create transcript for */
  contactId: string;
  /** Callback when transcript is saved */
  onSaved?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * Button that opens the transcript upload modal
 * Styled to match the NotesFilter tabs
 */
export function TranscriptUploadButton({
  contactId,
  onSaved,
  className,
}: TranscriptUploadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5',
          'bg-bg-inset rounded-md',
          'text-[12px] font-medium text-text-secondary',
          'hover:text-text-primary hover:bg-[rgba(255,255,255,0.12)]',
          'transition-all duration-150',
          className
        )}
      >
        <FileText size={14} strokeWidth={2} />
        Upload
      </button>

      <TranscriptUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contactId={contactId}
        onSaved={onSaved}
      />
    </>
  );
}
