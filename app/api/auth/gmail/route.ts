import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateAuthUrl } from '@/lib/gmail/oauth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/gmail
 * Initiates the Gmail OAuth flow
 * Redirects user to Google consent screen
 */
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Generate OAuth URL with user ID as state
    const authUrl = generateAuthUrl(user.id);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Gmail OAuth initiation error:', error);

    // Redirect to settings with error
    const settingsUrl = new URL('/settings', request.url);
    settingsUrl.searchParams.set('error', 'gmail_auth_failed');
    return NextResponse.redirect(settingsUrl);
  }
}
