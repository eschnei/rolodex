import { notFound } from 'next/navigation';
import { ContactHeader } from '@/components/contacts/ContactHeader';
import { ContactFullCard } from '@/components/contacts/ContactFullCard';
import { DeleteContactButton } from '@/components/contacts/DeleteContactButton';
import { createClient } from '@/lib/supabase/server';
import type { Note, ActionItem } from '@/lib/database.types';

interface ContactDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ContactDetailPageProps) {
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
    title: `${fullName} | ROLO`,
    description: `Contact details for ${fullName}`,
  };
}

export default async function ContactDetailPage({
  params,
}: ContactDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [contactResult, notesResult, actionItemsResult] = await Promise.all([
    supabase.from('contacts').select('*').eq('id', id).single(),
    supabase
      .from('notes')
      .select('*')
      .eq('contact_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('action_items')
      .select('*')
      .eq('contact_id', id)
      .order('created_at', { ascending: false }),
  ]);

  if (contactResult.error || !contactResult.data) {
    notFound();
  }

  const contact = contactResult.data;
  const notes: Note[] = notesResult.data || [];
  const actionItems: ActionItem[] = actionItemsResult.data || [];

  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  return (
    <div className="p-4 md:p-6">
      <ContactHeader contact={contact} />

      <div className="mt-6">
        <ContactFullCard
          contact={contact}
          initialNotes={notes}
          initialActionItems={actionItems}
        />
      </div>

      {/* Danger Zone */}
      <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.12)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[14px] font-medium text-[rgba(255,255,255,0.95)]">
              Danger Zone
            </h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.6)]">
              Permanently delete this contact and all associated data
            </p>
          </div>
          <DeleteContactButton contactId={contact.id} contactName={fullName} />
        </div>
      </div>
    </div>
  );
}
