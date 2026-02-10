*Let AI do the organizing so you don't have to.*

### REQ 4.1: Note Processing Pipeline

- Triggered on every note save (manual or transcript)
- Sends the new note content + all prior notes for this contact + structured contact fields to Claude API
- Prompt instructs Claude to extract: new personal details, business updates, key topics discussed, and action items
- Returns structured JSON: { extracted_details: string[], action_items: string[], updated_summary: string }
- Handles API errors gracefully — note still saves even if AI processing fails, with a retry option

### REQ 4.2: Living Summary

- AI-generated summary stored in contacts.ai_summary
- Regenerated on every new note (full context sent each time — viable at 50 contacts)
- Displayed at the top of the contact card in a visually distinct section
- Summary format: 2-4 sentence paragraph covering who they are, what they care about, recent conversation highlights, and any open threads
- "Last updated" timestamp shown below the summary
- If no notes exist yet: "Add notes to generate a summary"

### REQ 4.3: Auto-Extracted Action Items

- Action items returned from the AI pipeline are presented to the user for confirmation before saving (not auto-created blindly)
- After note save, a toast or inline UI shows: "AI found 2 action items: [item 1], [item 2] — Add these?"
- User can accept all, accept selectively, or dismiss
- Accepted items are created as action_item records linked to the source note

### REQ 4.4: Transcript Intelligence

- Same pipeline as REQ 4.1 but with additional prompt tuning for long-form transcripts
- Extracts: key topics, decisions made, commitments by either party, personal details mentioned, follow-up items
- Transcript content is chunked if it exceeds context window limits
- Results feed into the same summary and action item flows