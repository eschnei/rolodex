'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { NavItem } from './NavItem';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Contacts', href: '/contacts' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-bg-secondary border-t border-border-subtle flex items-center justify-around md:hidden">
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
