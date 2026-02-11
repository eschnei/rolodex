'use client';

import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { useRouter } from 'next/navigation';

/**
 * Global keyboard shortcuts component
 *
 * Add this to layouts to enable global shortcuts:
 * - N: New contact
 * - Esc: Go back
 */
export function KeyboardShortcuts() {
  const router = useRouter();

  useKeyboardShortcuts({
    enableNewContact: true,
    enableSearch: false, // Search handled by individual pages
    enableEscape: true,
    onEscape: () => router.back(),
  });

  return null;
}
