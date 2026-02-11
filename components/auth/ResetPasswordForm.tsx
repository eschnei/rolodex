'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updatePassword } from '@/lib/actions/auth';
import { Button, Input, Card, CardBody } from '@/components/ui';

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

      setSuccess('Password updated.');

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
    <Card variant="auth">
      <CardBody>
        <h1 className="text-[22px] font-semibold text-[rgba(26,26,28,0.95)] mb-2 text-center">
          Set new password
        </h1>
        <p className="text-[14px] text-[rgba(26,26,28,0.65)] text-center mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-[12px] bg-status-overdue-bg border border-[rgba(229,72,77,0.2)]">
              <p className="text-[14px] text-status-overdue-text">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 rounded-[12px] bg-status-ontrack-bg border border-[rgba(48,164,108,0.2)]">
              <p className="text-[14px] text-status-ontrack-text">{success}</p>
              <p className="text-[12px] text-status-ontrack-text mt-1">
                Redirecting to login...
              </p>
            </div>
          )}

          {/* Password Field */}
          <Input
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            minLength={6}
            disabled={isLoading || !!success}
            helperText="Must be at least 6 characters"
          />

          {/* Confirm Password Field */}
          <Input
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
            minLength={6}
            disabled={isLoading || !!success}
          />

          {/* Submit Button */}
          {!success && (
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              {isLoading ? 'Updating password...' : 'Update password'}
            </Button>
          )}
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-[14px] text-accent-text hover:text-accent font-medium transition-colors duration-150 inline-flex items-center gap-1"
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
      </CardBody>
    </Card>
  );
}
