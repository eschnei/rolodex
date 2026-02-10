import { cn } from '@/lib/utils/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // For action buttons
  className?: string;
}

/**
 * Consistent page header with title, optional description, and action slot
 */
export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="type-h1 text-text-primary">{title}</h1>
          {description && (
            <p className="type-body text-text-secondary mt-1">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
