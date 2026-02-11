import { toZonedTime } from 'date-fns-tz';
import { calculateDetailedCadenceStatus } from './cadence';
import { Contact } from '@/lib/database.types';

export interface StreakInfo {
  currentStreak: number;
  isActive: boolean;
  lastCheckDate: Date;
}

/**
 * Calculate the user's outreach streak
 *
 * A streak represents consecutive days with no overdue contacts.
 * The streak is calculated as the minimum days until any contact
 * becomes overdue (if currently not overdue) or 0 if any contact
 * is currently overdue.
 *
 * @param contacts - Array of user's contacts
 * @param userTimezone - User's timezone for accurate calculation
 * @returns StreakInfo with current streak and status
 */
export function calculateStreak(
  contacts: Pick<Contact, 'last_contacted_at' | 'cadence_days'>[],
  userTimezone: string = 'America/New_York'
): StreakInfo {
  const now = new Date();
  let zonedNow: Date;
  try {
    zonedNow = toZonedTime(now, userTimezone);
  } catch {
    zonedNow = now;
  }

  if (!contacts || contacts.length === 0) {
    return {
      currentStreak: 0,
      isActive: false,
      lastCheckDate: zonedNow,
    };
  }

  // Check if any contact is currently overdue
  let hasOverdue = false;
  let minDaysUntilOverdue = Infinity;

  contacts.forEach((contact) => {
    const cadenceInfo = calculateDetailedCadenceStatus(
      contact.last_contacted_at,
      contact.cadence_days,
      userTimezone
    );

    if (cadenceInfo.status === 'overdue') {
      hasOverdue = true;
    }

    // Track the minimum days until any contact becomes overdue
    if (cadenceInfo.daysUntilDue < minDaysUntilOverdue) {
      minDaysUntilOverdue = cadenceInfo.daysUntilDue;
    }
  });

  // If any contact is overdue, streak is 0
  if (hasOverdue) {
    return {
      currentStreak: 0,
      isActive: false,
      lastCheckDate: zonedNow,
    };
  }

  // Calculate streak based on how long all contacts have been on track
  // For a proper implementation, we would need historical data
  // For now, we estimate based on the contact with the longest time since last contact
  // that is still on track
  const maxDaysSinceContact = 0;

  contacts.forEach((contact) => {
    const cadenceInfo = calculateDetailedCadenceStatus(
      contact.last_contacted_at,
      contact.cadence_days,
      userTimezone
    );

    if (
      cadenceInfo.daysSinceContact !== null &&
      cadenceInfo.daysSinceContact > maxDaysSinceContact &&
      cadenceInfo.status !== 'overdue'
    ) {
      // The streak is effectively how many days this contact has been tracked
      // without becoming overdue, considering their cadence
      const contactStreak =
        contact.cadence_days! - cadenceInfo.daysSinceContact;
      if (contactStreak > 0 && contactStreak < minDaysUntilOverdue) {
        minDaysUntilOverdue = contactStreak;
      }
    }
  });

  // The streak represents consecutive days all contacts have been on track
  // This is a simplified calculation
  const streak = Math.max(0, minDaysUntilOverdue);

  return {
    currentStreak: streak === Infinity ? 0 : streak,
    isActive: !hasOverdue,
    lastCheckDate: zonedNow,
  };
}

/**
 * Get a display string for the streak
 */
export function formatStreakDisplay(streak: number): string {
  if (streak === 0) {
    return 'No streak';
  }
  if (streak === 1) {
    return '1 day streak';
  }
  return `${streak} day streak`;
}

/**
 * Get an encouraging message based on streak length
 */
export function getStreakMessage(streak: number): string {
  if (streak === 0) {
    return "Start your streak by reaching out to overdue contacts!";
  }
  if (streak < 7) {
    return "You're building momentum!";
  }
  if (streak < 30) {
    return 'Great work keeping up with your network!';
  }
  if (streak < 90) {
    return 'Impressive consistency!';
  }
  return 'Outstanding! You are a networking pro!';
}
