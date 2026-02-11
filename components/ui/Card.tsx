import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type CardVariant = 'default' | 'glass' | 'inset' | 'elevated' | 'overdue' | 'due' | 'ontrack' | 'auth';

interface CardProps {
  children: ReactNode;
  className?: string | undefined;
  variant?: CardVariant;
}

/**
 * Card component with glass morphism variants
 *
 * Variants:
 * - default: Standard card (backward compatible)
 * - glass: Primary glass card with backdrop blur
 * - inset: Nested/recessed glass card
 * - elevated: Elevated glass card for dropdowns/overlays
 * - overdue: Status-tinted red glass
 * - due: Status-tinted amber glass
 * - ontrack: Status-tinted green glass
 * - auth: Glass card for auth screens on gradient backgrounds
 */
export function Card({ children, className, variant = 'default' }: CardProps) {
  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-bg-secondary border border-border-subtle rounded-lg overflow-hidden',
    glass: cn(
      'rounded-[16px] overflow-hidden',
      'bg-[rgba(255,255,255,0.72)]',
      'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
      'border border-[rgba(255,255,255,0.4)]',
      'shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)]',
      'transition-all duration-150',
      'hover:bg-[rgba(255,255,255,0.82)]'
    ),
    inset: cn(
      'rounded-[12px] overflow-hidden',
      'bg-[rgba(255,255,255,0.45)]',
      'backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)]',
      'border border-[rgba(255,255,255,0.25)]',
      'shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]'
    ),
    elevated: cn(
      'rounded-[16px] overflow-hidden',
      'bg-[rgba(255,255,255,0.88)]',
      'backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]',
      'border border-[rgba(255,255,255,0.5)]',
      'shadow-[0_16px_48px_rgba(0,0,0,0.16),0_4px_16px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)]'
    ),
    overdue: cn(
      'rounded-[16px] overflow-hidden',
      'bg-[rgba(229,72,77,0.08)]',
      'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
      'border border-[rgba(229,72,77,0.2)]',
      'border-l-[3px] border-l-[rgba(229,72,77,0.6)]'
    ),
    due: cn(
      'rounded-[16px] overflow-hidden',
      'bg-[rgba(240,158,0,0.08)]',
      'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
      'border border-[rgba(240,158,0,0.2)]',
      'border-l-[3px] border-l-[rgba(240,158,0,0.5)]'
    ),
    ontrack: cn(
      'rounded-[16px] overflow-hidden',
      'bg-[rgba(48,164,108,0.08)]',
      'backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]',
      'border border-[rgba(48,164,108,0.2)]',
      'border-l-[3px] border-l-[rgba(48,164,108,0.5)]'
    ),
    auth: cn(
      'rounded-[20px] overflow-hidden',
      'bg-[rgba(255,255,255,0.88)]',
      'backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]',
      'border border-[rgba(255,255,255,0.5)]',
      'shadow-[0_24px_80px_rgba(0,0,0,0.2),0_8px_32px_rgba(0,0,0,0.12)]'
    ),
  };

  return (
    <div className={cn(variantStyles[variant], className)}>
      {children}
    </div>
  );
}

/**
 * Card header section with bottom border
 * Uses space-5 (20px) padding per design system
 */
export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('p-5 border-b border-[rgba(255,255,255,0.25)]', className)}>
      {children}
    </div>
  );
}

/**
 * Card body section
 * Uses space-5 (20px) padding per design system
 */
export function CardBody({ children, className }: CardProps) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

/**
 * Card footer section with top border and inset background
 * Uses space-3 (12px) vertical and space-5 (20px) horizontal padding
 */
export function CardFooter({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'px-5 py-3 bg-[rgba(255,255,255,0.3)] border-t border-[rgba(255,255,255,0.25)]',
        className
      )}
    >
      {children}
    </div>
  );
}
