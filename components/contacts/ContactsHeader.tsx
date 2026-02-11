'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';

interface ContactsHeaderProps {
  contactCount?: number;
}

/**
 * Header for the contacts list page
 * Displays title with contact count and add contact button
 */
export function ContactsHeader({ contactCount = 0 }: ContactsHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="type-h1 text-text-primary">Contacts</h1>
          {contactCount > 0 && (
            <p className="type-small text-text-secondary mt-1">
              {contactCount} {contactCount === 1 ? 'contact' : 'contacts'}
            </p>
          )}
        </div>
        <Link href="/contacts/new">
          <Button variant="primary" size="md">
            <Plus size={16} strokeWidth={2} />
            Add Contact
          </Button>
        </Link>
      </div>
    </div>
  );
}
