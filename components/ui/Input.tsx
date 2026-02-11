'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input */
  label?: string | undefined;
  /** Error message to display */
  error?: string | undefined;
  /** Helper text displayed below the input */
  helperText?: string | undefined;
  /** Container className for the wrapper div */
  containerClassName?: string | undefined;
}

/**
 * Input component following the NetCard design system
 *
 * Features:
 * - Optional label with proper accessibility
 * - Error state with visual indicator and message
 * - Helper text support
 * - Proper focus states with accent ring
 * - Follows design system spacing and typography
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
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
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-1', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="type-caption text-text-tertiary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2',
            'text-[14px] leading-relaxed bg-bg-secondary text-text-primary',
            'border rounded-md',
            error ? 'border-status-overdue' : 'border-border-primary',
            'placeholder:text-text-tertiary',
            'focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-subtle',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-[border-color,box-shadow] duration-fast',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />
        {error && (
          <span
            id={`${inputId}-error`}
            className="type-caption text-status-overdue-text"
            role="alert"
          >
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={`${inputId}-helper`} className="type-caption text-text-tertiary">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
