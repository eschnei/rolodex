import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ROLO - Authentication',
  description: 'Sign in to your ROLO account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-gradient flex flex-col items-center justify-center px-4 py-10">
      {/* Logo/Branding - Text only */}
      <div className="mb-10">
        <h1 className="text-[36px] font-bold uppercase tracking-[0.25em] text-[rgba(255,255,255,0.95)] text-shadow-lg">
          rolo
        </h1>
      </div>

      {/* Auth Content */}
      <main className="w-full max-w-[400px]">{children}</main>

      {/* Footer */}
      <div className="mt-8 text-[12px] font-medium tracking-[0.5px] text-[rgba(255,255,255,0.5)]">
        Personal Networking CRM
      </div>
    </div>
  );
}
