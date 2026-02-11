'use server';

import { createClient } from '@/lib/supabase/server';
import { getDigestContacts } from './dashboard';
import { generateDigestEmail } from '@/lib/email/templates/digest';
import { sendSelfEmail } from '@/lib/gmail/send';

export interface DigestResult {
  success: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
}

/**
 * Send the daily digest email to a specific user
 */
export async function sendDigestToUser(userId: string): Promise<DigestResult> {
  const supabase = await createClient();

  // Fetch user profile
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    return { success: false, error: 'User not found' };
  }

  // Check if digest is enabled
  if (!user.digest_enabled) {
    return { success: false, skipped: true, reason: 'Digest disabled' };
  }

  // Check if Gmail is connected
  if (!user.gmail_refresh_token) {
    return { success: false, skipped: true, reason: 'Gmail not connected' };
  }

  // Get contacts needing attention
  const { overdue, dueSoon, error: contactsError } = await getDigestContacts(userId);

  if (contactsError) {
    return { success: false, error: contactsError };
  }

  // Check if skip_when_caught_up is enabled and user is caught up
  if (user.skip_when_caught_up && overdue.length === 0 && dueSoon.length === 0) {
    return { success: false, skipped: true, reason: 'All caught up' };
  }

  // Generate email content
  const { subject, body } = generateDigestEmail({
    overdueContacts: overdue,
    dueSoonContacts: dueSoon,
    userName: user.name || undefined,
  });

  // Send email
  const sendResult = await sendSelfEmail(
    user.email,
    {
      accessToken: user.gmail_access_token,
      refreshToken: user.gmail_refresh_token,
      expiryDate: user.gmail_token_expiry,
    },
    subject,
    body
  );

  if (!sendResult.success) {
    return { success: false, error: sendResult.error || 'Failed to send email' };
  }

  // Update last_digest_sent_at
  await supabase
    .from('users')
    .update({ last_digest_sent_at: new Date().toISOString() })
    .eq('id', userId);

  return { success: true };
}

/**
 * Send digest to current authenticated user
 */
export async function sendMyDigest(): Promise<DigestResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  return sendDigestToUser(user.id);
}

