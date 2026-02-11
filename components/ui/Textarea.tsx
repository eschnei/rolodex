'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above the textarea */
  label?: string | undefined;
  /** Error message to display */
  error?: string | undefined;
  /** Helper text displayed below the textarea */
  helperText?: string | undefined;
  /** Container className for the wrapper div */
  containerClassName?: string | undefined;
}

/**
 * Textarea component with glass morphism treatment
 *
 * Features:
 * - Glass background with backdrop blur
 * - Optional label with proper accessibility
 * - Error state with visual indicator and message
 * - Helper text support
 * - Proper focus states with accent ring
 * - Vertical resize only for better UX
 * - 0.12s transitions for smooth interactions
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
            className="type-caption text-[rgba(26,26,28,0.45)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-[14px] py-[12px]',
            'text-[14px] leading-relaxed',
            'bg-[rgba(255,255,255,0.5)]',
            'backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)]',
            'text-[rgba(26,26,28,0.95)]',
            'border rounded-[12px]',
            error ? 'border-status-overdue' : 'border-[rgba(255,255,255,0.25)]',
            'placeholder:text-[rgba(26,26,28,0.45)]',
            'focus:outline-none focus:bg-[rgba(255,255,255,0.7)]',
            'focus:border-[rgba(91,91,214,0.5)]',
            'focus:shadow-[0_0_0_3px_rgba(91,91,214,0.15)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-[120ms] ease-out',
            'min-h-[100px] resize-y',
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
            className="type-caption text-[rgba(26,26,28,0.45)]"
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
