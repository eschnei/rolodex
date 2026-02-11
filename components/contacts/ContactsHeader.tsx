'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Header for the contacts list page
 * Dark glass styling with Add Contact button
 */
export function ContactsHeader() {
  return (
    <div className="flex items-center justify-end mb-4">
      <Link
        href="/contacts/new"
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2',
          'bg-accent text-text-inverse',
          'rounded-[12px] text-[13px] font-medium',
          'hover:bg-accent-hover hover:translate-y-[-1px]',
          'transition-all duration-150',
          'shadow-[0_2px_8px_rgba(91,91,214,0.3)]'
        )}
      >
        <Plus size={16} strokeWidth={2} />
        Add Contact
      </Link>
    </div>
  );
}
