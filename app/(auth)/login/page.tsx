import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

function LoginFormFallback() {
  return (
    <div className="bg-[rgba(255,255,255,0.88)] backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)] border border-[rgba(255,255,255,0.5)] rounded-[20px] shadow-[0_24px_80px_rgba(0,0,0,0.2),0_8px_32px_rgba(0,0,0,0.12)] p-5">
      <div className="text-[22px] font-semibold text-[rgba(26,26,28,0.95)] mb-6 text-center">Welcome back</div>
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="flex flex-col gap-1">
          <div className="h-4 w-12 bg-[rgba(255,255,255,0.5)] rounded" />
          <div className="h-10 bg-[rgba(255,255,255,0.5)] rounded-[12px]" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-4 w-16 bg-[rgba(255,255,255,0.5)] rounded" />
          <div className="h-10 bg-[rgba(255,255,255,0.5)] rounded-[12px]" />
        </div>
        <div className="h-10 bg-[rgba(255,255,255,0.5)] rounded-[12px]" />
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
