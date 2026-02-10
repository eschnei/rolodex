import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 text-center">
      <div className="text-8xl font-bold text-text-tertiary mb-4">404</div>
      <h1 className="type-h2 text-text-primary mb-2">Page not found</h1>
      <p className="type-body text-text-secondary max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-text-inverse rounded-md hover:bg-accent-hover transition-colors duration-fast"
      >
        <Home className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
