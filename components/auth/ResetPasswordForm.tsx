'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updatePassword } from '@/lib/actions/auth';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePassword(password);

      if (!result.success) {
        setError(result.error || 'Failed to update password');
        setIsLoading(false);
        return;
      }

      setSuccess(result.message || 'Your password has been updated successfully.');

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-lg p-6">
      <h1 className="type-h2 text-text-primary mb-2 text-center">
        Set new password
      </h1>
      <p className="text-small text-text-secondary text-center mb-6">
        Enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-md bg-status-overdue-bg border border-status-overdue/20">
            <p className="text-small text-status-overdue-text">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 rounded-md bg-status-ontrack-bg border border-status-ontrack/20">
            <p className="text-small text-status-ontrack-text">{success}</p>
            <p className="text-caption text-status-ontrack-text mt-1">
              Redirecting to login...
            </p>
          </div>
        )}

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="type-caption text-text-tertiary">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            minLength={6}
            disabled={isLoading || !!success}
            className="w-full px-3 py-2 text-body bg-bg-secondary border border-border-primary rounded-md
                       placeholder:text-text-tertiary
                       focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-subtle
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-fast"
          />
          <span className="text-caption text-text-tertiary">
            Must be at least 6 characters
          </span>
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirmPassword"
            className="type-caption text-text-tertiary"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            required
            minLength={6}
            disabled={isLoading || !!success}
            className="w-full px-3 py-2 text-body bg-bg-secondary border border-border-primary rounded-md
                       placeholder:text-text-tertiary
                       focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-subtle
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-fast"
          />
        </div>

        {/* Submit Button */}
        {!success && (
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 text-[13px] font-medium rounded-md
                       bg-accent text-text-inverse
                       hover:bg-accent-hover
                       focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-fast
                       flex items-center justify-center gap-2 mt-2"
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
                Updating password...
              </>
            ) : (
              'Update password'
            )}
          </button>
        )}
      </form>

      {/* Back to Login Link */}
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-small text-accent-text hover:text-accent font-medium transition-colors duration-fast inline-flex items-center gap-1"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to login
        </Link>
      </div>
    </div>
  );
}
