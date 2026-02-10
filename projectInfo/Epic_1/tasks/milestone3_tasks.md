# Milestone 3: Notes & Action Items - Development Tasks

## Milestone Summary

Make the contact card useful during a live call. This milestone adds real-time note-taking with auto-save, a chronological notes feed, action items with checkboxes, transcript upload capability, and automatic "last contacted" tracking when notes are saved.

**Key Deliverables:**
- Fast, minimal note input with auto-save
- Chronological notes feed with timestamps
- Action items with completion tracking
- Transcript upload (paste or file)
- Automatic last_contacted_at updates

**Prerequisite:** Milestone 2 completed (contact cards CRUD)

---

## Tasks

### M3-T01: Create Notes Input Component

**Description:**
Build the primary note-taking input that sits at the top of the notes section on the contact card. Designed for use during live calls with fast, minimal interaction.

**Acceptance Criteria:**
- [ ] Text area visible at top of notes section, always ready
- [ ] Placeholder text: "Jot notes during your call..."
- [ ] Auto-save to local state on every keystroke
- [ ] Debounced save to database (3 seconds of inactivity or on blur)
- [ ] "Save Note" button for explicit commit
- [ ] On save: clears input, new note appears in feed
- [ ] Mobile-friendly - comfortable to type in on small screens
- [ ] Visual indicator when saving/syncing
- [ ] Cannot submit empty note

**Dependencies:** Milestone 2 complete

**Files to Create/Modify:**
- `components/notes/NoteInput.tsx` - Main note input component
- `lib/hooks/useAutoSave.ts` - Auto-save hook with debounce
- `lib/actions/notes.ts` - Server actions for note operations

**Technical Notes:**
- Use textarea with min-height for mobile comfort
- Debounce: save after 3 seconds of inactivity
- Local state persists during typing, syncs on blur/inactivity
- On explicit save, immediately show in feed (optimistic)
- Clear input only after successful save confirmation

---

### M3-T02: Build Notes Feed Component

**Description:**
Create the chronological list of all notes for a contact, displayed newest first. Each note shows content, timestamp, and note type badge.

**Acceptance Criteria:**
- [ ] Notes displayed in reverse chronological order (newest first)
- [ ] Each note shows: content, timestamp, note type badge
- [ ] Timestamp displayed as relative time ("2 days ago")
- [ ] Note type badge: "Manual" or "Transcript"
- [ ] Notes are read-only (no inline editing)
- [ ] Delete icon with confirmation on each note
- [ ] Empty state: "No notes yet. This is where conversation details will live."
- [ ] Smooth animation when new note is added

**Dependencies:** M3-T01

**Files to Create/Modify:**
- `components/notes/NotesFeed.tsx` - Notes list container
- `components/notes/NoteEntry.tsx` - Individual note display
- `components/ui/Badge.tsx` - Badge component (if not exists)
- `lib/actions/notes.ts` - Fetch and delete notes

**Technical Notes:**
- Fetch notes for contact_id, order by created_at DESC
- Badge styling: neutral style for note type
- Delete should cascade to action items with source_note_id
- Use subtle separator between notes (border-bottom)
- Timestamp format from design system (mono font)

---

### M3-T03: Integrate Notes Section into Contact Card

**Description:**
Add the notes section (input + feed) to the contact detail page. Replace the placeholder with functional components.

**Acceptance Criteria:**
- [ ] Notes section visible on contact detail page
- [ ] Positioned below AI summary placeholder, above action items
- [ ] Note input at top of section
- [ ] Notes feed below input
- [ ] Section header: "Notes" with count indicator
- [ ] Loading state while fetching notes
- [ ] Real-time update when note is added

**Dependencies:** M3-T01, M3-T02

**Files to Create/Modify:**
- `app/(app)/contacts/[id]/page.tsx` - Integrate notes section
- `components/notes/NotesSection.tsx` - Combined notes section
- `components/contacts/NotesPlaceholder.tsx` - Remove/replace

**Technical Notes:**
- Fetch notes with contact data or as separate query
- Consider using React Query for real-time updates
- Section should scroll independently if many notes

---

### M3-T04: Implement Note Deletion

**Description:**
Add the ability to delete notes with confirmation. Deletion should cascade to any action items sourced from that note.

**Acceptance Criteria:**
- [ ] Delete icon (trash) on each note entry
- [ ] Confirmation before deletion (inline or modal)
- [ ] Confirmation message: "Delete this note?"
- [ ] Deletion removes note from database
- [ ] Cascades to action items with source_note_id matching this note
- [ ] UI updates immediately (optimistic)
- [ ] Error handling if deletion fails

**Dependencies:** M3-T02

**Files to Create/Modify:**
- `components/notes/NoteEntry.tsx` - Add delete functionality
- `lib/actions/notes.ts` - deleteNote action
- `components/ui/ConfirmDelete.tsx` - Inline confirmation component

**Technical Notes:**
- Use inline confirmation (show confirm/cancel) rather than modal
- Cascade delete handled by FK constraint or explicit in action
- Optimistic update: remove from list immediately
- Restore on error

---

### M3-T05: Create Action Items Section

**Description:**
Build the action items section on the contact card. Displays action items with checkboxes for completion tracking.

**Acceptance Criteria:**
- [ ] Action items section on contact card (between summary and notes)
- [ ] Each action item: checkbox, description text, source label if from note
- [ ] Check/uncheck toggles is_completed
- [ ] Completed items show strikethrough and muted styling
- [ ] Filter toggle: "Show all" vs "Show open only" (default: open only)
- [ ] Empty state: "No action items."
- [ ] Count indicator in section header

**Dependencies:** Milestone 2 complete

**Files to Create/Modify:**
- `components/actionItems/ActionItemsSection.tsx` - Section container
- `components/actionItems/ActionItem.tsx` - Individual action item
- `components/actionItems/ActionItemsFilter.tsx` - Filter toggle
- `lib/actions/actionItems.ts` - Server actions for action items

**Technical Notes:**
- Fetch action items for contact_id
- Default filter: is_completed = false
- Toggle sets completed_at to now or null
- Source label: "From note on [date]" if source_note_id exists
- Use checkbox input with accent color

---

### M3-T06: Implement Manual Action Item Creation

**Description:**
Add the ability to manually create action items without going through note extraction. Inline input with add button.

**Acceptance Criteria:**
- [ ] Inline text input at top of action items section
- [ ] Placeholder: "Add an action item..."
- [ ] "Add" button or Enter key to create
- [ ] New item appears at top of list (or bottom, consistent order)
- [ ] Cannot add empty action item
- [ ] Optimistic update - item appears immediately
- [ ] source_note_id is null for manually created items

**Dependencies:** M3-T05

**Files to Create/Modify:**
- `components/actionItems/AddActionItem.tsx` - Inline input component
- `lib/actions/actionItems.ts` - createActionItem action

**Technical Notes:**
- Simple text input + button layout
- Clear input after successful add
- New items created with is_completed = false
- Order: newest first or oldest first (be consistent)

---

### M3-T07: Implement Action Item Toggle and Delete

**Description:**
Add functionality to toggle action item completion status and delete action items.

**Acceptance Criteria:**
- [ ] Clicking checkbox toggles is_completed
- [ ] Toggle updates completed_at (set to now or null)
- [ ] Completed items show strikethrough and muted text
- [ ] Delete button (X or trash icon) on each item
- [ ] No confirmation needed for action item delete (reversible by re-adding)
- [ ] Optimistic updates for both operations

**Dependencies:** M3-T05

**Files to Create/Modify:**
- `components/actionItems/ActionItem.tsx` - Add toggle and delete
- `lib/actions/actionItems.ts` - toggleActionItem, deleteActionItem actions

**Technical Notes:**
- Toggle: update is_completed and completed_at in single operation
- CSS for completed: `line-through text-text-tertiary`
- Delete is permanent but quick to recreate

---

### M3-T08: Build Transcript Upload Modal

**Description:**
Create the transcript upload functionality. Users can paste text or upload a .txt file to save as a transcript note.

**Acceptance Criteria:**
- [ ] "Upload Transcript" button alongside note input
- [ ] Opens modal with two options: paste text or upload file
- [ ] Textarea for pasting transcript text
- [ ] File input accepting .txt files
- [ ] Preview of content before submission
- [ ] Character limit: 50,000 characters
- [ ] Submit saves as note with note_type = "transcript"
- [ ] Transcript appears in notes feed with "Transcript" badge
- [ ] Cancel closes modal without saving

**Dependencies:** M3-T01, M3-T02

**Files to Create/Modify:**
- `components/notes/TranscriptUploadButton.tsx` - Trigger button
- `components/notes/TranscriptUploadModal.tsx` - Modal with input options
- `lib/actions/notes.ts` - createTranscriptNote action

**Technical Notes:**
- Modal should be accessible (focus trap, escape to close)
- File upload: read file content as text
- Validate character count before submission
- Show character count during input
- Error if exceeds 50,000 characters

---

### M3-T09: Update Last Contacted on Note Save

**Description:**
Automatically update the contact's last_contacted_at timestamp when a new note is saved. This assumes if you're taking notes, you're talking to the person.

**Acceptance Criteria:**
- [ ] When a note is saved, last_contacted_at is updated to current timestamp
- [ ] Applies to both manual notes and transcript uploads
- [ ] Contact card header reflects updated timestamp
- [ ] Cadence status badge updates accordingly
- [ ] Works in conjunction with manual "I just reached out" button

**Dependencies:** M3-T01, M2-T07

**Files to Create/Modify:**
- `lib/actions/notes.ts` - Update createNote to also update contact
- `lib/actions/contacts.ts` - Reuse updateLastContacted or inline

**Technical Notes:**
- Can be done in same transaction as note creation
- Use Supabase transaction or sequential updates
- Ensure UI refreshes to show new timestamp and status

---

### M3-T10: Add Note Type Filtering (Optional Enhancement)

**Description:**
Add ability to filter notes by type (all, manual only, transcripts only) in the notes feed.

**Acceptance Criteria:**
- [ ] Filter options: All, Notes, Transcripts
- [ ] Default: All
- [ ] Filtering is instant (client-side)
- [ ] Count updates to reflect filtered results
- [ ] Filter persists during session

**Dependencies:** M3-T02

**Files to Create/Modify:**
- `components/notes/NotesFilter.tsx` - Filter component
- `components/notes/NotesFeed.tsx` - Add filter logic

**Technical Notes:**
- Simple toggle or dropdown filter
- Client-side filtering since data is already loaded
- This is a nice-to-have enhancement

---

### M3-T11: Implement Notes Section Scroll and Layout

**Description:**
Ensure the notes section has proper scroll behavior and layout for long note lists. Notes should be easy to scan and the input should stay accessible.

**Acceptance Criteria:**
- [ ] Notes feed has max-height with scroll on overflow
- [ ] Note input stays visible (sticky or always at top)
- [ ] Scroll position maintained when adding notes
- [ ] Mobile: full width, comfortable touch targets
- [ ] Desktop: appropriate width within card layout

**Dependencies:** M3-T03

**Files to Create/Modify:**
- `components/notes/NotesSection.tsx` - Layout styling
- `app/globals.css` - Scroll styling if needed

**Technical Notes:**
- Consider max-height of 400-500px for notes feed
- New notes added at top, scroll position stays at top
- Use CSS scroll-behavior: smooth for better UX

---

## Task Order (Suggested Implementation Sequence)

1. **M3-T01** - Notes Input Component
2. **M3-T02** - Notes Feed Component
3. **M3-T03** - Integrate Notes Section into Contact Card
4. **M3-T04** - Note Deletion
5. **M3-T05** - Action Items Section
6. **M3-T06** - Manual Action Item Creation
7. **M3-T07** - Action Item Toggle and Delete
8. **M3-T08** - Transcript Upload Modal
9. **M3-T09** - Update Last Contacted on Note Save
10. **M3-T11** - Notes Section Scroll and Layout
11. **M3-T10** - Note Type Filtering (optional)

**Parallelization Opportunities:**
- T05, T06, T07 (action items) can be done in parallel with T01-T04 (notes)
- T08 (transcript) can start after T02
- T09 can be integrated during T01 development

---

## Quality Checklist

- [ ] Note input is fast and responsive during typing
- [ ] Auto-save works reliably with debounce
- [ ] Notes persist correctly to database
- [ ] Action items toggle and delete work correctly
- [ ] Transcript upload handles large text (up to 50k chars)
- [ ] Last contacted updates automatically on note save
- [ ] Mobile experience is smooth - no tiny touch targets
- [ ] All states handled: loading, empty, error
- [ ] Design system followed for all components
