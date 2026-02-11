import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ContactForm } from '@/components/contacts/ContactForm';
import { cn } from '@/lib/utils/cn';

export const metadata = {
  title: 'Add Contact | ROLO',
  description: 'Add a new contact to your network',
};

export default function NewContactPage() {
  return (
    <div className="p-4 md:p-6">
      {/* Back link */}
      <Link
        href="/contacts"
        className="inline-flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.7)] hover:text-[rgba(255,255,255,0.95)] transition-colors duration-150 mb-6"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to Contacts
      </Link>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[rgba(255,255,255,0.95)]">
          Add New Contact
        </h1>
        <p className="text-[14px] text-[rgba(255,255,255,0.6)] mt-1">
          Add someone new to your personal network
        </p>
      </div>

      {/* Contact form in glass card */}
      <div
        className={cn(
          'rounded-[16px] overflow-hidden p-5 md:p-6',
          'bg-[rgba(255,255,255,0.08)]',
          'backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]',
          'border border-[rgba(255,255,255,0.12)]',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
        )}
      >
        <ContactForm />
      </div>
    </div>
  );
}
