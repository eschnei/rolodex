'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Get the current user's profile
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return profile;
}

/**
 * Update the current user's timezone
 */
export async function updateUserTimezone(timezone: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('users')
    .update({ timezone })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating timezone:', error);
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(data: {
  name?: string;
  digest_time?: string;
  digest_enabled?: boolean;
  skip_when_caught_up?: boolean;
  timezone?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', user.id);

  if (error) {
    console.error('Error updating user profile:', error);
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

/**
 * Ensure user profile exists (called after login)
 * This is a backup in case the database trigger didn't fire
 */
export async function ensureUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (existingProfile) {
    return { exists: true };
  }

  // Create profile if it doesn't exist
  const { error } = await supabase
    .from('users')
    .insert({
      id: user.id,
      email: user.email!,
      name: user.email?.split('@')[0] || 'User',
    });

  if (error) {
    console.error('Error creating user profile:', error);
    return { error: error.message };
  }

  return { created: true };
}
