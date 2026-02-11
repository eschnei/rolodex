import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/gmail/disconnect
 * Disconnects Gmail by removing stored tokens
 */
export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Remove Gmail tokens
    const { error } = await supabase
      .from('users')
      .update({
        gmail_refresh_token: null,
        gmail_access_token: null,
        gmail_token_expiry: null,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Failed to disconnect Gmail:', error);
      return NextResponse.json(
        { error: 'Failed to disconnect Gmail' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gmail disconnect error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
