'use client';

import { useState, useTransition } from 'react';
import { Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { markContactAsReachedOut } from '@/lib/actions/contacts';

interface ReachedOutButtonProps {
  contactId: string;
}

/**
 * Quick action button to mark that the user just contacted someone
 * Updates last_contacted_at to current timestamp
 */
export function ReachedOutButton({ contactId }: ReachedOutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await markContactAsReachedOut(contactId);

      if (result.success) {
        setSuccess(true);
        // Reset success state after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to update');
      }
    });
  };

  if (success) {
    return (
      <Button
        variant="secondary"
        size="md"
        disabled
        className="bg-status-ontrack-bg border-status-ontrack text-status-ontrack-text"
      >
        <Check size={16} strokeWidth={2} />
        Updated!
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        variant="primary"
        size="md"
        onClick={handleClick}
        isLoading={isPending}
      >
        <MessageCircle size={16} strokeWidth={2} />
        I Just Reached Out
      </Button>
      {error && (
        <span className="type-caption text-status-overdue-text">{error}</span>
      )}
    </div>
  );
}
