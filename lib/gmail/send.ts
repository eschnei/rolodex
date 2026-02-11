import { createGmailClient, GmailCredentials } from './client';
import { getValidAccessToken } from './oauth';
import { createClient } from '@/lib/supabase/server';

export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

/**
 * Create a raw email message in base64url format
 */
function createRawEmail(message: EmailMessage): string {
  const emailLines = [
    `To: ${message.to}`,
    `Subject: ${message.subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    message.body,
  ];

  const email = emailLines.join('\r\n');

  // Convert to base64url
  return Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Send an email via Gmail API
 */
export async function sendEmail(
  credentials: GmailCredentials,
  message: EmailMessage
): Promise<{ success: boolean; messageId?: string | undefined; error?: string | undefined }> {
  try {
    if (!credentials.refreshToken) {
      return { success: false, error: 'Gmail not connected' };
    }

    // Get valid access token (refresh if needed)
    const { accessToken, expiryDate, wasRefreshed } = await getValidAccessToken(
      credentials.accessToken,
      credentials.refreshToken,
      credentials.expiryDate
    );

    // If token was refreshed, update it in the database
    if (wasRefreshed) {
      await updateUserGmailTokens(accessToken, expiryDate);
    }

    // Create Gmail client and send
    const gmail = createGmailClient(accessToken);
    const raw = createRawEmail(message);

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
      },
    });

    return {
      success: true,
      messageId: response.data.id || undefined,
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Update the user's Gmail tokens in the database
 */
async function updateUserGmailTokens(
  accessToken: string,
  expiryDate: string
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase
    .from('users')
    .update({
      gmail_access_token: accessToken,
      gmail_token_expiry: expiryDate,
    })
    .eq('id', user.id);
}

/**
 * Send a self-email (from user to themselves)
 * Used for digest emails
 */
export async function sendSelfEmail(
  userEmail: string,
  credentials: GmailCredentials,
  subject: string,
  body: string
): Promise<{ success: boolean; error?: string | undefined }> {
  return sendEmail(credentials, {
    to: userEmail,
    subject,
    body,
  });
}
