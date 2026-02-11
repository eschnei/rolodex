'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/actions/auth';
import { Button, Input, Card, CardBody } from '@/components/ui';

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
    <Card variant="auth">
      <CardBody>
        <h1 className="text-[22px] font-semibold text-[rgba(26,26,28,0.95)] mb-6 text-center">
          Welcome back
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-[12px] bg-status-overdue-bg border border-[rgba(229,72,77,0.2)]">
              <p className="text-[14px] text-status-overdue-text">{error}</p>
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
            disabled={isLoading}
          />

          {/* Password Field */}
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            disabled={isLoading}
          />

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-[14px] text-accent-text hover:text-accent transition-colors duration-150"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <span className="text-[14px] text-[rgba(26,26,28,0.65)]">
            Don&apos;t have an account?{' '}
          </span>
          <Link
            href="/signup"
            className="text-[14px] text-accent-text hover:text-accent font-medium transition-colors duration-150"
          >
            Sign up
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
