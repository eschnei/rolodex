'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ConfirmModal, RelativeTime } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { toggleActionItem, deleteActionItem } from '@/lib/actions/actionItems';
import type { ActionItem as ActionItemType } from '@/lib/database.types';

interface ActionItemProps {
  /** Action item data */
  actionItem: ActionItemType;
  /** Callback when item is toggled or deleted */
  onUpdated?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * Individual action item component
 *
 * Features:
 * - Checkbox with optimistic toggle
 * - Strikethrough and muted text when completed
 * - Delete button with confirmation
 * - Relative timestamp
 */
export function ActionItem({
  actionItem,
  onUpdated,
  className,
}: ActionItemProps) {
  const [isCompleted, setIsCompleted] = useState(actionItem.is_completed);
  const [isToggling, setIsToggling] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    if (isToggling) return;

    // Optimistic update
    const previousValue = isCompleted;
    setIsCompleted(!isCompleted);
    setIsToggling(true);

    try {
      const result = await toggleActionItem(actionItem.id);
      if (!result.success) {
        // Revert on failure
        setIsCompleted(previousValue);
      } else {
        onUpdated?.();
      }
    } catch {
      // Revert on error
      setIsCompleted(previousValue);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteActionItem(actionItem.id);
      if (result.success) {
        onUpdated?.();
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          'group flex items-start gap-3 p-3',
          'bg-bg-secondary rounded-lg border border-border-subtle',
          'hover:border-border-primary transition-colors duration-fast',
          className
        )}
      >
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-0.5">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleToggle}
            disabled={isToggling}
            className={cn(
              'h-4 w-4 rounded border-border-primary',
              'text-accent focus:ring-accent focus:ring-offset-0',
              'cursor-pointer disabled:cursor-wait',
              'transition-colors duration-fast'
            )}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'type-body break-words',
              isCompleted
                ? 'text-text-tertiary line-through'
                : 'text-text-primary'
            )}
          >
            {actionItem.description}
          </p>
          <span className="type-small text-text-tertiary">
            <RelativeTime date={actionItem.created_at} showTooltip />
          </span>
        </div>

        {/* Delete button */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className={cn(
            'flex-shrink-0 p-1.5 rounded-md',
            'text-text-tertiary hover:text-status-overdue',
            'hover:bg-status-overdue-bg',
            'opacity-0 group-hover:opacity-100',
            'transition-all duration-fast',
            'focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'
          )}
          aria-label="Delete action item"
        >
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Action Item"
        message="Are you sure you want to delete this action item? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
