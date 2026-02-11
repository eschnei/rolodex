/**
 * AI Processing Pipeline
 *
 * Main processing logic for analyzing notes and generating summaries.
 * Handles both regular notes and long transcripts with chunking.
 */

import { sendMessage } from './client';
import {
  SYSTEM_PROMPT,
  buildUserMessage,
  isContextTooLarge,
} from './prompts/noteProcessing';
import {
  MERGE_SYSTEM_PROMPT,
  buildChunkPrompt,
  buildMergePrompt,
  parseChunkResult,
  type ChunkResult,
} from './prompts/transcriptProcessing';
import { chunkText, needsChunking } from './chunking';
import {
  parseAIResponse,
  normalizeDetails,
  normalizeActionItems,
} from './schemas';
import {
  AIError,
  ParseError,
  ContextTooLargeError,
  ConfigurationError,
} from './errors';
import { withRateLimit } from './rateLimit';
import { isConfigured } from './client';
import type {
  ProcessingContext,
  ExtractedNoteData,
  ProcessNoteResult,
} from './types';

/**
 * Process a note and extract information
 *
 * Main entry point for AI processing. Handles:
 * - Regular notes: Direct processing
 * - Long transcripts: Chunked processing with merge
 */
export async function processNote(
  context: ProcessingContext,
  userId: string
): Promise<ProcessNoteResult> {
  // Check if AI is configured
  if (!isConfigured()) {
    throw new ConfigurationError();
  }

  // Determine if we need chunking
  const isTranscript = context.newNote.type === 'transcript';
  const contentNeedsChunking = needsChunking(context.newNote.content);

  if (contentNeedsChunking && isTranscript) {
    // Process with chunking
    return await withRateLimit(userId, () =>
      processWithChunking(context, userId)
    );
  }

  // Check if context is too large even without chunking
  if (isContextTooLarge(context)) {
    throw new ContextTooLargeError(
      context.newNote.content.length,
      150000,
      'Content is too large to process. Try adding shorter notes.'
    );
  }

  // Standard processing
  return await withRateLimit(userId, () => processStandard(context));
}

/**
 * Standard processing for regular notes
 */
async function processStandard(
  context: ProcessingContext
): Promise<ProcessNoteResult> {
  try {
    const userMessage = buildUserMessage(context);
    const response = await sendMessage(SYSTEM_PROMPT, userMessage);

    // Parse and validate response
    const parsed = parseAIResponse(response);

    // Normalize the data
    const data: ExtractedNoteData = {
      extracted_details: normalizeDetails(parsed.extracted_details),
      action_items: normalizeActionItems(parsed.action_items),
      summary: parsed.summary.trim(),
    };

    return {
      success: true,
      data,
      wasChunked: false,
    };
  } catch (error) {
    if (error instanceof AIError) {
      throw error;
    }
    throw new ParseError(
      'Failed to process note',
      error instanceof Error ? error.message : undefined
    );
  }
}

/**
 * Process long content with chunking
 */
async function processWithChunking(
  context: ProcessingContext,
  _userId: string
): Promise<ProcessNoteResult> {
  const chunks = chunkText(context.newNote.content);
  const contactName = `${context.contact.firstName}${context.contact.lastName ? ' ' + context.contact.lastName : ''}`;

  // Process each chunk
  const chunkResults: ChunkResult[] = [];

  for (const chunk of chunks) {
    const { system, user } = buildChunkPrompt(chunk, contactName);

    try {
      const response = await sendMessage(system, user);
      const result = parseChunkResult(response);
      chunkResults.push(result);
    } catch (error) {
      // Log error but continue with other chunks
      console.error(`Failed to process chunk ${chunk.index + 1}:`, error);
      // Add empty result for this chunk
      chunkResults.push({
        extracted_details: [],
        action_items: [],
        key_points: [],
      });
    }

    // Small delay between chunks to avoid rate limiting
    if (chunk.index < chunks.length - 1) {
      await sleep(500);
    }
  }

  // Merge results
  return await mergeChunkResults(context, chunkResults);
}

/**
 * Merge chunked results into final output
 */
async function mergeChunkResults(
  context: ProcessingContext,
  chunkResults: ChunkResult[]
): Promise<ProcessNoteResult> {
  try {
    const userMessage = buildMergePrompt(context, chunkResults);
    const response = await sendMessage(MERGE_SYSTEM_PROMPT, userMessage);

    // Parse and validate response
    const parsed = parseAIResponse(response);

    // Normalize the data
    const data: ExtractedNoteData = {
      extracted_details: normalizeDetails(parsed.extracted_details),
      action_items: normalizeActionItems(parsed.action_items),
      summary: parsed.summary.trim(),
    };

    return {
      success: true,
      data,
      wasChunked: true,
    };
  } catch {
    // If merge fails, try to return aggregated chunk results
    const fallbackData = aggregateChunkResults(chunkResults);
    return {
      success: true,
      data: fallbackData,
      wasChunked: true,
    };
  }
}

/**
 * Aggregate chunk results without AI merge (fallback)
 */
function aggregateChunkResults(chunkResults: ChunkResult[]): ExtractedNoteData {
  const allDetails = chunkResults.flatMap((r) => r.extracted_details);
  const allActionItems = chunkResults.flatMap((r) => r.action_items);

  return {
    extracted_details: normalizeDetails(allDetails),
    action_items: normalizeActionItems(allActionItems),
    summary: 'Summary generation in progress. Please check back later.',
  };
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build processing context from database data
 */
export function buildProcessingContext(
  contact: {
    id: string;
    first_name: string;
    last_name: string | null;
    company: string | null;
    role: string | null;
    location: string | null;
    how_we_met: string | null;
    personal_intel: string | null;
    ai_summary: string | null;
  },
  newNote: {
    id: string;
    content: string;
    note_type: 'manual' | 'transcript';
    created_at: string;
  },
  previousNotes: Array<{
    content: string;
    note_type: 'manual' | 'transcript';
    created_at: string;
  }>
): ProcessingContext {
  return {
    contact: {
      id: contact.id,
      firstName: contact.first_name,
      lastName: contact.last_name,
      company: contact.company,
      role: contact.role,
      location: contact.location,
      howWeMet: contact.how_we_met,
      personalIntel: contact.personal_intel,
      currentSummary: contact.ai_summary,
    },
    newNote: {
      id: newNote.id,
      content: newNote.content,
      type: newNote.note_type,
      createdAt: newNote.created_at,
    },
    previousNotes: previousNotes.map((note) => ({
      content: note.content,
      type: note.note_type,
      createdAt: note.created_at,
    })),
  };
}
