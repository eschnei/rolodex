import { Suspense } from 'react';
import { PageContainer, SkeletonList } from '@/components/ui';
import { ContactsHeader } from '@/components/contacts/ContactsHeader';
import { ContactList } from '@/components/contacts/ContactList';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Contacts | RoloDex',
  description: 'Manage your personal network contacts',
};

async function ContactsContent() {
  const supabase = await createClient();

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .order('first_name', { ascending: true });

  if (error) {
    throw new Error('Failed to load contacts');
  }

  return <ContactList contacts={contacts || []} />;
}

export default function ContactsPage() {
  return (
    <PageContainer>
      <ContactsHeader />
      <Suspense fallback={<SkeletonList items={5} />}>
        <ContactsContent />
      </Suspense>
    </PageContainer>
  );
}
