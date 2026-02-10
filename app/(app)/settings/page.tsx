import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-page mx-auto px-4 py-10 md:px-6 md:py-16">
      <h1 className="text-h1 text-text-primary mb-4">Settings</h1>
      <p className="text-body text-text-secondary mb-8">
        Configure your account preferences.
      </p>
      <div className="p-8 bg-bg-secondary border border-border-subtle rounded-lg flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-bg-inset flex items-center justify-center mb-4">
          <Settings size={24} className="text-text-tertiary" strokeWidth={1.5} />
        </div>
        <p className="text-body text-text-secondary mb-2">Settings coming soon</p>
        <p className="text-small text-text-tertiary">
          Account settings and preferences will be available here.
        </p>
      </div>
    </div>
  );
}
