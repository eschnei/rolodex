import { PageContainer, Skeleton, SkeletonList } from '@/components/ui';

/**
 * Loading state for contacts pages
 * Shows skeleton UI while content is being loaded
 */
export default function ContactsLoading() {
  return (
    <PageContainer>
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      {/* Search skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-4 w-24" />
        <SkeletonList items={5} />
      </div>
    </PageContainer>
  );
}
