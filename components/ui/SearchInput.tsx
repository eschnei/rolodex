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
 * Search input component with search icon and optional clear button
 * Follows the NetCard design system
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, value, onClear, ...props }, ref) => {
    const hasValue = value && String(value).length > 0;

    return (
      <div className={cn('relative', containerClassName)}>
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
          strokeWidth={2}
        />
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            'w-full pl-9 pr-9 py-2',
            'text-[14px] leading-relaxed bg-bg-secondary text-text-primary',
            'border border-border-primary rounded-md',
            'placeholder:text-text-tertiary',
            'focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-subtle',
            'transition-[border-color,box-shadow] duration-fast',
            // Hide default search clear button
            '[&::-webkit-search-cancel-button]:hidden',
            className
          )}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors duration-fast"
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
