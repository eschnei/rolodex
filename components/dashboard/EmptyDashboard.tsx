'use client';

import { CheckCircle2, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface EmptyDashboardProps {
  hasContacts: boolean;
  className?: string;
}

/**
 * Empty dashboard state with glass treatment
 *
 * States:
 * - No contacts: Prompt to add contacts
 * - All caught up: Celebration state
 */
export function EmptyDashboard({ hasContacts, className }: EmptyDashboardProps) {
  if (!hasContacts) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          'p-8 text-center',
          'rounded-[16px]',
          'bg-[rgba(255,255,255,0.6)]',
          'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
          'border border-[rgba(255,255,255,0.25)]',
          className
        )}
      >
        <div className="w-16 h-16 rounded-full bg-accent-subtle flex items-center justify-center mb-4">
          <Users size={32} className="text-accent-text" strokeWidth={1.5} />
        </div>

        <h2 className="text-[22px] font-semibold text-[rgba(26,26,28,0.95)] mb-2">
          Your network starts here.
        </h2>

        <p className="text-[14px] text-[rgba(26,26,28,0.65)] mb-6 max-w-sm">
          Add your first contact to start building and maintaining meaningful relationships.
        </p>

        <Link
          href="/contacts/new"
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2.5',
            'bg-accent text-text-inverse',
            'rounded-[12px] font-medium',
            'shadow-[0_2px_8px_rgba(91,91,214,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]',
            'hover:bg-accent-hover hover:translate-y-[-1px]',
            'hover:shadow-[0_4px_12px_rgba(91,91,214,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]',
            'transition-all duration-[120ms] ease-out',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2'
          )}
        >
          + Add Contact
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'p-8 text-center',
        'rounded-[16px]',
        'bg-[rgba(48,164,108,0.08)]',
        'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
        'border border-[rgba(48,164,108,0.2)]',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-[rgba(48,164,108,0.2)] flex items-center justify-center mb-4">
        <CheckCircle2
          size={32}
          className="text-status-ontrack"
          strokeWidth={1.5}
        />
      </div>

      <h2 className="text-[22px] font-semibold text-status-ontrack-text mb-2">
        You are all caught up!
      </h2>

      <p className="text-[14px] text-status-ontrack-text/80 max-w-sm">
        Great job staying on top of your network. All your contacts are on
        track. Keep up the good work!
      </p>
    </div>
  );
}
