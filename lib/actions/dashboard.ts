'use server';

import { createClient } from '@/lib/supabase/server';
import { Contact } from '@/lib/database.types';
import {
  calculateDetailedCadenceStatus,
  DetailedCadenceInfo,
} from '@/lib/utils/cadence';

export interface DashboardContact extends Contact {
  cadenceInfo: DetailedCadenceInfo;
}

export interface GroupedContacts {
  overdue: DashboardContact[];
  dueToday: DashboardContact[];
  dueSoon: DashboardContact[];
  onTrack: DashboardContact[];
}

export interface DashboardStats {
  totalContacts: number;
  overdueCount: number;
  dueTodayCount: number;
  dueSoonCount: number;
  onTrackCount: number;
  streak: number;
}

export interface DashboardData {
  contacts: GroupedContacts;
  stats: DashboardStats;
  isCaughtUp: boolean;
}

/**
 * Fetch and process contacts for the dashboard
 * Groups contacts by urgency and calculates stats
 */
export async function getDashboardData(): Promise<{
  data: DashboardData | null;
  error: string | null;
}> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Not authenticated' };
  }

  // Fetch user profile for timezone
  const { data: profile } = await supabase
    .from('users')
    .select('timezone')
    .eq('id', user.id)
    .single();

  const userTimezone = profile?.timezone || 'America/New_York';

  // Fetch all contacts for the user
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.id)
    .order('last_contacted_at', { ascending: true, nullsFirst: true });

  if (error) {
    console.error('Error fetching contacts:', error);
    return { data: null, error: error.message };
  }

  // Calculate cadence info for each contact and group them
  const groupedContacts: GroupedContacts = {
    overdue: [],
    dueToday: [],
    dueSoon: [],
    onTrack: [],
  };

  const contactsWithCadence: DashboardContact[] = (contacts || []).map(
    (contact) => {
      const cadenceInfo = calculateDetailedCadenceStatus(
        contact.last_contacted_at,
        contact.cadence_days,
        userTimezone
      );
      return { ...contact, cadenceInfo };
    }
  );

  // Group contacts by status
  contactsWithCadence.forEach((contact) => {
    switch (contact.cadenceInfo.status) {
      case 'overdue':
        groupedContacts.overdue.push(contact);
        break;
      case 'due_today':
        groupedContacts.dueToday.push(contact);
        break;
      case 'due_soon':
        groupedContacts.dueSoon.push(contact);
        break;
      case 'on_track':
        groupedContacts.onTrack.push(contact);
        break;
    }
  });

  // Sort overdue by most days past due (highest daysOverdue first)
  groupedContacts.overdue.sort(
    (a, b) => b.cadenceInfo.daysOverdue - a.cadenceInfo.daysOverdue
  );

  // Sort due_soon by soonest (lowest daysUntilDue first)
  groupedContacts.dueSoon.sort(
    (a, b) => a.cadenceInfo.daysUntilDue - b.cadenceInfo.daysUntilDue
  );

  // Calculate streak
  const streak = await calculateStreak(user.id, userTimezone);

  // Calculate stats
  const stats: DashboardStats = {
    totalContacts: contactsWithCadence.length,
    overdueCount: groupedContacts.overdue.length,
    dueTodayCount: groupedContacts.dueToday.length,
    dueSoonCount: groupedContacts.dueSoon.length,
    onTrackCount: groupedContacts.onTrack.length,
    streak,
  };

  // User is caught up if no overdue contacts
  const isCaughtUp =
    groupedContacts.overdue.length === 0 &&
    groupedContacts.dueToday.length === 0;

  return {
    data: {
      contacts: groupedContacts,
      stats,
      isCaughtUp,
    },
    error: null,
  };
}

/**
 * Calculate the user's outreach streak
 * A streak is consecutive days with no overdue contacts
 */
async function calculateStreak(
  userId: string,
  userTimezone: string
): Promise<number> {
  const supabase = await createClient();

  // Fetch contacts with their cadence information
  const { data: contacts } = await supabase
    .from('contacts')
    .select('last_contacted_at, cadence_days')
    .eq('user_id', userId);

  if (!contacts || contacts.length === 0) {
    return 0;
  }

  // Check if user currently has any overdue contacts
  const hasOverdue = contacts.some((contact) => {
    const cadenceInfo = calculateDetailedCadenceStatus(
      contact.last_contacted_at,
      contact.cadence_days,
      userTimezone
    );
    return cadenceInfo.status === 'overdue';
  });

  // If currently overdue, streak is 0
  if (hasOverdue) {
    return 0;
  }

  // For simplicity, we'll calculate streak based on the minimum days until any contact becomes overdue
  // This represents how many consecutive days the user has maintained without falling behind
  let minDaysUntilOverdue = Infinity;

  contacts.forEach((contact) => {
    const cadenceInfo = calculateDetailedCadenceStatus(
      contact.last_contacted_at,
      contact.cadence_days,
      userTimezone
    );

    if (cadenceInfo.daysUntilDue < minDaysUntilOverdue) {
      minDaysUntilOverdue = cadenceInfo.daysUntilDue;
    }
  });

  // The streak is effectively how long since the user last had an overdue contact
  // For now, return the number of days all contacts have been on track
  // This is a simplified calculation - a full implementation would require historical data
  return minDaysUntilOverdue === Infinity ? 0 : Math.max(0, minDaysUntilOverdue);
}

/**
 * Get contacts that need attention (overdue, due today, or due soon)
 */
export async function getContactsNeedingAttention(): Promise<{
  contacts: DashboardContact[];
  error: string | null;
}> {
  const result = await getDashboardData();

  if (result.error || !result.data) {
    return { contacts: [], error: result.error };
  }

  const needsAttention = [
    ...result.data.contacts.overdue,
    ...result.data.contacts.dueToday,
    ...result.data.contacts.dueSoon,
  ];

  return { contacts: needsAttention, error: null };
}

/**
 * Get a summary of contacts for the email digest
 */
export async function getDigestContacts(userId: string): Promise<{
  overdue: DashboardContact[];
  dueSoon: DashboardContact[];
  error: string | null;
}> {
  const supabase = await createClient();

  // Fetch user profile for timezone
  const { data: profile } = await supabase
    .from('users')
    .select('timezone')
    .eq('id', userId)
    .single();

  const userTimezone = profile?.timezone || 'America/New_York';

  // Fetch all contacts for the user
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return { overdue: [], dueSoon: [], error: error.message };
  }

  const overdue: DashboardContact[] = [];
  const dueSoon: DashboardContact[] = [];

  (contacts || []).forEach((contact) => {
    const cadenceInfo = calculateDetailedCadenceStatus(
      contact.last_contacted_at,
      contact.cadence_days,
      userTimezone
    );

    const dashboardContact = { ...contact, cadenceInfo };

    if (cadenceInfo.status === 'overdue' || cadenceInfo.status === 'due_today') {
      overdue.push(dashboardContact);
    } else if (cadenceInfo.status === 'due_soon') {
      dueSoon.push(dashboardContact);
    }
  });

  // Sort overdue by most days past due
  overdue.sort(
    (a, b) => b.cadenceInfo.daysOverdue - a.cadenceInfo.daysOverdue
  );

  // Sort due soon by soonest
  dueSoon.sort(
    (a, b) => a.cadenceInfo.daysUntilDue - b.cadenceInfo.daysUntilDue
  );

  return { overdue, dueSoon, error: null };
}
