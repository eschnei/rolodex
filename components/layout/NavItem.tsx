'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
  variant?: 'sidebar' | 'bottom';
}

/**
 * Navigation item with glass morphism treatment
 *
 * Features:
 * - Light text colors for gradient/glass backgrounds
 * - Active state with left accent border (sidebar)
 * - Smooth hover transitions
 */
export function NavItem({
  icon: Icon,
  label,
  href,
  isActive,
  variant = 'sidebar',
}: NavItemProps) {
  const baseClasses = cn(
    'flex items-center gap-2 rounded-[12px]',
    'transition-all duration-150 ease-out',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgba(255,255,255,0.8)] focus-visible:outline-offset-2'
  );

  const sidebarClasses = cn(
    'px-4 py-[10px] w-full',
    isActive
      ? 'bg-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.95)] border-l-2 border-l-[rgba(255,255,255,0.6)]'
      : 'text-[rgba(255,255,255,0.7)] hover:text-[rgba(255,255,255,0.95)] hover:bg-[rgba(255,255,255,0.08)]'
  );

  const bottomClasses = cn(
    'flex-col gap-1 py-2 px-3 min-w-[64px]',
    isActive
      ? 'text-[rgba(255,255,255,0.95)]'
      : 'text-[rgba(255,255,255,0.7)]'
  );

  return (
    <Link
      href={href}
      className={cn(baseClasses, variant === 'sidebar' ? sidebarClasses : bottomClasses)}
    >
      <Icon size={variant === 'sidebar' ? 18 : 20} strokeWidth={1.5} />
      <span
        className={cn(
          'font-medium',
          variant === 'sidebar' ? 'text-[13px]' : 'text-[11px] uppercase tracking-[0.8px]'
        )}
      >
        {label}
      </span>
    </Link>
  );
}
