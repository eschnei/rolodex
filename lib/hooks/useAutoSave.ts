'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from './useDebounce';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions<T> {
  /** Value to auto-save */
  value: T;
  /** Save function that returns a promise */
  onSave: (value: T) => Promise<void>;
  /** Debounce delay in milliseconds (default: 3000ms) */
  delay?: number;
  /** Whether auto-save is enabled (default: true) */
  enabled?: boolean;
  /** Callback when save succeeds */
  onSuccess?: () => void;
  /** Callback when save fails */
  onError?: (error: Error) => void;
}

interface UseAutoSaveReturn {
  /** Current save status */
  status: AutoSaveStatus;
  /** Whether currently saving */
  isSaving: boolean;
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Manually trigger save */
  save: () => Promise<void>;
  /** Reset status to idle */
  resetStatus: () => void;
}

/**
 * Auto-save hook with debouncing and status tracking
 *
 * Features:
 * - Debounced auto-save (default 3 seconds)
 * - Status tracking: idle, saving, saved, error
 * - Manual save trigger
 * - Unsaved changes detection
 * - Save on blur support via manual save
 *
 * @example
 * const { status, isSaving, save } = useAutoSave({
 *   value: content,
 *   onSave: async (val) => { await saveNote(val); },
 *   delay: 3000,
 * });
 */
export function useAutoSave<T>({
  value,
  onSave,
  delay = 3000,
  enabled = true,
  onSuccess,
  onError,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const [lastSavedValue, setLastSavedValue] = useState<T>(value);
  const debouncedValue = useDebounce(value, delay);
  const isFirstRender = useRef(true);
  const saveInProgress = useRef(false);

  // Determine if there are unsaved changes
  const hasUnsavedChanges = JSON.stringify(value) !== JSON.stringify(lastSavedValue);

  // Save function
  const save = useCallback(async () => {
    if (saveInProgress.current) return;
    if (!hasUnsavedChanges) return;

    saveInProgress.current = true;
    setStatus('saving');

    try {
      await onSave(value);
      setLastSavedValue(value);
      setStatus('saved');
      onSuccess?.();

      // Reset to idle after a brief moment
      setTimeout(() => {
        setStatus((current) => (current === 'saved' ? 'idle' : current));
      }, 2000);
    } catch (error) {
      setStatus('error');
      onError?.(error instanceof Error ? error : new Error('Save failed'));
    } finally {
      saveInProgress.current = false;
    }
  }, [value, hasUnsavedChanges, onSave, onSuccess, onError]);

  // Auto-save when debounced value changes
  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Don't auto-save if disabled or no changes
    if (!enabled) return;

    const debouncedHasChanges = JSON.stringify(debouncedValue) !== JSON.stringify(lastSavedValue);
    if (!debouncedHasChanges) return;

    save();
  }, [debouncedValue, enabled, lastSavedValue, save]);

  // Reset status helper
  const resetStatus = useCallback(() => {
    setStatus('idle');
  }, []);

  return {
    status,
    isSaving: status === 'saving',
    hasUnsavedChanges,
    save,
    resetStatus,
  };
}
