import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ContactForm } from '@/components/contacts/ContactForm';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils/cn';

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
    return { title: 'Contact Not Found | ROLO' };
  }

  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  return {
    title: `Edit ${fullName} | ROLO`,
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
    <div className="p-4 md:p-6">
      {/* Back link */}
      <Link
        href={`/contacts/${contact.id}`}
        className="inline-flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.7)] hover:text-[rgba(255,255,255,0.95)] transition-colors duration-150 mb-6"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to {fullName}
      </Link>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-[rgba(255,255,255,0.95)]">
          Edit Contact
        </h1>
        <p className="text-[14px] text-[rgba(255,255,255,0.6)] mt-1">
          Update information for {fullName}
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
        <ContactForm contact={contact} />
      </div>
    </div>
  );
}
