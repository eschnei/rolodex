import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card component following the NetCard design system
 *
 * Uses subtle borders to define surfaces (not shadows),
 * following the design principle of "borders to define surfaces,
 * shadows for elevated layers only"
 */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-bg-secondary border border-border-subtle rounded-lg overflow-hidden',
        className
      )}
    >
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
    <div className={cn('p-5 border-b border-border-subtle', className)}>
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
        'px-5 py-3 bg-bg-inset border-t border-border-subtle',
        className
      )}
    >
      {children}
    </div>
  );
}
