import { DashboardContact } from '@/lib/actions/dashboard';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rolodex-rust.vercel.app';

interface DigestEmailData {
  overdueContacts: DashboardContact[];
  dueSoonContacts: DashboardContact[];
  userName?: string;
}

/**
 * Generate the subject line for the digest email
 */
export function generateDigestSubject(
  overdueCount: number,
  dueSoonCount: number
): string {
  const totalCount = overdueCount + dueSoonCount;

  if (totalCount === 0) {
    return 'ROLO: You are all caught up!';
  }

  if (overdueCount > 0 && dueSoonCount > 0) {
    return `ROLO: ${overdueCount} overdue, ${dueSoonCount} due soon`;
  }

  if (overdueCount > 0) {
    return `ROLO: ${overdueCount} contact${overdueCount === 1 ? '' : 's'} to reach`;
  }

  return `ROLO: ${dueSoonCount} contact${dueSoonCount === 1 ? '' : 's'} coming up`;
}

/**
 * Format a contact for the email body
 */
function formatContact(contact: DashboardContact): string {
  const fullName = contact.last_name
    ? `${contact.first_name} ${contact.last_name}`
    : contact.first_name;

  const companyLine = contact.company
    ? contact.role
      ? `${contact.role} at ${contact.company}`
      : contact.company
    : contact.role || '';

  const { cadenceInfo } = contact;
  const daysInfo =
    cadenceInfo.daysSinceContact !== null
      ? `Last contact: ${cadenceInfo.daysSinceContact} day${cadenceInfo.daysSinceContact === 1 ? '' : 's'} ago`
      : 'Never contacted';

  const statusInfo =
    cadenceInfo.status === 'overdue'
      ? `(${cadenceInfo.daysOverdue} day${cadenceInfo.daysOverdue === 1 ? '' : 's'} overdue)`
      : cadenceInfo.status === 'due_today'
        ? '(Due today)'
        : `(Due in ${cadenceInfo.daysUntilDue} day${cadenceInfo.daysUntilDue === 1 ? '' : 's'})`;

  const summaryLine = contact.ai_summary
    ? `Summary: ${(contact.ai_summary.split('\n')[0] ?? '').slice(0, 80)}${contact.ai_summary.length > 80 ? '...' : ''}`
    : '';

  const link = `${APP_URL}/contacts/${contact.id}`;

  const lines = [
    `* ${fullName}`,
    companyLine ? `  ${companyLine}` : '',
    `  ${daysInfo} ${statusInfo}`,
    summaryLine ? `  ${summaryLine}` : '',
    `  View: ${link}`,
  ].filter(Boolean);

  return lines.join('\n');
}

/**
 * Generate the plain text body for the digest email
 */
export function generateDigestBody(data: DigestEmailData): string {
  const { overdueContacts, dueSoonContacts, userName } = data;

  const greeting = userName
    ? `Hi ${userName},`
    : 'Hi,';

  const lines: string[] = [greeting, ''];

  // Summary line
  if (overdueContacts.length === 0 && dueSoonContacts.length === 0) {
    lines.push("Great news! You're all caught up with your network.");
    lines.push('All your contacts are on track.');
    lines.push('');
    lines.push(`View dashboard: ${APP_URL}/dashboard`);
    return lines.join('\n');
  }

  lines.push("Here's your ROLO daily digest:");
  lines.push('');

  // Overdue section
  if (overdueContacts.length > 0) {
    lines.push(
      `== OVERDUE (${overdueContacts.length}) ==`
    );
    lines.push('These contacts are past their cadence deadline:');
    lines.push('');

    overdueContacts.forEach((contact) => {
      lines.push(formatContact(contact));
      lines.push('');
    });
  }

  // Due soon section
  if (dueSoonContacts.length > 0) {
    lines.push(
      `== DUE SOON (${dueSoonContacts.length}) ==`
    );
    lines.push('These contacts are coming up in the next few days:');
    lines.push('');

    dueSoonContacts.forEach((contact) => {
      lines.push(formatContact(contact));
      lines.push('');
    });
  }

  // Footer
  lines.push('---');
  lines.push(`View your full dashboard: ${APP_URL}/dashboard`);
  lines.push('');
  lines.push(
    'Tip: Mark contacts as "reached out" after you connect to update their status.'
  );
  lines.push('');
  lines.push('- ROLO');

  return lines.join('\n');
}

/**
 * Generate the complete digest email
 */
export function generateDigestEmail(data: DigestEmailData): {
  subject: string;
  body: string;
} {
  const subject = generateDigestSubject(
    data.overdueContacts.length,
    data.dueSoonContacts.length
  );

  const body = generateDigestBody(data);

  return { subject, body };
}
