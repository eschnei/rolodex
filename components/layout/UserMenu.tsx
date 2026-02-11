'use client';

import { signOut } from '@/lib/actions/auth';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface UserMenuProps {
  email: string;
  variant?: 'sidebar' | 'dropdown';
}

/**
 * User menu component with glass morphism treatment
 *
 * Features:
 * - Light text colors for gradient backgrounds
 * - Glass avatar background
 * - Smooth hover transitions
 */
export function UserMenu({ email, variant = 'sidebar' }: UserMenuProps) {
  // Get initials from email
  const emailPrefix = email.split('@')[0] || '';
  const initials = emailPrefix.slice(0, 2).toUpperCase() || '??';

  const handleSignOut = async () => {
    await signOut();
  };

  if (variant === 'sidebar') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-3',
          'bg-[rgba(255,255,255,0.06)]',
          'border-t border-[rgba(255,255,255,0.12)]'
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            'w-8 h-8 rounded-full flex-shrink-0',
            'flex items-center justify-center',
            'text-[12px] font-semibold',
            'bg-[rgba(255,255,255,0.15)]',
            'border border-[rgba(255,255,255,0.2)]',
            'text-[rgba(255,255,255,0.95)]'
          )}
        >
          {initials}
        </div>

        {/* Email */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-[rgba(255,255,255,0.7)] truncate">
            {email}
          </p>
        </div>

        {/* Sign out button */}
        <button
          onClick={handleSignOut}
          className={cn(
            'p-1.5 rounded-[8px]',
            'text-[rgba(255,255,255,0.5)]',
            'hover:text-[rgba(255,255,255,0.95)]',
            'hover:bg-[rgba(255,255,255,0.08)]',
            'transition-all duration-150 ease-out',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.8)] focus-visible:outline-offset-2'
          )}
          aria-label="Sign out"
        >
          <LogOut size={16} strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-9 h-9 rounded-full',
            'flex items-center justify-center',
            'text-[13px] font-semibold',
            'bg-[rgba(255,255,255,0.15)]',
            'border border-[rgba(255,255,255,0.2)]',
            'text-[rgba(255,255,255,0.95)]'
          )}
        >
          {initials}
        </div>
        <p className="text-[13px] text-[rgba(255,255,255,0.7)] truncate">
          {email}
        </p>
      </div>
      <button
        onClick={handleSignOut}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-[8px]',
          'text-[13px] text-[rgba(255,255,255,0.7)]',
          'hover:text-[rgba(255,255,255,0.95)]',
          'hover:bg-[rgba(255,255,255,0.08)]',
          'transition-all duration-150 ease-out'
        )}
      >
        <LogOut size={16} strokeWidth={1.5} />
        Sign out
      </button>
    </div>
  );
}
