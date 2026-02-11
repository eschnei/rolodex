'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  validateCreateContact,
  validateUpdateContact,
  formatValidationErrors,
} from '@/lib/validations/contact';

export type ContactActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  contactId?: string;
};

/**
 * Create a new contact
 */
export async function createContact(
  formData: FormData
): Promise<ContactActionResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to create a contact',
    };
  }

  // Parse tags
  let tags: string[] = [];
  try {
    const tagsJson = formData.get('tags') as string;
    if (tagsJson) {
      tags = JSON.parse(tagsJson);
      // Ensure max 3 tags
      tags = tags.slice(0, 3);
    }
  } catch {
    tags = [];
  }

  // Parse form data
  const rawData = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),
    role: formData.get('role'),
    location: formData.get('location'),
    how_we_met: formData.get('how_we_met'),
    linkedin_url: formData.get('linkedin_url'),
    name_phonetic: formData.get('name_phonetic'),
    communication_preference: formData.get('communication_preference') || 'email',
    personal_intel: formData.get('personal_intel'),
    cadence_days: parseInt(formData.get('cadence_days') as string) || 30,
  };

  // Validate data
  const validation = validateCreateContact(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: 'Please fix the errors below',
      fieldErrors: formatValidationErrors(validation.error),
    };
  }

  // Insert contact
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      user_id: user.id,
      ...validation.data,
      tags,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Failed to create contact:', error);
    return {
      success: false,
      error: 'Failed to create contact. Please try again.',
    };
  }

  // Revalidate contacts page
  revalidatePath('/contacts');

  return {
    success: true,
    contactId: data.id,
  };
}

/**
 * Update an existing contact
 */
export async function updateContact(
  contactId: string,
  formData: FormData
): Promise<ContactActionResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to update a contact',
    };
  }

  // Parse tags
  let tags: string[] = [];
  try {
    const tagsJson = formData.get('tags') as string;
    if (tagsJson) {
      tags = JSON.parse(tagsJson);
      // Ensure max 3 tags
      tags = tags.slice(0, 3);
    }
  } catch {
    tags = [];
  }

  // Parse form data
  const rawData = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),
    role: formData.get('role'),
    location: formData.get('location'),
    how_we_met: formData.get('how_we_met'),
    linkedin_url: formData.get('linkedin_url'),
    name_phonetic: formData.get('name_phonetic'),
    communication_preference: formData.get('communication_preference') || 'email',
    personal_intel: formData.get('personal_intel'),
    cadence_days: parseInt(formData.get('cadence_days') as string) || 30,
  };

  // Validate data
  const validation = validateUpdateContact(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: 'Please fix the errors below',
      fieldErrors: formatValidationErrors(validation.error),
    };
  }

  // Update contact (RLS ensures user can only update their own)
  const { error } = await supabase
    .from('contacts')
    .update({
      ...validation.data,
      tags,
      updated_at: new Date().toISOString(),
    })
    .eq('id', contactId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Failed to update contact:', error);
    return {
      success: false,
      error: 'Failed to update contact. Please try again.',
    };
  }

  // Revalidate paths
  revalidatePath('/contacts');
  revalidatePath(`/contacts/${contactId}`);

  return {
    success: true,
    contactId,
  };
}

/**
 * Delete a contact
 */
export async function deleteContact(
  contactId: string
): Promise<ContactActionResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to delete a contact',
    };
  }

  // Delete contact (RLS ensures user can only delete their own)
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', contactId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Failed to delete contact:', error);
    return {
      success: false,
      error: 'Failed to delete contact. Please try again.',
    };
  }

  // Revalidate contacts page
  revalidatePath('/contacts');

  return {
    success: true,
  };
}

/**
 * Update the last_contacted_at timestamp for a contact
 * Used for the "I Just Reached Out" feature
 */
export async function markContactAsReachedOut(
  contactId: string
): Promise<ContactActionResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to update a contact',
    };
  }

  // Update last_contacted_at
  const { error } = await supabase
    .from('contacts')
    .update({
      last_contacted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', contactId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Failed to update contact:', error);
    return {
      success: false,
      error: 'Failed to update contact. Please try again.',
    };
  }

  // Revalidate paths
  revalidatePath('/contacts');
  revalidatePath(`/contacts/${contactId}`);

  return {
    success: true,
    contactId,
  };
}

/**
 * Get a single contact by ID
 */
export async function getContact(contactId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', contactId)
    .single();

  if (error) {
    return { contact: null, error: error.message };
  }

  return { contact: data, error: null };
}

/**
 * Delete contact and redirect to contacts list
 */
export async function deleteContactAndRedirect(
  contactId: string
): Promise<void> {
  const result = await deleteContact(contactId);

  if (result.success) {
    redirect('/contacts');
  }
}
