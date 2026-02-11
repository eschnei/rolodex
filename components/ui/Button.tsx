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
 * Button component with glass morphism treatment
 *
 * Features:
 * - Four variants: primary, secondary (glass), ghost, danger
 * - Three sizes: sm, md (default), lg
 * - Loading state with spinner
 * - Hover lift animation
 * - Proper focus-visible states for accessibility
 * - 0.12s transitions for premium feel
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
      'transition-all duration-[120ms] ease-out',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
    );

    const variants = {
      primary: cn(
        'bg-accent text-text-inverse',
        'shadow-[0_2px_8px_rgba(91,91,214,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]',
        'hover:bg-accent-hover hover:translate-y-[-1px]',
        'hover:shadow-[0_4px_12px_rgba(91,91,214,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]',
        'active:translate-y-0'
      ),
      secondary: cn(
        'bg-[rgba(255,255,255,0.5)]',
        'backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)]',
        'text-[rgba(26,26,28,0.95)]',
        'border border-[rgba(255,255,255,0.4)]',
        'hover:bg-[rgba(255,255,255,0.7)]',
        'hover:border-[rgba(255,255,255,0.5)]'
      ),
      ghost: cn(
        'bg-transparent',
        'text-[rgba(26,26,28,0.65)]',
        'hover:bg-[rgba(255,255,255,0.3)]',
        'hover:text-[rgba(26,26,28,0.95)]'
      ),
      danger: cn(
        'bg-status-overdue text-text-inverse',
        'shadow-[0_2px_8px_rgba(229,72,77,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]',
        'hover:bg-[#d13438] hover:translate-y-[-1px]',
        'active:translate-y-0'
      ),
    };

    const sizes = {
      sm: 'text-[12px] px-[10px] py-[5px] rounded-[8px]',
      md: 'text-[13px] px-[14px] py-[8px] rounded-[12px]',
      lg: 'text-[14px] px-[18px] py-[10px] rounded-[12px]',
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
