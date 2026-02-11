import { differenceInDays, isValid, parseISO, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

// Detailed status types for dashboard
export type DetailedCadenceStatus =
  | 'overdue'
  | 'due_today'
  | 'due_soon'
  | 'on_track';

// Legacy status types for backward compatibility
export type CadenceStatus = 'overdue' | 'due' | 'ontrack';

export interface CadenceInfo {
  status: CadenceStatus;
  daysUntilDue: number;
  daysSinceContact: number | null;
}

export interface DetailedCadenceInfo {
  status: DetailedCadenceStatus;
  daysUntilDue: number;
  daysOverdue: number;
  daysSinceContact: number | null;
  isNeverContacted: boolean;
}

/**
 * Calculate detailed cadence status for a contact with timezone awareness
 *
 * Status logic:
 * - For never contacted: use created_at as starting point for cadence
 * - overdue: past cadence_days since last contact (or created_at if never contacted)
 * - due_today: due today (0 days until due)
 * - due_soon: within 3 days of cadence deadline (1-3 days)
 * - on_track: more than 3 days until cadence deadline
 *
 * @param lastContactedAt - ISO timestamp of last contact
 * @param cadenceDays - Number of days in contact cadence (default 30)
 * @param userTimezone - User's timezone for accurate day calculations
 * @param createdAt - ISO timestamp of when contact was created (for never contacted)
 * @returns DetailedCadenceInfo with comprehensive status details
 */
export function calculateDetailedCadenceStatus(
  lastContactedAt: string | null,
  cadenceDays: number | null = 30,
  userTimezone: string = 'America/New_York',
  createdAt?: string | null
): DetailedCadenceInfo {
  const effectiveCadence = cadenceDays ?? 30;

  // Get current date in user's timezone
  const now = new Date();
  let zonedNow: Date;
  try {
    zonedNow = toZonedTime(now, userTimezone);
  } catch {
    // Fallback if timezone is invalid
    zonedNow = now;
  }
  const todayStart = startOfDay(zonedNow);

  // Determine the reference date: last contact, or created_at for new contacts
  const referenceDate = lastContactedAt || createdAt;
  const isNeverContacted = !lastContactedAt;

  if (!referenceDate) {
    // No reference date at all - shouldn't happen, but default to on_track
    return {
      status: 'on_track',
      daysUntilDue: effectiveCadence,
      daysOverdue: 0,
      daysSinceContact: null,
      isNeverContacted: true,
    };
  }

  const refDate = parseISO(referenceDate);

  if (!isValid(refDate)) {
    return {
      status: 'on_track',
      daysUntilDue: effectiveCadence,
      daysOverdue: 0,
      daysSinceContact: null,
      isNeverContacted: true,
    };
  }

  // Convert reference date to user's timezone for accurate day calculation
  let zonedRefDate: Date;
  try {
    zonedRefDate = toZonedTime(refDate, userTimezone);
  } catch {
    zonedRefDate = refDate;
  }
  const refDateStart = startOfDay(zonedRefDate);

  const daysSinceRef = differenceInDays(todayStart, refDateStart);
  const daysUntilDue = effectiveCadence - daysSinceRef;

  let status: DetailedCadenceStatus;
  let daysOverdue = 0;

  if (daysUntilDue < 0) {
    // Past the cadence deadline
    status = 'overdue';
    daysOverdue = Math.abs(daysUntilDue);
  } else if (daysUntilDue === 0) {
    // Due today
    status = 'due_today';
  } else if (daysUntilDue <= 3) {
    // Within 3 days of deadline
    status = 'due_soon';
  } else {
    // More than 3 days until deadline
    status = 'on_track';
  }

  return {
    status,
    daysUntilDue,
    daysOverdue,
    daysSinceContact: isNeverContacted ? null : daysSinceRef,
    isNeverContacted,
  };
}

/**
 * Calculate the cadence status for a contact based on their cadence_days
 * and last_contacted_at timestamp.
 *
 * Status logic:
 * - overdue: past cadence_days since last contact
 * - due: within 3 days of cadence deadline
 * - ontrack: more than 3 days until cadence deadline
 *
 * @param lastContactedAt - ISO timestamp of last contact
 * @param cadenceDays - Number of days in contact cadence (default 30)
 * @returns CadenceInfo with status and timing details
 */
export function calculateCadenceStatus(
  lastContactedAt: string | null,
  cadenceDays: number | null = 30
): CadenceInfo {
  const effectiveCadence = cadenceDays ?? 30;

  // If never contacted, treat as overdue
  if (!lastContactedAt) {
    return {
      status: 'overdue',
      daysUntilDue: -effectiveCadence,
      daysSinceContact: null,
    };
  }

  const lastContact = parseISO(lastContactedAt);

  if (!isValid(lastContact)) {
    return {
      status: 'overdue',
      daysUntilDue: -effectiveCadence,
      daysSinceContact: null,
    };
  }

  const now = new Date();
  const daysSinceContact = differenceInDays(now, lastContact);
  const daysUntilDue = effectiveCadence - daysSinceContact;

  let status: CadenceStatus;

  if (daysUntilDue < 0) {
    // Past the cadence deadline
    status = 'overdue';
  } else if (daysUntilDue <= 3) {
    // Within 3 days of deadline
    status = 'due';
  } else {
    // More than 3 days until deadline
    status = 'ontrack';
  }

  return {
    status,
    daysUntilDue,
    daysSinceContact,
  };
}

/**
 * Get a human-readable label for the cadence status
 */
export function getCadenceLabel(status: CadenceStatus): string {
  switch (status) {
    case 'overdue':
      return 'Overdue';
    case 'due':
      return 'Due Soon';
    case 'ontrack':
      return 'On Track';
    default:
      return 'Unknown';
  }
}

/**
 * Get a human-readable label for detailed cadence status
 */
export function getDetailedCadenceLabel(status: DetailedCadenceStatus): string {
  switch (status) {
    case 'overdue':
      return 'Overdue';
    case 'due_today':
      return 'Due Today';
    case 'due_soon':
      return 'Due Soon';
    case 'on_track':
      return 'On Track';
    default:
      return 'Unknown';
  }
}

/**
 * Get a detailed message about the cadence status
 */
export function getCadenceMessage(info: CadenceInfo): string {
  const { status, daysUntilDue, daysSinceContact } = info;

  if (daysSinceContact === null) {
    return 'Never contacted';
  }

  switch (status) {
    case 'overdue':
      return `${Math.abs(daysUntilDue)} days overdue`;
    case 'due':
      if (daysUntilDue === 0) {
        return 'Due today';
      }
      return `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`;
    case 'ontrack':
      return `${daysUntilDue} days until due`;
    default:
      return 'Unknown status';
  }
}

/**
 * Get a detailed message for dashboard display
 */
export function getDetailedCadenceMessage(info: DetailedCadenceInfo): string {
  const { status, daysOverdue, daysUntilDue, daysSinceContact } = info;

  if (daysSinceContact === null) {
    return 'Never contacted';
  }

  switch (status) {
    case 'overdue':
      return `${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue`;
    case 'due_today':
      return 'Due today';
    case 'due_soon':
      return `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`;
    case 'on_track':
      return `${daysUntilDue} days until due`;
    default:
      return 'Unknown status';
  }
}

/**
 * Map detailed status to legacy status for backward compatibility
 */
export function mapToLegacyStatus(status: DetailedCadenceStatus): CadenceStatus {
  switch (status) {
    case 'overdue':
      return 'overdue';
    case 'due_today':
    case 'due_soon':
      return 'due';
    case 'on_track':
      return 'ontrack';
    default:
      return 'ontrack';
  }
}

/**
 * Check if a contact needs attention (overdue or due soon)
 */
export function needsAttention(status: DetailedCadenceStatus): boolean {
  return status === 'overdue' || status === 'due_today' || status === 'due_soon';
}
