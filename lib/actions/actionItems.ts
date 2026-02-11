'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ActionItem } from '@/lib/database.types';

export type ActionItemActionResult = {
  success: boolean;
  error?: string;
  actionItem?: ActionItem;
};

export type ActionItemsListResult = {
  success: boolean;
  error?: string;
  actionItems?: ActionItem[];
};

/**
 * Create a new action item for a contact
 */
export async function createActionItem(
  contactId: string,
  description: string,
  sourceNoteId?: string
): Promise<ActionItemActionResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to create an action item',
    };
  }

  // Validate description
  if (!description || description.trim().length === 0) {
    return {
      success: false,
      error: 'Action item description cannot be empty',
    };
  }

  // Insert action item
  const { data: actionItem, error } = await supabase
    .from('action_items')
    .insert({
      contact_id: contactId,
      user_id: user.id,
      description: description.trim(),
      source_note_id: sourceNoteId || null,
      is_completed: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create action item:', error);
    return {
      success: false,
      error: 'Failed to create action item. Please try again.',
    };
  }

  // Revalidate paths
  revalidatePath(`/contacts/${contactId}`);
  revalidatePath('/dashboard');

  return {
    success: true,
    actionItem,
  };
}

/**
 * Get all action items for a contact
 */
export async function getActionItems(
  contactId: string,
  showCompleted: boolean = true
): Promise<ActionItemsListResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to view action items',
    };
  }

  let query = supabase
    .from('action_items')
    .select('*')
    .eq('contact_id', contactId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Filter to show only open items if requested
  if (!showCompleted) {
    query = query.eq('is_completed', false);
  }

  const { data: actionItems, error } = await query;

  if (error) {
    console.error('Failed to fetch action items:', error);
    return {
      success: false,
      error: 'Failed to fetch action items. Please try again.',
    };
  }

  return {
    success: true,
    actionItems: actionItems || [],
  };
}

/**
 * Toggle action item completion status
 */
export async function toggleActionItem(
  actionItemId: string
): Promise<ActionItemActionResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to update an action item',
    };
  }

  // Get current state
  const { data: currentItem, error: fetchError } = await supabase
    .from('action_items')
    .select('*')
    .eq('id', actionItemId)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !currentItem) {
    return {
      success: false,
      error: 'Action item not found or you do not have permission to update it',
    };
  }

  // Toggle completion status
  const newIsCompleted = !currentItem.is_completed;
  const { data: actionItem, error: updateError } = await supabase
    .from('action_items')
    .update({
      is_completed: newIsCompleted,
      completed_at: newIsCompleted ? new Date().toISOString() : null,
    })
    .eq('id', actionItemId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (updateError) {
    console.error('Failed to toggle action item:', updateError);
    return {
      success: false,
      error: 'Failed to update action item. Please try again.',
    };
  }

  // Revalidate paths
  revalidatePath(`/contacts/${currentItem.contact_id}`);
  revalidatePath('/dashboard');

  return {
    success: true,
    actionItem,
  };
}

/**
 * Delete an action item
 */
export async function deleteActionItem(
  actionItemId: string
): Promise<ActionItemActionResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to delete an action item',
    };
  }

  // Get the action item first to know the contact_id for revalidation
  const { data: actionItem, error: fetchError } = await supabase
    .from('action_items')
    .select('contact_id')
    .eq('id', actionItemId)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !actionItem) {
    return {
      success: false,
      error: 'Action item not found or you do not have permission to delete it',
    };
  }

  // Delete the action item
  const { error: deleteError } = await supabase
    .from('action_items')
    .delete()
    .eq('id', actionItemId)
    .eq('user_id', user.id);

  if (deleteError) {
    console.error('Failed to delete action item:', deleteError);
    return {
      success: false,
      error: 'Failed to delete action item. Please try again.',
    };
  }

  // Revalidate paths
  revalidatePath(`/contacts/${actionItem.contact_id}`);
  revalidatePath('/dashboard');

  return {
    success: true,
  };
}
