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
 * Input component with glass morphism treatment
 *
 * Features:
 * - Glass background with backdrop blur
 * - Optional label with proper accessibility
 * - Error state with visual indicator and message
 * - Helper text support
 * - Proper focus states with accent ring
 * - 0.12s transitions for smooth interactions
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
          <label htmlFor={inputId} className="type-caption text-[rgba(26,26,28,0.45)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-[14px] py-[10px]',
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
          <span id={`${inputId}-helper`} className="type-caption text-[rgba(26,26,28,0.45)]">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
