import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/userinfo.email',
];

/**
 * Create OAuth2 client for Gmail API
 */
export function createOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gmail/callback`;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generate the OAuth consent URL for Gmail authorization
 */
export function generateAuthUrl(state?: string): string {
  const oauth2Client = createOAuth2Client();

  const authUrlOptions: {
    access_type: 'offline';
    scope: string[];
    prompt: 'consent';
    state?: string;
  } = {
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force consent to get refresh token
  };

  if (state) {
    authUrlOptions.state = state;
  }

  return oauth2Client.generateAuthUrl(authUrlOptions);
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string) {
  const oauth2Client = createOAuth2Client();

  const { tokens } = await oauth2Client.getToken(code);

  return {
    accessToken: tokens.access_token || null,
    refreshToken: tokens.refresh_token || null,
    expiryDate: tokens.expiry_date
      ? new Date(tokens.expiry_date).toISOString()
      : null,
  };
}

/**
 * Refresh the access token using the refresh token
 */
export async function refreshAccessToken(refreshToken: string) {
  const oauth2Client = createOAuth2Client();

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();

    return {
      accessToken: credentials.access_token || null,
      expiryDate: credentials.expiry_date
        ? new Date(credentials.expiry_date).toISOString()
        : null,
    };
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw new Error('Failed to refresh Gmail access token');
  }
}

/**
 * Check if the access token is expired or about to expire
 * Returns true if token expires in less than 5 minutes
 */
export function isTokenExpired(expiryDate: string | null): boolean {
  if (!expiryDate) {
    return true;
  }

  const expiry = new Date(expiryDate);
  const now = new Date();
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

  return expiry < fiveMinutesFromNow;
}

/**
 * Get or refresh the access token
 */
export async function getValidAccessToken(
  accessToken: string | null,
  refreshToken: string | null,
  expiryDate: string | null
): Promise<{
  accessToken: string;
  expiryDate: string;
  wasRefreshed: boolean;
}> {
  // If no refresh token, cannot proceed
  if (!refreshToken) {
    throw new Error('Gmail not connected - no refresh token');
  }

  // If access token is still valid, return it
  if (accessToken && !isTokenExpired(expiryDate)) {
    return {
      accessToken,
      expiryDate: expiryDate!,
      wasRefreshed: false,
    };
  }

  // Refresh the token
  const refreshed = await refreshAccessToken(refreshToken);

  if (!refreshed.accessToken) {
    throw new Error('Failed to get new access token');
  }

  return {
    accessToken: refreshed.accessToken,
    expiryDate: refreshed.expiryDate || new Date().toISOString(),
    wasRefreshed: true,
  };
}
