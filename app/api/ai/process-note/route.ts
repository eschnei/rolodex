/**
 * API Route: Process Note with AI
 *
 * Processes a note asynchronously after save to extract information
 * and update the contact's living summary.
 *
 * POST /api/ai/process-note
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processNote, buildProcessingContext } from '@/lib/ai/pipeline';
import { createErrorResult } from '@/lib/ai/errors';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { noteId, contactId } = body;

    if (!noteId || !contactId) {
      return NextResponse.json(
        { success: false, error: 'Missing noteId or contactId' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch the note
    const { data: note, error: noteError } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', user.id)
      .single();

    if (noteError || !note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    // Fetch the contact
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .eq('user_id', user.id)
      .single();

    if (contactError || !contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Fetch previous notes (excluding the current one)
    const { data: previousNotes } = await supabase
      .from('notes')
      .select('content, note_type, created_at')
      .eq('contact_id', contactId)
      .eq('user_id', user.id)
      .neq('id', noteId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Build processing context
    const context = buildProcessingContext(
      contact,
      note,
      previousNotes || []
    );

    // Process with AI
    const result = await processNote(context, user.id);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || 'Processing failed' },
        { status: 500 }
      );
    }

    // Update contact with new summary
    const { error: updateError } = await supabase
      .from('contacts')
      .update({
        ai_summary: result.data.summary,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contactId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Failed to update contact summary:', updateError);
      // Continue anyway - we still have the extracted data
    }

    // Revalidate the contact page
    revalidatePath(`/contacts/${contactId}`);

    // Return success with extracted data
    return NextResponse.json({
      success: true,
      data: result.data,
      wasChunked: result.wasChunked,
    });
  } catch (error) {
    console.error('AI processing error:', error);
    const errorResult = createErrorResult(error);
    return NextResponse.json(errorResult, { status: 500 });
  }
}
