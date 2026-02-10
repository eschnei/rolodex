# Milestone 4: AI Summarization - Development Tasks

## Milestone Summary

Let AI do the organizing so you don't have to. This milestone implements the AI-powered note processing pipeline using Claude API. When notes are saved, AI extracts key details, action items, and generates a living summary that updates with each new note.

**Key Deliverables:**
- Note processing pipeline triggered on save
- AI-generated living summary on contact card
- Auto-extracted action items with user confirmation
- Transcript processing with chunking for long content

**Prerequisite:** Milestone 3 completed (notes & action items)

---

## Tasks

### M4-T01: Set Up Claude API Integration

**Description:**
Configure the Anthropic Claude API integration for AI processing. Set up the API client, environment variables, and basic request handling.

**Acceptance Criteria:**
- [ ] Anthropic SDK installed and configured
- [ ] API key stored in environment variables
- [ ] API client utility created for making requests
- [ ] Error handling for API failures (rate limits, network errors)
- [ ] Request timeout handling
- [ ] Basic test endpoint to verify API connectivity

**Dependencies:** Milestone 3 complete

**Files to Create/Modify:**
- `lib/ai/client.ts` - Anthropic API client setup
- `.env.local` - Add ANTHROPIC_API_KEY
- `.env.example` - Document ANTHROPIC_API_KEY requirement
- `lib/ai/types.ts` - Type definitions for AI responses

**Technical Notes:**
- Use `@anthropic-ai/sdk` package
- Claude model: claude-3-haiku or claude-3-sonnet (balance cost/quality)
- Set reasonable timeout (30 seconds)
- Include retry logic for transient failures

---

### M4-T02: Create Note Processing Prompt

**Description:**
Design and implement the prompt that instructs Claude to extract information from notes. The prompt should handle the context of all prior notes plus the new note.

**Acceptance Criteria:**
- [ ] Prompt template created for note processing
- [ ] Includes: new note content, all prior notes, contact structured fields
- [ ] Instructs extraction of: personal details, business updates, key topics, action items
- [ ] Requests structured JSON response
- [ ] Response format defined: { extracted_details: string[], action_items: string[], updated_summary: string }
- [ ] Prompt handles edge cases (first note, minimal content)

**Dependencies:** M4-T01

**Files to Create/Modify:**
- `lib/ai/prompts/noteProcessing.ts` - Note processing prompt template
- `lib/ai/schemas.ts` - Zod schemas for AI response validation

**Technical Notes:**
- Use system prompt for consistent behavior
- Include contact context (name, company, role) for better extraction
- Summary should be 2-4 sentences covering: who they are, what they care about, recent highlights, open threads
- Action items should be actionable phrases starting with verbs

---

### M4-T03: Implement Note Processing Pipeline

**Description:**
Build the processing pipeline that triggers on every note save. Sends context to Claude API and handles the response.

**Acceptance Criteria:**
- [ ] Pipeline triggered after successful note save
- [ ] Gathers: new note, all prior notes, contact fields
- [ ] Sends request to Claude API
- [ ] Parses and validates JSON response
- [ ] Handles API errors gracefully - note still saves even if AI fails
- [ ] Provides retry option if AI processing fails
- [ ] Processing happens asynchronously (doesn't block note save)

**Dependencies:** M4-T01, M4-T02

**Files to Create/Modify:**
- `lib/ai/pipeline.ts` - Main processing pipeline
- `lib/actions/notes.ts` - Trigger pipeline after note creation
- `lib/ai/retry.ts` - Retry logic utility

**Technical Notes:**
- Use background processing (don't await in note save)
- Consider using Edge Functions or API routes for AI calls
- Store processing status somewhere to show UI feedback
- Max context: all notes for this contact (viable at ~50 contacts)

---

### M4-T04: Store and Display Living Summary

**Description:**
Save the AI-generated summary to the contact record and display it prominently on the contact card.

**Acceptance Criteria:**
- [ ] Summary stored in contacts.ai_summary field
- [ ] Summary regenerated on every new note
- [ ] Displayed at top of contact card in visually distinct section
- [ ] Summary format: 2-4 sentence paragraph
- [ ] Shows "Last updated" timestamp below summary
- [ ] If no notes: "Add notes to generate a summary"
- [ ] Loading state while summary is being generated
- [ ] Summary updates in UI after processing completes

**Dependencies:** M4-T03

**Files to Create/Modify:**
- `components/contacts/ContactSummary.tsx` - Summary display component
- `lib/actions/contacts.ts` - Update ai_summary field
- `app/(app)/contacts/[id]/page.tsx` - Replace summary placeholder

**Technical Notes:**
- Use design system summary block styling (bg-inset, border-left accent)
- Summary should be scannable in under 10 seconds
- Consider polling or WebSocket for real-time updates after processing
- Store updated_at for summary freshness indication

---

### M4-T05: Implement Action Item Extraction UI

**Description:**
When AI extracts action items, present them to the user for confirmation before adding to the action items list. User can accept all, selectively, or dismiss.

**Acceptance Criteria:**
- [ ] After note save + AI processing, UI shows extracted action items
- [ ] Display as toast, modal, or inline notification
- [ ] Each extracted item has individual accept/reject
- [ ] "Add all" button to accept all items
- [ ] "Dismiss" to reject all
- [ ] Accepted items created as action_item records with source_note_id
- [ ] UI disappears after action taken
- [ ] Works on mobile

**Dependencies:** M4-T03, M3-T05

**Files to Create/Modify:**
- `components/actionItems/ExtractedItemsReview.tsx` - Review UI component
- `components/ui/Notification.tsx` - Toast/notification component
- `lib/actions/actionItems.ts` - Bulk create action items

**Technical Notes:**
- Consider toast with expandable detail vs inline section
- Store pending extractions in state until user acts
- Timeout: auto-dismiss after 30 seconds with option to review later
- Link items to source_note_id for attribution

---

### M4-T06: Handle AI Processing Errors

**Description:**
Implement comprehensive error handling for the AI pipeline. Ensure notes are never lost due to AI failures.

**Acceptance Criteria:**
- [ ] Note saves successfully even if AI processing fails
- [ ] Error message shown to user when AI fails
- [ ] "Retry" button available to re-run AI processing
- [ ] Rate limit errors handled with appropriate messaging
- [ ] Network timeout errors handled
- [ ] Invalid response format handled
- [ ] Error state cleared on successful retry

**Dependencies:** M4-T03

**Files to Create/Modify:**
- `lib/ai/pipeline.ts` - Add comprehensive error handling
- `components/notes/ProcessingError.tsx` - Error display component
- `lib/ai/errors.ts` - Error type definitions

**Technical Notes:**
- Categorize errors: transient (retry) vs permanent (report)
- Log errors for debugging
- User message: "Couldn't process note with AI. Your note was saved. Try again?"
- Store processing status per note for retry capability

---

### M4-T07: Create Transcript Processing with Chunking

**Description:**
Apply the same extraction pipeline to uploaded transcripts. Handle long transcripts by chunking to fit within context limits.

**Acceptance Criteria:**
- [ ] Transcripts processed through same AI pipeline
- [ ] Additional prompt tuning for long-form transcripts
- [ ] Extracts: key topics, decisions made, commitments, personal details, follow-ups
- [ ] Chunking for transcripts exceeding context window
- [ ] Results from chunks are merged into coherent output
- [ ] Progress indication for long transcripts
- [ ] Same summary and action item flows as regular notes

**Dependencies:** M4-T03, M3-T08

**Files to Create/Modify:**
- `lib/ai/prompts/transcriptProcessing.ts` - Transcript-specific prompt
- `lib/ai/chunking.ts` - Text chunking utility
- `lib/ai/pipeline.ts` - Add transcript handling

**Technical Notes:**
- Claude context window: chunk at ~80% of limit
- Overlap chunks by ~500 chars for continuity
- Merge extracted items, deduplicate action items
- Final summary should synthesize all chunks

---

### M4-T08: Add Processing Status Indicator

**Description:**
Show a visual indicator when AI is processing notes, so users know the summary is being updated.

**Acceptance Criteria:**
- [ ] Processing indicator visible during AI processing
- [ ] Appears in summary section or near note input
- [ ] Subtle animation (pulsing dot or progress bar)
- [ ] Disappears when processing completes
- [ ] Shows error state if processing fails
- [ ] Does not block user from continuing to use the app

**Dependencies:** M4-T03, M4-T04

**Files to Create/Modify:**
- `components/ui/ProcessingIndicator.tsx` - Visual indicator
- `components/contacts/ContactSummary.tsx` - Integrate indicator
- `lib/hooks/useProcessingStatus.ts` - Status tracking hook

**Technical Notes:**
- Use subtle indication per design principles (AI stays in background)
- No "AI is thinking..." text - just visual feedback
- Consider skeleton state for summary while processing

---

### M4-T09: Optimize API Calls and Caching

**Description:**
Optimize the AI processing to be cost-effective and fast. Implement caching where appropriate.

**Acceptance Criteria:**
- [ ] API calls are efficient (minimal token usage)
- [ ] Rate limiting respected with backoff
- [ ] Concurrent processing limit for multiple notes
- [ ] Consider batching if multiple notes saved quickly
- [ ] Cache previous summaries to reduce regeneration if no new notes
- [ ] Monitor and log API usage

**Dependencies:** M4-T03

**Files to Create/Modify:**
- `lib/ai/optimization.ts` - Optimization utilities
- `lib/ai/rateLimit.ts` - Rate limiting logic
- `lib/ai/cache.ts` - Summary caching logic

**Technical Notes:**
- Use haiku for fast, cheap processing
- Track token usage per user for monitoring
- Consider caching last 5-10 summaries
- Debounce rapid note saves to single processing call

---

### M4-T10: Create AI Settings (Optional)

**Description:**
Add user settings for AI features, such as enabling/disabling auto-extraction.

**Acceptance Criteria:**
- [ ] Settings option to disable AI processing
- [ ] If disabled, notes save without AI extraction
- [ ] Summary section shows "AI processing disabled" message
- [ ] Can be re-enabled at any time
- [ ] Existing summaries preserved when disabled

**Dependencies:** M4-T03

**Files to Create/Modify:**
- `app/(app)/settings/page.tsx` - Add AI settings section
- `lib/actions/user.ts` - Update user preferences
- `lib/ai/pipeline.ts` - Check user preferences before processing

**Technical Notes:**
- Store preference in users table: ai_processing_enabled (default true)
- This is optional - only implement if time allows
- Useful for users who want to opt out of AI features

---

## Task Order (Suggested Implementation Sequence)

1. **M4-T01** - Set Up Claude API Integration
2. **M4-T02** - Create Note Processing Prompt
3. **M4-T03** - Implement Note Processing Pipeline
4. **M4-T04** - Store and Display Living Summary
5. **M4-T06** - Handle AI Processing Errors
6. **M4-T08** - Add Processing Status Indicator
7. **M4-T05** - Implement Action Item Extraction UI
8. **M4-T07** - Create Transcript Processing with Chunking
9. **M4-T09** - Optimize API Calls and Caching
10. **M4-T10** - Create AI Settings (optional)

**Parallelization Opportunities:**
- T08 can be developed alongside T04
- T06 should be integrated throughout T03-T05 development
- T09 can be done after core functionality works

---

## Quality Checklist

- [ ] Notes save successfully even when AI fails
- [ ] Summaries are concise and scannable (under 10 seconds)
- [ ] Action items are actionable and relevant
- [ ] Transcripts process correctly even when long
- [ ] Error states provide clear recovery options
- [ ] AI processing doesn't slow down note-taking
- [ ] No "AI" badges or labels per brand guidelines
- [ ] API costs are reasonable (monitored)
- [ ] Mobile experience is smooth
