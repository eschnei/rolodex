import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

function LoginFormFallback() {
  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-lg p-6">
      <div className="type-h2 text-text-primary mb-6 text-center">Welcome back</div>
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="flex flex-col gap-1">
          <div className="h-4 w-12 bg-bg-inset rounded" />
          <div className="h-10 bg-bg-inset rounded-md" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-4 w-16 bg-bg-inset rounded" />
          <div className="h-10 bg-bg-inset rounded-md" />
        </div>
        <div className="h-10 bg-bg-inset rounded-md" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}
