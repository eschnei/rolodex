import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/ui';
import { ContactHeader } from '@/components/contacts/ContactHeader';
import { ContactSummary } from '@/components/contacts/ContactSummary';
import { ContactInfo } from '@/components/contacts/ContactInfo';
import { ReachedOutButton } from '@/components/contacts/ReachedOutButton';
import { DeleteContactButton } from '@/components/contacts/DeleteContactButton';
import { NotesAndActionsSection } from '@/components/contacts/NotesAndActionsSection';
import { createClient } from '@/lib/supabase/server';
import type { Note, ActionItem } from '@/lib/database.types';
import { cn } from '@/lib/utils/cn';

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
    return {
      title: 'Contact Not Found | RoloDex',
    };
  }

  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  return {
    title: `${fullName} | RoloDex`,
    description: `Contact details for ${fullName}`,
  };
}

export default async function ContactDetailPage({
  params,
}: ContactDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch contact, notes, and action items in parallel
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
    <PageContainer>
      {/* Header with back nav, avatar, name, status */}
      <ContactHeader contact={contact} />

      {/* Summary Section - HERO (most prominent) */}
      <div className="mt-6">
        <ContactSummary
          summary={contact.ai_summary}
          updatedAt={contact.updated_at}
        />
      </div>

      {/* Two-column layout: Action Items + Quick Facts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Action Items Section - handled by NotesAndActionsSection */}
        {/* Quick Facts */}
        <ContactInfo contact={contact} />
      </div>

      {/* Notes & Transcripts section */}
      <NotesAndActionsSection
        contact={contact}
        initialNotes={notes}
        initialActionItems={actionItems}
      />

      {/* Danger Zone */}
      <div className="mt-8 pt-8 border-t border-[rgba(255,255,255,0.25)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[14px] font-medium text-[rgba(26,26,28,0.95)]">
              Danger Zone
            </h3>
            <p className="text-[13px] text-[rgba(26,26,28,0.65)]">
              Permanently delete this contact and all associated data
            </p>
          </div>
          <DeleteContactButton contactId={contact.id} contactName={fullName} />
        </div>
      </div>

      {/* Sticky Footer - I Just Reached Out only (no Schedule Call) */}
      <div
        className={cn(
          'sticky bottom-0 -mx-5 px-5 py-4 mt-8',
          'bg-[rgba(255,255,255,0.72)]',
          'backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]',
          'border-t border-[rgba(255,255,255,0.25)]',
          'flex justify-center'
        )}
      >
        <ReachedOutButton contactId={contact.id} />
      </div>
    </PageContainer>
  );
}
