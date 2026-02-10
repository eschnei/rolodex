import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RoloDex - Authentication',
  description: 'Sign in to your RoloDex account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-10">
      {/* Logo/Branding */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-inverse"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className="text-h2 text-text-primary">RoloDex</span>
        </div>
      </div>

      {/* Auth Content */}
      <main className="w-full max-w-[400px]">{children}</main>

      {/* Footer */}
      <div className="mt-8 text-caption text-text-tertiary">
        Personal Networking CRM
      </div>
    </div>
  );
}
