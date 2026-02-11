'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { ProcessingStatus, ExtractedNoteData } from '@/lib/ai/types';

interface ProcessingState {
  status: ProcessingStatus;
  noteId?: string;
  error?: string;
  result?: ExtractedNoteData;
}

interface UseProcessingStatusOptions {
  /** Timeout in milliseconds (default: 60000 - 1 minute) */
  timeout?: number;
  /** Callback when processing completes */
  onComplete?: (result: ExtractedNoteData) => void;
  /** Callback when processing fails */
  onError?: (error: string) => void;
}

/**
 * Hook to manage AI processing status
 *
 * Features:
 * - Track processing state (idle, processing, completed, error)
 * - Handle timeouts
 * - Provide callbacks for completion/error
 * - Auto-cleanup on unmount
 */
export function useProcessingStatus(options: UseProcessingStatusOptions = {}) {
  const { timeout = 60000, onComplete, onError } = options;

  const [state, setState] = useState<ProcessingState>({
    status: 'idle',
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Start processing a note
   */
  const startProcessing = useCallback(
    async (noteId: string, contactId: string) => {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Set processing state
      setState({
        status: 'processing',
        noteId,
      });

      // Set timeout
      timeoutRef.current = setTimeout(() => {
        if (state.status === 'processing') {
          setState({
            status: 'error',
            noteId,
            error: 'Processing timed out. Please try again.',
          });
          onError?.('Processing timed out. Please try again.');
        }
      }, timeout);

      try {
        const response = await fetch('/api/ai/process-note', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ noteId, contactId }),
          signal: abortControllerRef.current.signal,
        });

        // Clear timeout on response
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          const errorMessage = data.error || 'Processing failed';
          setState({
            status: 'error',
            noteId,
            error: errorMessage,
          });
          onError?.(errorMessage);
          return null;
        }

        // Success
        setState({
          status: 'completed',
          noteId,
          result: data.data,
        });
        onComplete?.(data.data);
        return data.data as ExtractedNoteData;
      } catch (error) {
        // Clear timeout on error
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Ignore abort errors
        if (error instanceof Error && error.name === 'AbortError') {
          return null;
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.';

        setState({
          status: 'error',
          noteId,
          error: errorMessage,
        });
        onError?.(errorMessage);
        return null;
      }
    },
    [timeout, onComplete, onError, state.status]
  );

  /**
   * Reset to idle state
   */
  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState({ status: 'idle' });
  }, []);

  /**
   * Retry the last failed processing
   */
  const retry = useCallback(
    (contactId: string) => {
      if (state.noteId) {
        return startProcessing(state.noteId, contactId);
      }
      return null;
    },
    [state.noteId, startProcessing]
  );

  return {
    status: state.status,
    noteId: state.noteId,
    error: state.error,
    result: state.result,
    isProcessing: state.status === 'processing',
    hasError: state.status === 'error',
    isComplete: state.status === 'completed',
    startProcessing,
    reset,
    retry,
  };
}

export type { ProcessingStatus, ExtractedNoteData };
