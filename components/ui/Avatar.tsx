import { cn } from '@/lib/utils/cn';

interface AvatarProps {
  firstName: string;
  lastName?: string | null;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * Avatar component showing user initials
 * Size: sm (28px), md (36px - default), lg (48px)
 * Variant: light (for light backgrounds), dark (for dark/glass backgrounds)
 */
export function Avatar({
  firstName,
  lastName,
  size = 'md',
  variant = 'dark',
  className,
}: AvatarProps) {
  // Get initials from first and last name
  const initials = getInitials(firstName, lastName);

  const sizes = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-[13px]',
    lg: 'w-12 h-12 text-[16px]',
  };

  const variants = {
    light: 'bg-accent-subtle text-accent-text',
    dark: 'bg-[rgba(91,91,214,0.3)] text-[rgba(255,255,255,0.95)] border border-[rgba(91,91,214,0.4)]',
  };

  return (
    <div
      className={cn(
        'rounded-full',
        'flex items-center justify-center',
        'font-medium uppercase select-none',
        'shrink-0',
        sizes[size],
        variants[variant],
        className
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/**
 * Extract initials from first and last name
 * Returns first letter of first name + first letter of last name
 * Falls back to first two letters of first name if no last name
 */
function getInitials(firstName: string, lastName?: string | null): string {
  const first = firstName.trim().charAt(0).toUpperCase();

  if (lastName && lastName.trim()) {
    return first + lastName.trim().charAt(0).toUpperCase();
  }

  // If no last name, try to get second character from first name
  if (firstName.trim().length > 1) {
    return first + firstName.trim().charAt(1).toUpperCase();
  }

  return first;
}
