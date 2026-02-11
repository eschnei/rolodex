'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ShortcutConfig {
  enableNewContact?: boolean;
  enableSearch?: boolean;
  enableEscape?: boolean;
  onSearch?: () => void;
  onEscape?: () => void;
}

/**
 * Global keyboard shortcuts hook
 *
 * Shortcuts:
 * - N: Navigate to new contact page
 * - /: Focus search input (if onSearch provided)
 * - Esc: Close modal/go back (if onEscape provided)
 */
export function useKeyboardShortcuts({
  enableNewContact = true,
  enableSearch = true,
  enableEscape = true,
  onSearch,
  onEscape,
}: ShortcutConfig = {}) {
  const router = useRouter();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      const isEditable =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isEditable) {
        // Only handle Escape in editable contexts
        if (event.key === 'Escape' && enableEscape && onEscape) {
          event.preventDefault();
          onEscape();
        }
        return;
      }

      // Don't trigger shortcuts when modifiers are held (except shift)
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'n':
          if (enableNewContact) {
            event.preventDefault();
            router.push('/contacts/new');
          }
          break;

        case '/':
          if (enableSearch && onSearch) {
            event.preventDefault();
            onSearch();
          }
          break;

        case 'escape':
          if (enableEscape && onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
      }
    },
    [router, enableNewContact, enableSearch, enableEscape, onSearch, onEscape]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
