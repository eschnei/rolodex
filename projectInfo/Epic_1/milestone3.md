*Make the card useful during a live call.*

### REQ 3.1: Live Note Input

- Text area at the top of the notes section on the contact card, always visible and ready
- Auto-save: content saves to local state on every keystroke, persists to DB on blur or after 3 seconds of inactivity (debounced)
- "Save Note" button to explicitly commit the note to the feed
- On save: clears the input, new note appears at top of the chronological feed
- Placeholder text: "Jot notes during your call..."
- Mobile: text area is comfortable to type in, no tiny inputs

### REQ 3.2: Notes Feed

- Chronological list of all notes for a contact, newest first
- Each note shows: content, timestamp (relative — "2 days ago"), note type badge (manual / transcript)
- Notes are read-only once saved (no inline editing — keeps it simple)
- Delete a note: trash icon with confirmation, cascades to any action items sourced from that note

### REQ 3.3: Action Items

- Section on the contact card between the summary and notes feed
- Each action item: description text, checkbox for completion, source label if created from a note
- Manual add: inline text input + "Add" button to create an action item directly
- Check/uncheck toggles is_completed and sets/clears completed_at
- Filter toggle: show all vs show open only (default: open only)
- Completed items show with strikethrough and muted styling

### REQ 3.4: Transcript Upload

- "Upload Transcript" button alongside the note input
- Accepts: paste text into a modal textarea, or upload a .txt file
- On submit: saves as a note with note_type = "transcript"
- Transcript notes display with a "Transcript" badge in the feed
- Max length: 50,000 characters (enough for a 1-hour call transcript)
- No special processing yet — that comes in Milestone 4

### REQ 3.5: Last Contacted Tracking

- "I just reached out" button on the contact card updates last_contacted_at to current timestamp
- Also auto-updates when a new note is saved (assumption: if you're taking notes, you're talking to them)
- Last contacted date displayed on the card header and in the contacts list
- Displays as relative time ("3 days ago") with exact date on hover