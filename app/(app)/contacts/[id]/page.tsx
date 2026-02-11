import { notFound } from 'next/navigation';
import { PageContainer, Card, CardBody } from '@/components/ui';
import { ContactHeader } from '@/components/contacts/ContactHeader';
import { ContactInfo } from '@/components/contacts/ContactInfo';
import { ReachedOutButton } from '@/components/contacts/ReachedOutButton';
import { DeleteContactButton } from '@/components/contacts/DeleteContactButton';
import { NotesSection } from '@/components/notes';
import { ActionItemsSection } from '@/components/actionItems';
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
      <ContactHeader contact={contact} />

      {/* Quick Actions */}
      <div className="mt-6 mb-8">
        <Card>
          <CardBody className="flex items-center justify-between gap-4">
            <div>
              <h3 className="type-body text-text-primary font-medium">
                Quick Actions
              </h3>
              <p className="type-small text-text-secondary">
                Update your contact status
              </p>
            </div>
            <ReachedOutButton contactId={contact.id} />
          </CardBody>
        </Card>
      </div>

      {/* Contact Information */}
      <ContactInfo contact={contact} />

      {/* Notes and Action Items Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes Section */}
        <NotesSection contactId={contact.id} initialNotes={notes} />

        {/* Action Items Section */}
        <ActionItemsSection
          contactId={contact.id}
          initialActionItems={actionItems}
        />
      </div>

      {/* Danger Zone */}
      <div className="mt-8 pt-8 border-t border-border-subtle">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="type-body text-text-primary font-medium">
              Danger Zone
            </h3>
            <p className="type-small text-text-secondary">
              Permanently delete this contact and all associated data
            </p>
          </div>
          <DeleteContactButton contactId={contact.id} contactName={fullName} />
        </div>
      </div>
    </PageContainer>
  );
}
