'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Handler for clearing the search input */
  onClear?: () => void;
  /** Container className for the wrapper div */
  containerClassName?: string;
}

/**
 * Search input with dark glass morphism treatment
 *
 * Features:
 * - Dark glass background with backdrop blur
 * - Search icon on left
 * - Optional clear button on right
 * - Smooth focus transitions
 * - Light text for dark backgrounds
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, value, onClear, ...props }, ref) => {
    const hasValue = value && String(value).length > 0;

    return (
      <div className={cn('relative', containerClassName)}>
        {/* Search icon */}
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.5)] pointer-events-none"
          strokeWidth={2}
        />

        {/* Input */}
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            'w-full pl-[44px] pr-10 py-3',
            'text-[14px] leading-relaxed',
            'bg-[rgba(255,255,255,0.08)]',
            'backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]',
            'text-[rgba(255,255,255,0.95)]',
            'border border-[rgba(255,255,255,0.12)]',
            'rounded-[16px]',
            'placeholder:text-[rgba(255,255,255,0.4)]',
            'focus:outline-none focus:bg-[rgba(255,255,255,0.12)]',
            'focus:border-[rgba(91,91,214,0.5)]',
            'focus:shadow-[0_0_0_3px_rgba(91,91,214,0.2)]',
            'transition-all duration-[120ms] ease-out',
            // Hide default search clear button
            '[&::-webkit-search-cancel-button]:hidden',
            className
          )}
          {...props}
        />

        {/* Clear button */}
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'text-[rgba(255,255,255,0.5)]',
              'hover:text-[rgba(255,255,255,0.8)]',
              'transition-colors duration-150'
            )}
            aria-label="Clear search"
          >
            <X size={16} strokeWidth={2} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
