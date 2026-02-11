'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import { Button, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { createNote } from '@/lib/actions/notes';

const MAX_CHARS = 50000;

interface TranscriptUploadModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Contact ID to create transcript for */
  contactId: string;
  /** Callback when transcript is saved */
  onSaved?: (() => void) | undefined;
}

/**
 * Modal for uploading transcripts
 *
 * Features:
 * - Paste textarea for direct input
 * - File upload for .txt files
 * - 50k character limit with counter
 * - Preview of content
 * - Validation and error handling
 */
export function TranscriptUploadModal({
  isOpen,
  onClose,
  contactId,
  onSaved,
}: TranscriptUploadModalProps) {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isSaving, onClose]);

  // Trap focus and manage scroll
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setContent('');
      setFileName(null);
      setError(null);
    }
  }, [isOpen]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.txt')) {
      setError('Only .txt files are supported');
      return;
    }

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text.length > MAX_CHARS) {
        setError(`File content exceeds ${MAX_CHARS.toLocaleString()} character limit`);
        return;
      }
      setContent(text);
      setFileName(file.name);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setFileName(null);
    if (e.target.value.length <= MAX_CHARS) {
      setError(null);
    }
  };

  const handleSave = async () => {
    if (!content.trim() || isOverLimit || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      const result = await createNote(contactId, content, 'transcript');
      if (result.success) {
        onSaved?.();
        onClose();
      } else {
        setError(result.error || 'Failed to save transcript');
      }
    } catch {
      setError('Failed to save transcript. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transcript-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isSaving ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-w-2xl mx-4',
          'bg-bg-secondary border border-border-primary rounded-lg shadow-lg',
          'p-6',
          'max-h-[90vh] flex flex-col',
          'focus:outline-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            id="transcript-modal-title"
            className="type-h3 text-text-primary"
          >
            Upload Transcript
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className={cn(
              'text-text-tertiary hover:text-text-secondary',
              'transition-colors duration-fast',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* File upload area */}
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Upload transcript file"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            className={cn(
              'w-full p-4',
              'border-2 border-dashed border-border-primary rounded-lg',
              'hover:border-accent hover:bg-accent-subtle/30',
              'transition-all duration-fast',
              'flex items-center justify-center gap-2',
              'text-text-secondary hover:text-accent-text',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Upload size={18} />
            <span className="type-body">
              {fileName ? (
                <>
                  <FileText size={16} className="inline mr-2" />
                  {fileName}
                </>
              ) : (
                'Click to upload a .txt file'
              )}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 border-t border-border-subtle" />
          <span className="type-small text-text-tertiary">or paste below</span>
          <div className="flex-1 border-t border-border-subtle" />
        </div>

        {/* Content textarea */}
        <div className="flex-1 min-h-0 mb-4">
          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Paste your transcript here..."
            className="h-full min-h-[200px] max-h-[40vh] resize-none"
            disabled={isSaving}
          />
        </div>

        {/* Character count and error */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {error && (
              <>
                <AlertCircle className="h-4 w-4 text-status-overdue" />
                <span className="type-small text-status-overdue-text">{error}</span>
              </>
            )}
          </div>
          <span
            className={cn(
              'type-small',
              isOverLimit ? 'text-status-overdue-text' : 'text-text-tertiary'
            )}
          >
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!content.trim() || isOverLimit || isSaving}
            isLoading={isSaving}
          >
            Save Transcript
          </Button>
        </div>
      </div>
    </div>
  );
}
