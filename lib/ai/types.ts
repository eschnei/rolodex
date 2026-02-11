/**
 * AI-related type definitions for RoloDex
 *
 * These types define the structure of AI processing requests, responses,
 * and internal data used throughout the AI summarization pipeline.
 */

/**
 * Extracted data from AI processing of notes
 */
export interface ExtractedNoteData {
  /** Personal details about the contact (interests, family, preferences) */
  extracted_details: string[];
  /** Action items identified from the note content */
  action_items: string[];
  /** 2-4 sentence summary of who this person is */
  summary: string;
}

/**
 * Request payload for processing a note
 */
export interface ProcessNoteRequest {
  /** The note that was just created */
  noteId: string;
  /** The contact this note belongs to */
  contactId: string;
  /** Content of the new note */
  noteContent: string;
  /** Type of note being processed */
  noteType: 'manual' | 'transcript';
}

/**
 * Result from AI processing
 */
export interface ProcessNoteResult {
  success: boolean;
  /** The extracted data from AI */
  data?: ExtractedNoteData;
  /** Error message if processing failed */
  error?: string;
  /** Whether this was a transcript that required chunking */
  wasChunked?: boolean;
}

/**
 * Context gathered for AI processing
 */
export interface ProcessingContext {
  /** The new note content */
  newNote: {
    id: string;
    content: string;
    type: 'manual' | 'transcript';
    createdAt: string;
  };
  /** All previous notes for this contact */
  previousNotes: Array<{
    content: string;
    type: 'manual' | 'transcript';
    createdAt: string;
  }>;
  /** Contact information */
  contact: {
    id: string;
    firstName: string;
    lastName: string | null;
    company: string | null;
    role: string | null;
    location: string | null;
    howWeMet: string | null;
    personalIntel: string | null;
    currentSummary: string | null;
  };
}

/**
 * Processing status for real-time updates
 */
export type ProcessingStatus =
  | 'idle'
  | 'processing'
  | 'completed'
  | 'error';

/**
 * Processing state with timestamp
 */
export interface ProcessingState {
  status: ProcessingStatus;
  noteId?: string;
  startedAt?: number;
  error?: string;
}

/**
 * Chunk for processing long transcripts
 */
export interface TextChunk {
  /** Chunk index (0-based) */
  index: number;
  /** Total number of chunks */
  total: number;
  /** The chunk content */
  content: string;
  /** Character offset from start of original text */
  startOffset: number;
  /** Character offset of chunk end */
  endOffset: number;
}

/**
 * Result from merging chunked results
 */
export interface MergedChunkResult {
  /** Combined details from all chunks (deduplicated) */
  extracted_details: string[];
  /** Combined action items from all chunks (deduplicated) */
  action_items: string[];
  /** Summary synthesized from all chunks */
  summary: string;
}

/**
 * API error response
 */
export interface AIErrorResponse {
  success: false;
  error: string;
  code?: string;
  retryable?: boolean;
}

/**
 * API success response
 */
export interface AISuccessResponse {
  success: true;
  data: ExtractedNoteData;
  wasChunked?: boolean;
}

export type AIResponse = AIErrorResponse | AISuccessResponse;
