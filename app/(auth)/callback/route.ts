import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if this is a password reset flow
      const type = searchParams.get('type');
      if (type === 'recovery') {
        // Redirect to reset password page for password recovery
        return NextResponse.redirect(`${origin}/reset-password`);
      }

      // For email confirmation or other flows, redirect to the next URL
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        // In development, we can safely redirect to the origin
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // In production, use the forwarded host if available
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
