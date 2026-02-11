'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Note, NoteType } from '@/lib/database.types';

export type NoteActionResult = {
  success: boolean;
  error?: string;
  note?: Note;
};

export type NotesListResult = {
  success: boolean;
  error?: string;
  notes?: Note[];
};

/**
 * Create a new note for a contact
 * Also updates the contact's last_contacted_at timestamp
 */
export async function createNote(
  contactId: string,
  content: string,
  noteType: NoteType = 'manual'
): Promise<NoteActionResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to create a note',
    };
  }

  // Validate content
  if (!content || content.trim().length === 0) {
    return {
      success: false,
      error: 'Note content cannot be empty',
    };
  }

  // Validate content length for transcripts (50k char limit)
  if (noteType === 'transcript' && content.length > 50000) {
    return {
      success: false,
      error: 'Transcript content exceeds 50,000 character limit',
    };
  }

  // Insert note
  const { data: note, error: noteError } = await supabase
    .from('notes')
    .insert({
      contact_id: contactId,
      user_id: user.id,
      content: content.trim(),
      note_type: noteType,
    })
    .select()
    .single();

  if (noteError) {
    console.error('Failed to create note:', noteError);
    return {
      success: false,
      error: 'Failed to create note. Please try again.',
    };
  }

  // Update contact's last_contacted_at
  const { error: contactError } = await supabase
    .from('contacts')
    .update({
      last_contacted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', contactId)
    .eq('user_id', user.id);

  if (contactError) {
    console.error('Failed to update contact last_contacted_at:', contactError);
    // Note was still created, so we don't fail the whole operation
  }

  // Revalidate paths
  revalidatePath(`/contacts/${contactId}`);
  revalidatePath('/contacts');
  revalidatePath('/dashboard');

  return {
    success: true,
    note,
  };
}

/**
 * Get all notes for a contact
 */
export async function getNotes(
  contactId: string,
  noteType?: NoteType
): Promise<NotesListResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to view notes',
    };
  }

  let query = supabase
    .from('notes')
    .select('*')
    .eq('contact_id', contactId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Apply type filter if specified
  if (noteType) {
    query = query.eq('note_type', noteType);
  }

  const { data: notes, error } = await query;

  if (error) {
    console.error('Failed to fetch notes:', error);
    return {
      success: false,
      error: 'Failed to fetch notes. Please try again.',
    };
  }

  return {
    success: true,
    notes: notes || [],
  };
}

/**
 * Delete a note
 * Associated action items will have their source_note_id set to null (cascade)
 */
export async function deleteNote(noteId: string): Promise<NoteActionResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to delete a note',
    };
  }

  // Get the note first to know the contact_id for revalidation
  const { data: note, error: fetchError } = await supabase
    .from('notes')
    .select('contact_id')
    .eq('id', noteId)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !note) {
    return {
      success: false,
      error: 'Note not found or you do not have permission to delete it',
    };
  }

  // Delete the note (RLS ensures user can only delete their own)
  const { error: deleteError } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', user.id);

  if (deleteError) {
    console.error('Failed to delete note:', deleteError);
    return {
      success: false,
      error: 'Failed to delete note. Please try again.',
    };
  }

  // Revalidate paths
  revalidatePath(`/contacts/${note.contact_id}`);

  return {
    success: true,
  };
}
