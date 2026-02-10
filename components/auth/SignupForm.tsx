'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signUp } from '@/lib/actions/auth';
import { Button, Input, Card, CardBody } from '@/components/ui';

export default function SignupForm() {
  const [email, setEmail] = useState('');
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
      const result = await signUp(email, password);

      if (!result.success) {
        setError(result.error || 'Failed to create account');
        setIsLoading(false);
        return;
      }

      setSuccess('Check your email for a confirmation link.');
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <h1 className="type-h2 text-text-primary mb-6 text-center">
          Create your account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-md bg-accent-subtle border border-accent/20">
              <p className="type-small text-accent-text">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 rounded-md bg-accent-subtle border border-accent/20">
              <p className="type-small text-accent-text">{success}</p>
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

          {/* Password Field */}
          <Input
            type="password"
            label="Password"
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
            label="Confirm Password"
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
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          )}
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <span className="type-small text-text-secondary">
            Already have an account?{' '}
          </span>
          <Link
            href="/login"
            className="type-small text-accent-text hover:text-accent font-medium transition-colors duration-fast"
          >
            Sign in
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
