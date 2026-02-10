import { SkeletonList } from '@/components/ui/Skeleton';

export default function AppLoading() {
  return (
    <div className="max-w-page mx-auto px-6 py-16 md:px-4 md:py-10">
      <div className="mb-8">
        <div className="h-8 w-48 bg-bg-inset rounded-md animate-pulse mb-2" />
        <div className="h-5 w-72 bg-bg-inset rounded-md animate-pulse" />
      </div>
      <div className="bg-bg-secondary border border-border-subtle rounded-lg p-5">
        <SkeletonList items={5} />
      </div>
    </div>
  );
}
