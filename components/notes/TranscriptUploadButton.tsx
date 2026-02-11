'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui';
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
 */
export function TranscriptUploadButton({
  contactId,
  onSaved,
  className,
}: TranscriptUploadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        <FileText size={14} strokeWidth={2} />
        Upload Transcript
      </Button>

      <TranscriptUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contactId={contactId}
        onSaved={onSaved}
      />
    </>
  );
}
