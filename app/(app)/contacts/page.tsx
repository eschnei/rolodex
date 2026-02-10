import { Users, Plus } from 'lucide-react';
import { PageContainer, PageHeader, Button } from '@/components/ui';

export default function ContactsPage() {
  return (
    <PageContainer>
      <PageHeader title="Contacts" />
      <div className="p-8 bg-bg-secondary border border-border-subtle rounded-lg flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-bg-inset flex items-center justify-center mb-4">
          <Users size={24} className="text-text-tertiary" strokeWidth={1.5} />
        </div>
        <p className="type-body text-text-secondary mb-4">
          No contacts yet. Add your first one to get started.
        </p>
        <Button variant="primary" size="md">
          <Plus size={16} strokeWidth={2} />
          Add Contact
        </Button>
      </div>
    </PageContainer>
  );
}
