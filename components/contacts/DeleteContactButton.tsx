'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { deleteContact } from '@/lib/actions/contacts';

interface DeleteContactButtonProps {
  contactId: string;
  contactName: string;
}

/**
 * Delete contact button with confirmation modal
 * Redirects to contacts list on successful deletion
 */
export function DeleteContactButton({
  contactId,
  contactName,
}: DeleteContactButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);

    startTransition(async () => {
      const result = await deleteContact(contactId);

      if (result.success) {
        setIsModalOpen(false);
        router.push('/contacts');
      } else {
        setError(result.error || 'Failed to delete contact');
      }
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="md"
        onClick={() => setIsModalOpen(true)}
        className="text-status-overdue-text hover:bg-status-overdue-bg"
      >
        <Trash2 size={16} strokeWidth={2} />
        Delete
      </Button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Contact"
        message={`Are you sure you want to delete ${contactName}? This action cannot be undone. All notes and action items associated with this contact will also be deleted.`}
        confirmLabel="Delete Contact"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isPending}
      />

      {error && (
        <p className="type-caption text-status-overdue-text mt-2">{error}</p>
      )}
    </>
  );
}
