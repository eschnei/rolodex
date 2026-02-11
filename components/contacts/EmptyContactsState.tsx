import Link from 'next/link';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui';

/**
 * Empty state shown when user has no contacts
 * Displays an icon, message, and call-to-action button
 */
export function EmptyContactsState() {
  return (
    <div className="p-8 bg-bg-secondary border border-border-subtle rounded-lg flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-full bg-bg-inset flex items-center justify-center mb-4">
        <Users size={24} className="text-text-tertiary" strokeWidth={1.5} />
      </div>
      <h2 className="type-h3 text-text-primary mb-2">No contacts yet</h2>
      <p className="type-body text-text-secondary mb-6 max-w-sm">
        Add your first contact to start building your personal network and never lose touch with the people who matter.
      </p>
      <Link href="/contacts/new">
        <Button variant="primary" size="md">
          <Plus size={16} strokeWidth={2} />
          Add Your First Contact
        </Button>
      </Link>
    </div>
  );
}
