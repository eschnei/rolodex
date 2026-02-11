'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type AuthResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return { success: true };
}

export async function signUp(
  email: string,
  password: string,
  name?: string
): Promise<AuthResult> {
  const supabase = await createClient();

  // Validate password length
  if (password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long',
    };
  }

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
      data: {
        name: name || null,
      },
    },
  });

  if (error) {
    // Handle specific error cases
    if (error.message.includes('already registered')) {
      return {
        success: false,
        error: 'An account with this email already exists',
      };
    }
    return {
      success: false,
      error: error.message,
    };
  }

  // Update the user profile with the name
  if (data.user && name) {
    await supabase
      .from('users')
      .update({ name })
      .eq('id', data.user.id);
  }

  return {
    success: true,
    message:
      'Check your email for a confirmation link to complete your registration.',
  };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'Check your email for a password reset link.',
  };
}

export async function updatePassword(password: string): Promise<AuthResult> {
  const supabase = await createClient();

  // Validate password length
  if (password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long',
    };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'Your password has been updated successfully.',
  };
}
