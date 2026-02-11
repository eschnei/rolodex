'use client';

import { useState, useMemo } from 'react';
import { ContactListItem } from './ContactListItem';
import { EmptyContactsState } from './EmptyContactsState';
import { SearchInput } from '@/components/ui/SearchInput';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { type Contact } from '@/lib/database.types';
import { cn } from '@/lib/utils/cn';

interface ContactListProps {
  contacts: Contact[];
}

/**
 * Contact list with glass-styled search and summary-first items
 */
export function ContactList({ contacts }: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return contacts;
    }

    const query = debouncedQuery.toLowerCase().trim();

    return contacts.filter((contact) => {
      const fullName = `${contact.first_name} ${contact.last_name || ''}`.toLowerCase();
      const company = (contact.company || '').toLowerCase();
      const role = (contact.role || '').toLowerCase();
      const email = (contact.email || '').toLowerCase();

      return (
        fullName.includes(query) ||
        company.includes(query) ||
        role.includes(query) ||
        email.includes(query)
      );
    });
  }, [contacts, debouncedQuery]);

  // Show empty state if no contacts exist at all
  if (contacts.length === 0) {
    return <EmptyContactsState />;
  }

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      {/* Search input */}
      <SearchInput
        placeholder="Search contacts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={handleClearSearch}
        aria-label="Search contacts"
      />

      {/* Contact count */}
      <p className="text-[13px] text-[rgba(255,255,255,0.7)]">
        {filteredContacts.length === contacts.length
          ? `${contacts.length} contact${contacts.length === 1 ? '' : 's'}`
          : `${filteredContacts.length} of ${contacts.length} contacts`}
      </p>

      {/* Contact list or empty search results */}
      {filteredContacts.length > 0 ? (
        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <ContactListItem key={contact.id} contact={contact} />
          ))}
        </div>
      ) : (
        <div
          className={cn(
            'p-8 text-center',
            'rounded-[16px]',
            'bg-[rgba(255,255,255,0.08)]',
            'backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)]',
            'border border-[rgba(255,255,255,0.12)]'
          )}
        >
          <p className="text-[14px] text-[rgba(255,255,255,0.6)]">
            No contacts match &quot;{debouncedQuery}&quot;
          </p>
          <button
            onClick={handleClearSearch}
            className="text-[13px] text-accent hover:text-accent-hover mt-2 transition-colors duration-150"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
