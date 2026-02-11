import { notFound } from 'next/navigation';
import { PageContainer, Card, CardBody } from '@/components/ui';
import { ContactHeader } from '@/components/contacts/ContactHeader';
import { ContactInfo } from '@/components/contacts/ContactInfo';
import { ReachedOutButton } from '@/components/contacts/ReachedOutButton';
import { DeleteContactButton } from '@/components/contacts/DeleteContactButton';
import { createClient } from '@/lib/supabase/server';

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
