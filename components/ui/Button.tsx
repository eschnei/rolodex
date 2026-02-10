'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Loading spinner component for button loading states
 */
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show loading state with spinner */
  isLoading?: boolean;
  /** Button content */
  children: ReactNode;
}

/**
 * Button component following the NetCard design system
 *
 * Features:
 * - Four variants: primary, secondary, ghost, danger
 * - Three sizes: sm, md (default), lg
 * - Loading state with spinner
 * - Proper focus-visible states for accessibility
 * - Follows 120ms transition timing from design system
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2',
      'font-medium whitespace-nowrap',
      'transition-all duration-fast',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    );

    const variants = {
      primary: 'bg-accent text-text-inverse hover:bg-accent-hover',
      secondary:
        'bg-bg-secondary text-text-primary border border-border-primary hover:bg-bg-hover',
      ghost:
        'bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary',
      danger: 'bg-status-overdue text-text-inverse hover:bg-[#d13438]',
    };

    const sizes = {
      sm: 'text-[12px] px-[10px] py-[5px] rounded-sm',
      md: 'text-[13px] px-[14px] py-[8px] rounded-md',
      lg: 'text-[14px] px-[18px] py-[10px] rounded-md',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
