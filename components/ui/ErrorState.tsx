'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-status-overdue-bg flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-status-overdue-text" />
      </div>
      <h2 className="type-h3 text-text-primary mb-2">{title}</h2>
      <p className="type-small text-text-secondary max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-text-inverse rounded-md hover:bg-accent-hover transition-colors duration-fast"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
