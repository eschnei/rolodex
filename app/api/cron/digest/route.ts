import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { toZonedTime } from 'date-fns-tz';
import { sendDigestToUser } from '@/lib/actions/digest';
import { shouldSendDigest } from '@/lib/utils/digestSchedule';
import { User } from '@/lib/database.types';

export const dynamic = 'force-dynamic';

// Use service role for cron job (bypasses RLS)
function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for cron jobs');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * GET /api/cron/digest
 * Scheduled cron job to send daily digest emails
 * Runs every 15 minutes to check for users whose digest time has passed
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Fetch all users with digest enabled and Gmail connected
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('digest_enabled', true)
      .not('gmail_refresh_token', 'is', null);

    if (error) {
      console.error('Failed to fetch users for digest:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json({
        message: 'No users eligible for digest',
        processed: 0,
      });
    }

    const results = {
      processed: 0,
      sent: 0,
      skipped: 0,
      errors: 0,
    };

    // Process each user
    for (const user of users as User[]) {
      results.processed++;

      try {
        // Get current time in user's timezone
        const now = new Date();
        let userLocalTime: Date;
        try {
          userLocalTime = toZonedTime(now, user.timezone);
        } catch {
          userLocalTime = now;
        }

        // Check if user should receive digest
        if (!shouldSendDigest(user, userLocalTime)) {
          results.skipped++;
          continue;
        }

        // Send digest
        const result = await sendDigestToUser(user.id);

        if (result.success) {
          results.sent++;
        } else if (result.skipped) {
          results.skipped++;
        } else {
          results.errors++;
          console.error(`Failed to send digest to ${user.id}:`, result.error);
        }
      } catch (error) {
        results.errors++;
        console.error(`Error processing digest for ${user.id}:`, error);
      }
    }

    return NextResponse.json({
      message: 'Digest processing complete',
      ...results,
    });
  } catch (error) {
    console.error('Digest cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
