import { Users } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/ui';

export default function ContactsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Contacts"
        description="Manage your personal and professional network."
      />
      <div className="p-8 bg-bg-secondary border border-border-subtle rounded-lg flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-bg-inset flex items-center justify-center mb-4">
          <Users size={24} className="text-text-tertiary" strokeWidth={1.5} />
        </div>
        <p className="type-body text-text-secondary mb-2">No contacts yet</p>
        <p className="type-small text-text-tertiary">
          Your contacts will appear here once you add them.
        </p>
      </div>
    </PageContainer>
  );
}
