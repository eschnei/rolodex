import type { Contact } from './database.types';

// Cadence status for contacts
export type CadenceStatus =
  | 'overdue'
  | 'due-today'
  | 'due-soon'
  | 'on-track'
  | 'no-cadence'
  | 'never-contacted';

// Contact with computed cadence status
export interface ContactWithStatus extends Contact {
  cadenceStatus: CadenceStatus;
  daysOverdue?: number;
  daysSinceContact?: number;
}

// Calculate cadence status for a contact
export function getCadenceStatus(contact: Contact): {
  status: CadenceStatus;
  daysOverdue?: number;
  daysSinceContact?: number;
} {
  // No cadence set
  if (!contact.cadence_days) {
    return { status: 'no-cadence' };
  }

  // Never contacted
  if (!contact.last_contacted_at) {
    return { status: 'never-contacted' };
  }

  const lastContacted = new Date(contact.last_contacted_at);
  const now = new Date();
  const diffTime = now.getTime() - lastContacted.getTime();
  const daysSinceContact = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const dueInDays = contact.cadence_days - daysSinceContact;

  if (dueInDays < 0) {
    return {
      status: 'overdue',
      daysOverdue: Math.abs(dueInDays),
      daysSinceContact
    };
  }

  if (dueInDays === 0) {
    return { status: 'due-today', daysSinceContact };
  }

  if (dueInDays <= 3) {
    return { status: 'due-soon', daysSinceContact };
  }

  return { status: 'on-track', daysSinceContact };
}

// Format relative time (e.g., "3 days ago")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes === 0) return 'just now';
      return `${diffMinutes}m ago`;
    }
    return `${diffHours}h ago`;
  }

  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }

  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

// Get initials from name
export function getInitials(firstName: string, lastName?: string | null): string {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName?.charAt(0).toUpperCase() || '';
  return first + last;
}

// Format full name
export function formatName(firstName: string, lastName?: string | null): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}
