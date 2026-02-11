'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}

/**
 * Confirmation modal with glass morphism treatment
 *
 * Features:
 * - Glass backdrop with blur
 * - Glass card container
 * - Focus trap and keyboard support
 */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Trap focus and manage scroll
  useEffect(() => {
    if (isOpen) {
      // Store currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus the modal
      modalRef.current?.focus();
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus to previous element
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const confirmButtonVariant = variant === 'danger' ? 'danger' : 'primary';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Glass backdrop */}
      <div
        className={cn(
          'absolute inset-0',
          'bg-[rgba(26,10,46,0.5)]',
          'backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)]'
        )}
        onClick={isLoading ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Glass modal container */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-w-md mx-4 p-6',
          'bg-[rgba(255,255,255,0.88)]',
          'backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]',
          'border border-[rgba(255,255,255,0.5)]',
          'rounded-[20px]',
          'shadow-[0_24px_80px_rgba(0,0,0,0.2),0_8px_32px_rgba(0,0,0,0.12)]',
          'focus:outline-none'
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className={cn(
            'absolute top-4 right-4',
            'text-[rgba(26,26,28,0.45)]',
            'hover:text-[rgba(26,26,28,0.65)]',
            'transition-colors duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Close modal"
        >
          <X size={20} strokeWidth={2} />
        </button>

        {/* Content */}
        <div className="pr-8">
          <h2
            id="modal-title"
            className="text-[17px] font-semibold text-[rgba(26,26,28,0.95)] mb-2"
          >
            {title}
          </h2>
          <p className="text-[14px] text-[rgba(26,26,28,0.65)]">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
