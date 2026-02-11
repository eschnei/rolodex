/**
 * Note Processing Prompt
 *
 * Prompts for extracting personal details, action items, and generating
 * summaries from contact notes.
 */

import type { ProcessingContext } from '../types';

/**
 * System prompt for note processing
 */
export const SYSTEM_PROMPT = `You are a personal CRM assistant helping a user maintain relationships with their professional network. Your task is to analyze notes about contacts and extract meaningful information.

You will receive:
1. Information about a contact (name, company, role, etc.)
2. A new note that was just added
3. Previous notes about this contact (if any)
4. The current summary (if any)

Your job is to:
1. Extract personal details that would be valuable to remember (interests, family details, preferences, key dates, etc.)
2. Identify action items mentioned in the notes that the user should follow up on
3. Generate a concise 2-4 sentence "living summary" of who this person is

For the summary, focus on:
- Who they are professionally (role, company)
- What they care about (interests, values)
- Any recent highlights or important context for the relationship
- What makes this relationship meaningful

IMPORTANT:
- Be concise and specific
- Only extract real action items (things the user should DO), not observations
- For action items, phrase them as actionable tasks starting with a verb
- The summary should be updated to reflect new information while maintaining context
- Return ONLY valid JSON, no additional text

Output format (JSON):
{
  "extracted_details": ["detail 1", "detail 2", ...],
  "action_items": ["action 1", "action 2", ...],
  "summary": "2-4 sentence summary"
}`;

/**
 * Build the user message for note processing
 */
export function buildUserMessage(context: ProcessingContext): string {
  const { contact, newNote, previousNotes } = context;

  // Build contact info section
  const contactInfo = buildContactInfo(contact);

  // Build previous notes section
  const previousNotesSection = buildPreviousNotes(previousNotes);

  // Build current summary section
  const currentSummarySection = contact.currentSummary
    ? `\n## Current Summary\n${contact.currentSummary}`
    : '';

  // Build new note section
  const newNoteSection = `## New Note (${newNote.type})\n${newNote.content}`;

  return `# Contact: ${contact.firstName}${contact.lastName ? ' ' + contact.lastName : ''}

${contactInfo}${currentSummarySection}${previousNotesSection}

${newNoteSection}

Please analyze this information and return the extracted details, action items, and updated summary as JSON.`;
}

/**
 * Build contact info section
 */
function buildContactInfo(contact: ProcessingContext['contact']): string {
  const lines: string[] = [];

  if (contact.company) {
    lines.push(`- Company: ${contact.company}`);
  }
  if (contact.role) {
    lines.push(`- Role: ${contact.role}`);
  }
  if (contact.location) {
    lines.push(`- Location: ${contact.location}`);
  }
  if (contact.howWeMet) {
    lines.push(`- How we met: ${contact.howWeMet}`);
  }
  if (contact.personalIntel) {
    lines.push(`- Personal notes: ${contact.personalIntel}`);
  }

  if (lines.length === 0) {
    return '';
  }

  return `## Contact Info\n${lines.join('\n')}`;
}

/**
 * Build previous notes section
 */
function buildPreviousNotes(
  notes: ProcessingContext['previousNotes']
): string {
  if (notes.length === 0) {
    return '';
  }

  // Limit to most recent 10 notes to stay within context
  const recentNotes = notes.slice(0, 10);

  const notesText = recentNotes
    .map((note, index) => {
      const date = new Date(note.createdAt).toLocaleDateString();
      const type = note.type === 'transcript' ? ' (transcript)' : '';
      // Truncate very long notes
      const content =
        note.content.length > 2000
          ? note.content.slice(0, 2000) + '...'
          : note.content;
      return `### Note ${index + 1}${type} - ${date}\n${content}`;
    })
    .join('\n\n');

  return `\n## Previous Notes\n${notesText}`;
}

/**
 * Estimate token count for a message
 * Rough estimate: 1 token ~= 4 characters for English text
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Check if the context is too large for the model
 * Uses conservative estimate to leave room for response
 */
export function isContextTooLarge(context: ProcessingContext): boolean {
  const message = buildUserMessage(context);
  const systemTokens = estimateTokens(SYSTEM_PROMPT);
  const userTokens = estimateTokens(message);

  // Leave room for response (2k tokens) and some buffer
  const maxInputTokens = 45000; // Conservative for Haiku

  return systemTokens + userTokens > maxInputTokens;
}
