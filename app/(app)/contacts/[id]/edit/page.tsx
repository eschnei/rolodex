import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageContainer } from '@/components/ui';
import { ContactForm } from '@/components/contacts/ContactForm';
import { createClient } from '@/lib/supabase/server';

interface EditContactPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditContactPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: contact } = await supabase
    .from('contacts')
    .select('first_name, last_name')
    .eq('id', id)
    .single();

  if (!contact) {
    return {
      title: 'Contact Not Found | RoloDex',
    };
  }

  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  return {
    title: `Edit ${fullName} | RoloDex`,
    description: `Edit contact details for ${fullName}`,
  };
}

export default async function EditContactPage({
  params,
}: EditContactPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: contact, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !contact) {
    notFound();
  }

  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  return (
    <PageContainer>
      {/* Back link */}
      <Link
        href={`/contacts/${contact.id}`}
        className="inline-flex items-center gap-2 type-small text-text-secondary hover:text-text-primary transition-colors duration-fast mb-6"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to {fullName}
      </Link>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="type-h1 text-text-primary">Edit Contact</h1>
        <p className="type-body text-text-secondary mt-1">
          Update information for {fullName}
        </p>
      </div>

      {/* Contact form */}
      <div className="bg-bg-secondary border border-border-subtle rounded-lg p-6">
        <ContactForm contact={contact} />
      </div>
    </PageContainer>
  );
}
