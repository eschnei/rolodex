'use client';

import { CheckCircle2, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface EmptyDashboardProps {
  hasContacts: boolean;
  className?: string;
}

/**
 * Empty dashboard state component
 *
 * Shows different states based on:
 * - User has no contacts -> Prompt to add contacts
 * - User is all caught up -> Celebration state
 */
export function EmptyDashboard({ hasContacts, className }: EmptyDashboardProps) {
  if (!hasContacts) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          'p-8 bg-bg-secondary border border-border-subtle rounded-lg',
          'text-center',
          className
        )}
      >
        <div className="w-16 h-16 rounded-full bg-accent-subtle flex items-center justify-center mb-4">
          <Users size={32} className="text-accent-text" strokeWidth={1.5} />
        </div>

        <h2 className="type-h2 text-text-primary mb-2">No contacts yet</h2>

        <p className="type-body text-text-secondary mb-6 max-w-sm">
          Start building your network by adding your first contact. We will
          help you stay in touch with the people who matter.
        </p>

        <Link
          href="/contacts/new"
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2',
            'bg-accent text-text-inverse',
            'rounded-md font-medium',
            'hover:bg-accent-hover transition-colors duration-fast',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2'
          )}
        >
          Add Your First Contact
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'p-8 bg-status-ontrack-bg border border-status-ontrack/20 rounded-lg',
        'text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-status-ontrack/20 flex items-center justify-center mb-4">
        <CheckCircle2
          size={32}
          className="text-status-ontrack"
          strokeWidth={1.5}
        />
      </div>

      <h2 className="type-h2 text-status-ontrack-text mb-2">
        You are all caught up!
      </h2>

      <p className="type-body text-status-ontrack-text/80 max-w-sm">
        Great job staying on top of your network. All your contacts are on
        track. Keep up the good work!
      </p>
    </div>
  );
}
