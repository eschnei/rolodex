/**
 * Zod Schemas for AI Response Validation
 *
 * These schemas validate the JSON responses from Claude to ensure
 * they conform to the expected structure.
 */

import { z } from 'zod';

/**
 * Schema for the extracted note data from AI processing
 */
export const ExtractedNoteDataSchema = z.object({
  // Personal details should be an array of strings
  extracted_details: z
    .array(z.string())
    .describe('Personal details about the contact extracted from notes'),

  // Action items should be an array of strings
  action_items: z
    .array(z.string())
    .describe('Action items identified from the note content'),

  // Summary should be 2-4 sentences
  summary: z
    .string()
    .min(10)
    .max(1000)
    .describe('A 2-4 sentence summary of who this person is'),
});

export type ExtractedNoteDataParsed = z.infer<typeof ExtractedNoteDataSchema>;

/**
 * Parse and validate AI response JSON
 *
 * Attempts to extract JSON from the response text and validate it
 * against the expected schema.
 */
export function parseAIResponse(responseText: string): ExtractedNoteDataParsed {
  // Try to extract JSON from the response
  const jsonString = extractJSON(responseText);

  if (!jsonString) {
    throw new Error('No valid JSON found in AI response');
  }

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Failed to parse JSON from AI response');
  }

  // Validate against schema
  const result = ExtractedNoteDataSchema.safeParse(parsed);

  if (!result.success) {
    const errors = result.error.issues
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ');
    throw new Error(`AI response validation failed: ${errors}`);
  }

  return result.data;
}

/**
 * Extract JSON from response text
 *
 * Handles various formats:
 * - Pure JSON
 * - JSON wrapped in markdown code blocks
 * - JSON with surrounding text
 */
function extractJSON(text: string): string | null {
  // Remove any leading/trailing whitespace
  const trimmed = text.trim();

  // Try parsing as pure JSON first
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed;
  }

  // Try extracting from markdown code block
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].trim();
  }

  // Try finding JSON object in the text
  const jsonMatch = trimmed.match(/\{[\s\S]*"extracted_details"[\s\S]*"action_items"[\s\S]*"summary"[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  // Try a more lenient extraction - find first { and last }
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return null;
}

/**
 * Validate that the summary is appropriately sized (2-4 sentences)
 */
export function validateSummaryLength(summary: string): boolean {
  // Count sentences by looking for sentence-ending punctuation
  const sentenceCount = (summary.match(/[.!?]+/g) || []).length;
  return sentenceCount >= 2 && sentenceCount <= 4;
}

/**
 * Clean and normalize extracted details
 * Removes duplicates and empty strings
 */
export function normalizeDetails(details: string[]): string[] {
  const seen = new Set<string>();
  return details
    .map((d) => d.trim())
    .filter((d) => {
      if (!d || seen.has(d.toLowerCase())) {
        return false;
      }
      seen.add(d.toLowerCase());
      return true;
    });
}

/**
 * Clean and normalize action items
 * Removes duplicates, empty strings, and ensures proper formatting
 */
export function normalizeActionItems(items: string[]): string[] {
  const seen = new Set<string>();
  return items
    .map((item) => {
      // Trim and remove leading bullet points or dashes
      let cleaned = item.trim().replace(/^[-*\u2022]\s*/, '');
      // Ensure first letter is capitalized
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      return cleaned;
    })
    .filter((item) => {
      if (!item || seen.has(item.toLowerCase())) {
        return false;
      }
      seen.add(item.toLowerCase());
      return true;
    });
}
