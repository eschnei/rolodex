'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { NavItem } from './NavItem';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Contacts', href: '/contacts' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

/**
 * Bottom navigation for mobile with glass morphism treatment
 *
 * Features:
 * - Glass background with backdrop blur
 * - Light text colors for gradient visibility
 * - Matches sidebar glass treatment
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 h-16
        flex items-center justify-around
        md:hidden
        bg-[rgba(255,255,255,0.08)]
        backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]
        border-t border-[rgba(255,255,255,0.12)]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
      `}
    >
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          isActive={pathname === item.href}
          variant="bottom"
        />
      ))}
    </nav>
  );
}
