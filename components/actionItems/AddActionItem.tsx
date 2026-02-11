'use client';

import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { createActionItem } from '@/lib/actions/actionItems';

interface AddActionItemProps {
  /** Contact ID to create action item for */
  contactId: string;
  /** Callback when action item is created */
  onCreated?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * Inline input for adding new action items
 *
 * Features:
 * - Expandable inline input
 * - Submit on Enter
 * - Clear after successful creation
 * - Loading state
 */
export function AddActionItem({
  contactId,
  onCreated,
  className,
}: AddActionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!description.trim() || isCreating) return;

    setIsCreating(true);
    setError(null);

    try {
      const result = await createActionItem(contactId, description);
      if (result.success) {
        setDescription('');
        setIsExpanded(false);
        onCreated?.();
      } else {
        setError(result.error || 'Failed to create action item');
      }
    } catch {
      setError('Failed to create action item. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setDescription('');
      setError(null);
    }
  };

  const handleExpand = () => {
    setIsExpanded(true);
    // Focus input after expansion
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={handleExpand}
        className={cn(
          'w-full p-3 rounded-lg',
          'border border-dashed border-border-primary',
          'hover:border-accent hover:bg-accent-subtle/30',
          'transition-all duration-fast',
          'flex items-center justify-center gap-2',
          'text-text-secondary hover:text-accent-text',
          'type-body',
          className
        )}
      >
        <Plus size={16} strokeWidth={2} />
        Add Action Item
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-2', className)}
    >
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          disabled={isCreating}
          error={error || undefined}
          className="flex-1"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!description.trim() || isCreating}
          isLoading={isCreating}
        >
          Add
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsExpanded(false);
            setDescription('');
            setError(null);
          }}
          disabled={isCreating}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
