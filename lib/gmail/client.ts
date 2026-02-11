import { google } from 'googleapis';
import { createOAuth2Client, getValidAccessToken } from './oauth';

export interface GmailCredentials {
  accessToken: string | null;
  refreshToken: string | null;
  expiryDate: string | null;
}

/**
 * Create an authenticated Gmail client
 */
export function createGmailClient(accessToken: string) {
  const oauth2Client = createOAuth2Client();

  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

/**
 * Get the user's email address from their Gmail account
 */
export async function getGmailUserEmail(accessToken: string): Promise<string> {
  const gmail = createGmailClient(accessToken);

  const profile = await gmail.users.getProfile({
    userId: 'me',
  });

  if (!profile.data.emailAddress) {
    throw new Error('Could not get email address from Gmail profile');
  }

  return profile.data.emailAddress;
}

/**
 * Verify Gmail connection is working
 */
export async function verifyGmailConnection(
  credentials: GmailCredentials
): Promise<{
  valid: boolean;
  email?: string;
  error?: string;
}> {
  try {
    if (!credentials.refreshToken) {
      return { valid: false, error: 'No refresh token' };
    }

    const { accessToken } = await getValidAccessToken(
      credentials.accessToken,
      credentials.refreshToken,
      credentials.expiryDate
    );

    const email = await getGmailUserEmail(accessToken);

    return { valid: true, email };
  } catch (error) {
    console.error('Gmail connection verification failed:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
