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

export function Sidebar({ email }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-bg-secondary border-r border-border-subtle hidden lg:flex flex-col">
      <div className="flex items-center h-16 px-5 border-b border-border-subtle">
        <span className="text-h3 text-text-primary">RoloDex</span>
      </div>

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

      <UserMenu email={email} variant="sidebar" />
    </aside>
  );
}
