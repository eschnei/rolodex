import { Users } from 'lucide-react';

export default function ContactsPage() {
  return (
    <div className="max-w-page mx-auto px-4 py-10 md:px-6 md:py-16">
      <h1 className="text-h1 text-text-primary mb-4">Contacts</h1>
      <p className="text-body text-text-secondary mb-8">
        Manage your personal and professional network.
      </p>
      <div className="p-8 bg-bg-secondary border border-border-subtle rounded-lg flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-bg-inset flex items-center justify-center mb-4">
          <Users size={24} className="text-text-tertiary" strokeWidth={1.5} />
        </div>
        <p className="text-body text-text-secondary mb-2">No contacts yet</p>
        <p className="text-small text-text-tertiary">
          Your contacts will appear here once you add them.
        </p>
      </div>
    </div>
  );
}
