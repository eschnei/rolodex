import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageContainer } from '@/components/ui';
import { ContactForm } from '@/components/contacts/ContactForm';

export const metadata = {
  title: 'Add Contact | RoloDex',
  description: 'Add a new contact to your network',
};

export default function NewContactPage() {
  return (
    <PageContainer>
      {/* Back link */}
      <Link
        href="/contacts"
        className="inline-flex items-center gap-2 type-small text-text-secondary hover:text-text-primary transition-colors duration-fast mb-6"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to Contacts
      </Link>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="type-h1 text-text-primary">Add New Contact</h1>
        <p className="type-body text-text-secondary mt-1">
          Add someone new to your personal network
        </p>
      </div>

      {/* Contact form */}
      <div className="bg-bg-secondary border border-border-subtle rounded-lg p-6">
        <ContactForm />
      </div>
    </PageContainer>
  );
}
