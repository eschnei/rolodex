'use client';

import { signOut } from '@/lib/actions/auth';
import { LogOut } from 'lucide-react';

interface UserMenuProps {
  email: string;
  variant?: 'sidebar' | 'dropdown';
}

export function UserMenu({ email, variant = 'sidebar' }: UserMenuProps) {
  // Get initials from email
  const emailPrefix = email.split('@')[0] || '';
  const initials = emailPrefix.slice(0, 2).toUpperCase() || '??';

  const handleSignOut = async () => {
    await signOut();
  };

  if (variant === 'sidebar') {
    return (
      <div className="flex items-center gap-3 px-3 py-3 border-t border-border-subtle">
        <div className="w-8 h-8 rounded-full bg-accent-subtle text-accent-text flex items-center justify-center text-[12px] font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-small text-text-primary truncate">{email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors duration-fast"
          aria-label="Sign out"
        >
          <LogOut size={16} strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-accent-subtle text-accent-text flex items-center justify-center text-[13px] font-semibold">
          {initials}
        </div>
        <p className="text-small text-text-primary truncate">{email}</p>
      </div>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 px-3 py-2 text-small text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-md transition-colors duration-fast"
      >
        <LogOut size={16} strokeWidth={1.5} />
        Sign out
      </button>
    </div>
  );
}
