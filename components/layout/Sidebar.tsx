'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { NavItem } from './NavItem';
import { UserMenu } from './UserMenu';

interface SidebarProps {
  email: string;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Contacts', href: '/contacts' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

/**
 * Sidebar component with glass morphism treatment
 *
 * Features:
 * - Glass background with backdrop blur
 * - Light text colors for gradient visibility
 * - Frosted glass effect showing gradient through
 */
export function Sidebar({ email }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full w-[240px]
        hidden lg:flex flex-col
        bg-[rgba(255,255,255,0.08)]
        backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]
        border-r border-[rgba(255,255,255,0.12)]
        shadow-[inset_1px_0_0_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.08)]
      `}
    >
      {/* Brand header */}
      <div className="flex items-center h-16 px-5 border-b border-[rgba(255,255,255,0.12)]">
        <span className="text-[18px] font-bold text-[rgba(255,255,255,0.95)] tracking-[-0.5px]">
          RoloDex
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
            variant="sidebar"
          />
        ))}
      </nav>

      {/* User menu */}
      <UserMenu email={email} variant="sidebar" />
    </aside>
  );
}
