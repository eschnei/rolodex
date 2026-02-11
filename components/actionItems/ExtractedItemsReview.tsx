'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, X, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { createActionItem } from '@/lib/actions/actionItems';

interface ExtractedItemsReviewProps {
  /** Extracted action items from AI */
  items: string[];
  /** Contact ID to create action items for */
  contactId: string;
  /** Source note ID for tracking */
  sourceNoteId: string;
  /** Callback when items are accepted */
  onItemsAccepted?: () => void;
  /** Callback when review is dismissed */
  onDismiss?: () => void;
  /** Auto-dismiss timeout in seconds (default: 30) */
  autoDismissSeconds?: number;
  /** Additional className */
  className?: string;
}

interface ItemState {
  text: string;
  status: 'pending' | 'accepted' | 'rejected';
  isLoading: boolean;
}

/**
 * Review UI for AI-extracted action items
 *
 * Features:
 * - Individual accept/reject per item
 * - "Add all" and "Dismiss" buttons
 * - Creates items with source_note_id on accept
 * - Auto-dismiss after 30 seconds
 * - Inline notification/toast style
 */
export function ExtractedItemsReview({
  items,
  contactId,
  sourceNoteId,
  onItemsAccepted,
  onDismiss,
  autoDismissSeconds = 30,
  className,
}: ExtractedItemsReviewProps) {
  // Initialize item states
  const [itemStates, setItemStates] = useState<ItemState[]>(
    items.map((text) => ({
      text,
      status: 'pending',
      isLoading: false,
    }))
  );
  const [timeRemaining, setTimeRemaining] = useState(autoDismissSeconds);
  const [isAddingAll, setIsAddingAll] = useState(false);

  // Auto-dismiss countdown
  useEffect(() => {
    if (timeRemaining <= 0) {
      onDismiss?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onDismiss]);

  // Check if all items are handled
  const allHandled = itemStates.every((item) => item.status !== 'pending');
  const pendingItems = itemStates.filter((item) => item.status === 'pending');
  const hasAccepted = itemStates.some((item) => item.status === 'accepted');

  // Auto-dismiss when all items are handled
  useEffect(() => {
    if (allHandled && hasAccepted) {
      const timer = setTimeout(() => {
        onItemsAccepted?.();
        onDismiss?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [allHandled, hasAccepted, onItemsAccepted, onDismiss]);

  // Accept a single item
  const acceptItem = useCallback(
    async (index: number) => {
      const itemText = itemStates[index]?.text;
      if (!itemText) return;

      setItemStates((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, isLoading: true } : item
        )
      );

      const result = await createActionItem(
        contactId,
        itemText,
        sourceNoteId
      );

      setItemStates((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                isLoading: false,
                status: result.success ? 'accepted' : 'pending',
              }
            : item
        )
      );
    },
    [contactId, itemStates, sourceNoteId]
  );

  // Reject a single item
  const rejectItem = useCallback((index: number) => {
    setItemStates((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, status: 'rejected' } : item
      )
    );
  }, []);

  // Add all pending items
  const addAll = useCallback(async () => {
    setIsAddingAll(true);

    const pendingIndices = itemStates
      .map((item, i) => (item.status === 'pending' ? i : -1))
      .filter((i) => i !== -1);

    for (const index of pendingIndices) {
      await acceptItem(index);
    }

    setIsAddingAll(false);
  }, [itemStates, acceptItem]);

  // Dismiss all
  const dismissAll = useCallback(() => {
    setItemStates((prev) =>
      prev.map((item) =>
        item.status === 'pending' ? { ...item, status: 'rejected' } : item
      )
    );
    onDismiss?.();
  }, [onDismiss]);

  // Don't render if no items
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'bg-bg-secondary border border-border-subtle rounded-lg shadow-md',
        'overflow-hidden',
        className
      )}
      role="region"
      aria-label="Suggested action items"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-inset border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="type-body font-medium text-text-primary">
            Suggested action items
          </span>
          <span className="type-small text-text-tertiary">
            ({pendingItems.length} pending)
          </span>
        </div>

        {/* Auto-dismiss timer */}
        <div className="flex items-center gap-1 text-text-tertiary">
          <Clock className="h-3.5 w-3.5" />
          <span className="type-caption tabular-nums">{timeRemaining}s</span>
        </div>
      </div>

      {/* Items list */}
      <div className="divide-y divide-border-subtle">
        {itemStates.map((item, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center gap-3 px-4 py-3 transition-colors duration-200',
              item.status === 'accepted' && 'bg-status-ontrack-bg/50',
              item.status === 'rejected' && 'bg-bg-inset opacity-50'
            )}
          >
            {/* Item text */}
            <p
              className={cn(
                'flex-1 type-body',
                item.status === 'rejected' && 'line-through text-text-tertiary',
                item.status === 'accepted' && 'text-text-primary',
                item.status === 'pending' && 'text-text-primary'
              )}
            >
              {item.text}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {item.status === 'pending' && (
                <>
                  <button
                    onClick={() => acceptItem(index)}
                    disabled={item.isLoading}
                    className={cn(
                      'p-1.5 rounded-md transition-colors',
                      'hover:bg-status-ontrack-bg text-text-tertiary hover:text-status-ontrack-text',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    title="Accept"
                    aria-label="Accept this action item"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => rejectItem(index)}
                    disabled={item.isLoading}
                    className={cn(
                      'p-1.5 rounded-md transition-colors',
                      'hover:bg-status-overdue-bg text-text-tertiary hover:text-status-overdue-text',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    title="Reject"
                    aria-label="Reject this action item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
              {item.status === 'accepted' && (
                <span className="type-small text-status-ontrack-text flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Added
                </span>
              )}
              {item.status === 'rejected' && (
                <span className="type-small text-text-tertiary">
                  Dismissed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      {pendingItems.length > 0 && (
        <div className="flex items-center justify-end gap-2 px-4 py-3 bg-bg-inset border-t border-border-subtle">
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissAll}
            disabled={isAddingAll}
          >
            Dismiss all
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={addAll}
            isLoading={isAddingAll}
            disabled={isAddingAll}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add all ({pendingItems.length})
          </Button>
        </div>
      )}
    </div>
  );
}
