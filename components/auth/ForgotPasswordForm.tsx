'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/actions/auth';
import { Button, Input, Card, CardBody } from '@/components/ui';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await resetPassword(email);

      if (!result.success) {
        setError(result.error || 'Failed to send reset email');
        setIsLoading(false);
        return;
      }

      setSuccess(result.message || 'Check your email for a reset link.');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="auth">
      <CardBody>
        <h1 className="text-[22px] font-semibold text-[rgba(26,26,28,0.95)] mb-2 text-center">
          Reset your password
        </h1>
        <p className="text-[14px] text-[rgba(26,26,28,0.65)] text-center mb-6">
          We&apos;ll send a reset link to your email.
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
            </div>
          )}

          {/* Email Field */}
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
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
              {isLoading ? 'Sending reset link...' : 'Send reset link'}
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
