import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { exchangeCodeForTokens } from '@/lib/gmail/oauth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/gmail/callback
 * Handles the OAuth callback from Google
 * Exchanges the authorization code for tokens and stores them
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // User ID
  const error = searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    console.error('Gmail OAuth error:', error);
    const settingsUrl = new URL('/settings', request.url);
    settingsUrl.searchParams.set('error', 'gmail_auth_denied');
    return NextResponse.redirect(settingsUrl);
  }

  // Validate required parameters
  if (!code) {
    console.error('No authorization code received');
    const settingsUrl = new URL('/settings', request.url);
    settingsUrl.searchParams.set('error', 'gmail_auth_failed');
    return NextResponse.redirect(settingsUrl);
  }

  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify state matches user ID for security
    if (state && state !== user.id) {
      console.error('State mismatch in OAuth callback');
      const settingsUrl = new URL('/settings', request.url);
      settingsUrl.searchParams.set('error', 'gmail_auth_failed');
      return NextResponse.redirect(settingsUrl);
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.refreshToken) {
      console.error('No refresh token received from Google');
      const settingsUrl = new URL('/settings', request.url);
      settingsUrl.searchParams.set('error', 'gmail_no_refresh_token');
      return NextResponse.redirect(settingsUrl);
    }

    // Store tokens in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        gmail_refresh_token: tokens.refreshToken,
        gmail_access_token: tokens.accessToken,
        gmail_token_expiry: tokens.expiryDate,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to store Gmail tokens:', updateError);
      const settingsUrl = new URL('/settings', request.url);
      settingsUrl.searchParams.set('error', 'gmail_auth_failed');
      return NextResponse.redirect(settingsUrl);
    }

    // Success - redirect to settings with success message
    const settingsUrl = new URL('/settings', request.url);
    settingsUrl.searchParams.set('success', 'gmail_connected');
    return NextResponse.redirect(settingsUrl);
  } catch (error) {
    console.error('Gmail OAuth callback error:', error);
    const settingsUrl = new URL('/settings', request.url);
    settingsUrl.searchParams.set('error', 'gmail_auth_failed');
    return NextResponse.redirect(settingsUrl);
  }
}
