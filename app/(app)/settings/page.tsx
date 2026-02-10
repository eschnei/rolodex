import { Settings } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/ui';

export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Configure your account preferences."
      />
      <div className="p-8 bg-bg-secondary border border-border-subtle rounded-lg flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-bg-inset flex items-center justify-center mb-4">
          <Settings size={24} className="text-text-tertiary" strokeWidth={1.5} />
        </div>
        <p className="type-body text-text-secondary mb-2">Settings coming soon</p>
        <p className="type-small text-text-tertiary">
          Account settings and preferences will be available here.
        </p>
      </div>
    </PageContainer>
  );
}
