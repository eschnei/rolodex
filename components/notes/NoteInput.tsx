'use client';

import { useState, useCallback, useRef } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { Button, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useAutoSave, type AutoSaveStatus } from '@/lib/hooks/useAutoSave';
import { createNote } from '@/lib/actions/notes';

interface NoteInputProps {
  /** Contact ID to create notes for */
  contactId: string;
  /** Callback when a note is successfully saved */
  onNoteSaved?: () => void;
  /** Additional className for the container */
  className?: string;
}

/**
 * Note input component with auto-save functionality
 *
 * Features:
 * - Auto-saves after 3 seconds of inactivity
 * - Manual save button
 * - Save on blur
 * - Visual saving indicator
 * - Clears input after successful save
 */
export function NoteInput({
  contactId,
  onNoteSaved,
  className,
}: NoteInputProps) {
  const [content, setContent] = useState('');
  const [manualSaveStatus, setManualSaveStatus] = useState<AutoSaveStatus>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSavedContentRef = useRef('');

  // Handle save
  const handleSave = useCallback(async (value: string) => {
    if (!value || value.trim().length === 0) return;
    if (value === lastSavedContentRef.current) return;

    const result = await createNote(contactId, value, 'manual');
    if (!result.success) {
      throw new Error(result.error);
    }

    lastSavedContentRef.current = value;
    setContent('');
    lastSavedContentRef.current = '';
    onNoteSaved?.();
  }, [contactId, onNoteSaved]);

  // Auto-save hook
  const { status: autoSaveStatus, isSaving, save } = useAutoSave({
    value: content,
    onSave: handleSave,
    delay: 3000,
    enabled: content.trim().length > 0,
    onSuccess: () => {
      setContent('');
    },
  });

  // Manual save handler
  const handleManualSave = async () => {
    if (!content || content.trim().length === 0) return;
    if (isSaving) return;

    setManualSaveStatus('saving');
    try {
      await handleSave(content);
      setManualSaveStatus('saved');
      setTimeout(() => setManualSaveStatus('idle'), 2000);
    } catch {
      setManualSaveStatus('error');
      setTimeout(() => setManualSaveStatus('idle'), 3000);
    }
  };

  // Handle blur - trigger save if there's content
  const handleBlur = () => {
    if (content.trim().length > 0 && !isSaving) {
      save();
    }
  };

  // Determine current status
  const currentStatus = manualSaveStatus !== 'idle' ? manualSaveStatus : autoSaveStatus;
  const isCurrentlySaving = currentStatus === 'saving';

  return (
    <div className={cn('space-y-3', className)}>
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        placeholder="Add a note about this contact..."
        className="min-h-[100px] resize-y"
        disabled={isCurrentlySaving}
      />

      <div className="flex items-center justify-between gap-3">
        {/* Status indicator */}
        <div className="flex items-center gap-2 min-h-[24px]">
          {currentStatus === 'saving' && (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-text-tertiary" />
              <span className="type-small text-text-tertiary">Saving...</span>
            </>
          )}
          {currentStatus === 'saved' && (
            <>
              <Check className="h-4 w-4 text-status-ontrack" />
              <span className="type-small text-status-ontrack-text">Saved</span>
            </>
          )}
          {currentStatus === 'error' && (
            <>
              <AlertCircle className="h-4 w-4 text-status-overdue" />
              <span className="type-small text-status-overdue-text">Failed to save</span>
            </>
          )}
        </div>

        {/* Save button */}
        <Button
          variant="primary"
          size="sm"
          onClick={handleManualSave}
          disabled={!content.trim() || isCurrentlySaving}
          isLoading={isCurrentlySaving}
        >
          Save Note
        </Button>
      </div>
    </div>
  );
}
