'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
  variant?: 'sidebar' | 'bottom';
}

export function NavItem({
  icon: Icon,
  label,
  href,
  isActive,
  variant = 'sidebar',
}: NavItemProps) {
  const baseClasses =
    'flex items-center gap-2 rounded-md transition-colors duration-fast';

  const sidebarClasses = `
    px-3 py-2 w-full
    ${
      isActive
        ? 'bg-accent-subtle text-accent-text'
        : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
    }
  `;

  const bottomClasses = `
    flex-col gap-1 py-2 px-3 min-w-[64px]
    ${
      isActive
        ? 'text-accent-text'
        : 'text-text-secondary'
    }
  `;

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variant === 'sidebar' ? sidebarClasses : bottomClasses}`}
    >
      <Icon size={variant === 'sidebar' ? 18 : 20} strokeWidth={1.5} />
      <span
        className={
          variant === 'sidebar' ? 'text-small font-medium' : 'text-[11px] font-medium'
        }
      >
        {label}
      </span>
    </Link>
  );
}
