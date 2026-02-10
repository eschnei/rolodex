import { cn } from '@/lib/utils/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Page container with max-width and consistent padding
 * Desktop: 64px vertical, 24px horizontal
 * Mobile: 40px vertical, 16px horizontal
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        'max-w-page mx-auto px-4 py-10 md:px-6 md:py-16',
        className
      )}
    >
      {children}
    </div>
  );
}
