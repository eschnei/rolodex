import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RoloDex - Personal Networking CRM',
  description:
    'A personal CRM to manage your professional network with AI-powered insights and relationship tracking.',
  keywords: ['CRM', 'networking', 'contacts', 'relationships', 'personal CRM'],
  authors: [{ name: 'RoloDex' }],
  openGraph: {
    title: 'RoloDex - Personal Networking CRM',
    description:
      'A personal CRM to manage your professional network with AI-powered insights and relationship tracking.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className={jetbrainsMono.className}>{children}</body>
    </html>
  );
}
