import { differenceInDays, isValid, parseISO } from 'date-fns';

export type CadenceStatus = 'overdue' | 'due' | 'ontrack';

export interface CadenceInfo {
  status: CadenceStatus;
  daysUntilDue: number;
  daysSinceContact: number | null;
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
