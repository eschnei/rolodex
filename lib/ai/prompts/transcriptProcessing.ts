/**
 * Transcript Processing Prompts
 *
 * Specialized prompts for processing meeting transcripts and long-form content.
 * Designed to work with chunked content for transcripts that exceed context limits.
 */

import type { ProcessingContext, TextChunk } from '../types';

/**
 * System prompt for transcript chunk processing
 */
export const TRANSCRIPT_CHUNK_SYSTEM_PROMPT = `You are a personal CRM assistant analyzing a portion of a meeting transcript or long conversation. Your task is to extract valuable information from this segment.

This is CHUNK {chunkIndex} of {totalChunks} of a longer transcript.

Your job is to:
1. Extract personal details about the contact mentioned (interests, family, preferences, key dates)
2. Identify action items or commitments made
3. Note any important context or relationship developments

IMPORTANT:
- Focus on facts and commitments, not general observations
- Action items should be specific and actionable, starting with a verb
- Be concise - this is just one part of a larger conversation
- Return ONLY valid JSON

Output format (JSON):
{
  "extracted_details": ["detail 1", "detail 2", ...],
  "action_items": ["action 1", "action 2", ...],
  "key_points": ["point 1", "point 2", ...]
}`;

/**
 * System prompt for merging chunk results into final summary
 */
export const MERGE_SYSTEM_PROMPT = `You are a personal CRM assistant. You have processed a long transcript in multiple chunks and now need to synthesize the results.

You will receive:
1. Contact information
2. The current summary (if any)
3. Extracted details and action items from each chunk
4. Key points from the conversation

Your job is to:
1. Combine and deduplicate the extracted details
2. Combine and deduplicate the action items
3. Generate a concise 2-4 sentence "living summary" that incorporates new information

For the summary, focus on:
- Who they are professionally
- What they care about
- Recent highlights from this conversation
- What makes this relationship meaningful

IMPORTANT:
- Remove duplicate items that say the same thing differently
- Prioritize actionable, specific items
- The summary should feel natural and conversational
- Return ONLY valid JSON

Output format (JSON):
{
  "extracted_details": ["detail 1", "detail 2", ...],
  "action_items": ["action 1", "action 2", ...],
  "summary": "2-4 sentence summary"
}`;

/**
 * Build prompt for processing a single chunk
 */
export function buildChunkPrompt(
  chunk: TextChunk,
  contactName: string
): { system: string; user: string } {
  const system = TRANSCRIPT_CHUNK_SYSTEM_PROMPT
    .replace('{chunkIndex}', String(chunk.index + 1))
    .replace('{totalChunks}', String(chunk.total));

  const user = `# Transcript Chunk ${chunk.index + 1} of ${chunk.total}
## Contact: ${contactName}

${chunk.content}

Please analyze this transcript segment and extract the relevant information as JSON.`;

  return { system, user };
}

/**
 * Build prompt for merging chunk results
 */
export function buildMergePrompt(
  context: ProcessingContext,
  chunkResults: Array<{
    extracted_details: string[];
    action_items: string[];
    key_points?: string[];
  }>
): string {
  const { contact } = context;

  // Collect all items from chunks
  const allDetails = chunkResults.flatMap((r) => r.extracted_details);
  const allActionItems = chunkResults.flatMap((r) => r.action_items);
  const allKeyPoints = chunkResults.flatMap((r) => r.key_points || []);

  // Build contact section
  const contactSection = `## Contact: ${contact.firstName}${contact.lastName ? ' ' + contact.lastName : ''}
${contact.company ? `- Company: ${contact.company}` : ''}
${contact.role ? `- Role: ${contact.role}` : ''}`.trim();

  // Build current summary section
  const summarySection = contact.currentSummary
    ? `\n## Current Summary\n${contact.currentSummary}`
    : '';

  // Build extracted data section
  const detailsSection = allDetails.length > 0
    ? `\n## Extracted Details from Transcript\n${allDetails.map((d) => `- ${d}`).join('\n')}`
    : '';

  const actionsSection = allActionItems.length > 0
    ? `\n## Action Items Found\n${allActionItems.map((a) => `- ${a}`).join('\n')}`
    : '';

  const keyPointsSection = allKeyPoints.length > 0
    ? `\n## Key Points from Conversation\n${allKeyPoints.map((p) => `- ${p}`).join('\n')}`
    : '';

  return `${contactSection}${summarySection}${detailsSection}${actionsSection}${keyPointsSection}

Please synthesize this information into a deduplicated set of details, action items, and an updated summary. Return as JSON.`;
}

/**
 * Intermediate schema for chunk results (includes key_points)
 */
export interface ChunkResult {
  extracted_details: string[];
  action_items: string[];
  key_points: string[];
}

/**
 * Parse chunk result from AI response
 */
export function parseChunkResult(responseText: string): ChunkResult {
  // Try to extract JSON from response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in chunk response');
  }

  const parsed = JSON.parse(jsonMatch[0]) as Partial<ChunkResult>;

  return {
    extracted_details: parsed.extracted_details || [],
    action_items: parsed.action_items || [],
    key_points: parsed.key_points || [],
  };
}
