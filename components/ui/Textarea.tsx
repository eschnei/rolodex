'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above the textarea */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text displayed below the textarea */
  helperText?: string;
  /** Container className for the wrapper div */
  containerClassName?: string;
}

/**
 * Textarea component following the NetCard design system
 *
 * Features:
 * - Optional label with proper accessibility
 * - Error state with visual indicator and message
 * - Helper text support
 * - Proper focus states with accent ring
 * - Follows design system spacing and typography
 * - Vertical resize only for better UX
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      id,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-1', containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="type-caption text-text-tertiary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-3 py-[10px]',
            'text-[14px] leading-relaxed bg-bg-secondary text-text-primary',
            'border rounded-md',
            error ? 'border-status-overdue' : 'border-border-primary',
            'placeholder:text-text-tertiary',
            'focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-subtle',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-[border-color,box-shadow] duration-fast',
            'min-h-[80px] resize-y',
            'leading-relaxed',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
                ? `${textareaId}-helper`
                : undefined
          }
          {...props}
        />
        {error && (
          <span
            id={`${textareaId}-error`}
            className="type-caption text-status-overdue-text"
            role="alert"
          >
            {error}
          </span>
        )}
        {!error && helperText && (
          <span
            id={`${textareaId}-helper`}
            className="type-caption text-text-tertiary"
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
