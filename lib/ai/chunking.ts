/**
 * Text Chunking for Long Transcripts
 *
 * Handles splitting long transcripts into processable chunks while
 * maintaining context overlap between chunks.
 */

import type { TextChunk } from './types';
import { CONTEXT_WINDOW_CHARS } from './client';

// Use 80% of context window for content, leaving room for system prompt and response
const CHUNK_SIZE_CHARS = Math.floor(CONTEXT_WINDOW_CHARS * 0.8);

// Overlap between chunks to maintain context (500 chars as specified)
const CHUNK_OVERLAP_CHARS = 500;

// Minimum chunk size (don't create tiny trailing chunks)
const MIN_CHUNK_SIZE = 1000;

/**
 * Split text into chunks with overlap
 *
 * Strategy:
 * 1. Calculate optimal chunk size based on context window
 * 2. Split at paragraph or sentence boundaries when possible
 * 3. Include overlap for context continuity
 */
export function chunkText(text: string): TextChunk[] {
  const trimmedText = text.trim();

  // If text fits in one chunk, return as-is
  if (trimmedText.length <= CHUNK_SIZE_CHARS) {
    return [
      {
        index: 0,
        total: 1,
        content: trimmedText,
        startOffset: 0,
        endOffset: trimmedText.length,
      },
    ];
  }

  const chunks: TextChunk[] = [];
  let currentPosition = 0;

  while (currentPosition < trimmedText.length) {
    // Calculate end position for this chunk
    let endPosition = Math.min(
      currentPosition + CHUNK_SIZE_CHARS,
      trimmedText.length
    );

    // If not at the end, try to find a good break point
    if (endPosition < trimmedText.length) {
      endPosition = findBreakPoint(trimmedText, currentPosition, endPosition);
    }

    // Extract chunk content
    const content = trimmedText.slice(currentPosition, endPosition);

    chunks.push({
      index: chunks.length,
      total: 0, // Will be updated after all chunks are created
      content,
      startOffset: currentPosition,
      endOffset: endPosition,
    });

    // Move position, accounting for overlap
    currentPosition = endPosition - CHUNK_OVERLAP_CHARS;

    // Ensure we don't go backwards or create tiny trailing chunks
    if (trimmedText.length - currentPosition < MIN_CHUNK_SIZE) {
      break;
    }
  }

  // Handle any remaining text
  const lastChunk = chunks[chunks.length - 1];
  if (lastChunk && lastChunk.endOffset < trimmedText.length) {
    lastChunk.endOffset = trimmedText.length;
    lastChunk.content = trimmedText.slice(lastChunk.startOffset);
  }

  // Update total count in all chunks
  const total = chunks.length;
  chunks.forEach((chunk) => {
    chunk.total = total;
  });

  return chunks;
}

/**
 * Find a good break point for chunking
 *
 * Prefers to break at:
 * 1. Paragraph boundaries (double newline)
 * 2. Single newlines
 * 3. Sentence endings (. ! ?)
 * 4. Other punctuation (, ; :)
 * 5. Word boundaries (spaces)
 */
function findBreakPoint(
  text: string,
  startPosition: number,
  targetPosition: number
): number {
  // Search window: look back up to 500 chars from target
  const searchStart = Math.max(startPosition, targetPosition - 500);
  const searchText = text.slice(searchStart, targetPosition);

  // Try to find paragraph break
  const paragraphBreak = searchText.lastIndexOf('\n\n');
  if (paragraphBreak !== -1) {
    return searchStart + paragraphBreak + 2; // After the double newline
  }

  // Try to find single newline
  const lineBreak = searchText.lastIndexOf('\n');
  if (lineBreak !== -1) {
    return searchStart + lineBreak + 1;
  }

  // Try to find sentence ending
  const sentenceEndings = ['. ', '! ', '? '];
  for (const ending of sentenceEndings) {
    const sentenceBreak = searchText.lastIndexOf(ending);
    if (sentenceBreak !== -1) {
      return searchStart + sentenceBreak + ending.length;
    }
  }

  // Try to find other punctuation
  const punctuation = [', ', '; ', ': '];
  for (const punct of punctuation) {
    const punctBreak = searchText.lastIndexOf(punct);
    if (punctBreak !== -1) {
      return searchStart + punctBreak + punct.length;
    }
  }

  // Last resort: find last space
  const spaceBreak = searchText.lastIndexOf(' ');
  if (spaceBreak !== -1) {
    return searchStart + spaceBreak + 1;
  }

  // No good break point found, use target position
  return targetPosition;
}

/**
 * Check if text needs chunking
 */
export function needsChunking(text: string): boolean {
  return text.length > CHUNK_SIZE_CHARS;
}

/**
 * Get chunk statistics
 */
export function getChunkStats(text: string): {
  totalLength: number;
  chunkCount: number;
  avgChunkSize: number;
} {
  const chunks = chunkText(text);
  const totalLength = text.length;
  const chunkCount = chunks.length;
  const avgChunkSize = Math.round(
    chunks.reduce((sum, c) => sum + c.content.length, 0) / chunkCount
  );

  return { totalLength, chunkCount, avgChunkSize };
}

/**
 * Estimate processing time for chunks
 * Based on average API response time of ~2-3 seconds per chunk
 */
export function estimateProcessingTime(chunkCount: number): number {
  const avgTimePerChunk = 2500; // 2.5 seconds
  const mergeTime = 3000; // 3 seconds for final merge
  return chunkCount * avgTimePerChunk + (chunkCount > 1 ? mergeTime : 0);
}
