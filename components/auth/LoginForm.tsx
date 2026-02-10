'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/actions/auth';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for error parameters from callback
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'auth_callback_error') {
      setError('Authentication failed. Please try again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (!result.success) {
        setError(result.error || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-lg p-6">
      <h1 className="type-h2 text-text-primary mb-6 text-center">Welcome back</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-md bg-status-overdue-bg border border-status-overdue/20">
            <p className="text-small text-status-overdue-text">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="type-caption text-text-tertiary">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isLoading}
            className="w-full px-3 py-2 text-body bg-bg-secondary border border-border-primary rounded-md
                       placeholder:text-text-tertiary
                       focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-subtle
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-fast"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="type-caption text-text-tertiary">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={isLoading}
            className="w-full px-3 py-2 text-body bg-bg-secondary border border-border-primary rounded-md
                       placeholder:text-text-tertiary
                       focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-subtle
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-fast"
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-small text-accent-text hover:text-accent transition-colors duration-fast"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 text-[13px] font-medium rounded-md
                     bg-accent text-text-inverse
                     hover:bg-accent-hover
                     focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-fast
                     flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <span className="text-small text-text-secondary">
          Don&apos;t have an account?{' '}
        </span>
        <Link
          href="/signup"
          className="text-small text-accent-text hover:text-accent font-medium transition-colors duration-fast"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
