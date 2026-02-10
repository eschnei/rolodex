'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="max-w-page mx-auto px-6 py-16 md:px-4 md:py-10">
      <ErrorState
        title="Something went wrong"
        message="We encountered an error loading this page. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
