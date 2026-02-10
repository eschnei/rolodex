# Milestone 2: Contact Cards - Development Tasks

## Milestone Summary

Build the core unit of NetCard - the contact card system. This milestone delivers the ability to create, view, edit, and delete contacts. Each contact has structured fields (name, role, company, location, how we met, communication preference, personal intel) and a cadence setting for follow-up reminders.

**Key Deliverables:**
- Contact creation form with validation
- Contact list view with search and filtering
- Contact detail card view
- Edit and delete functionality
- Cadence status indicators (on track, due soon, overdue)

**Prerequisite:** Milestone 1 completed (foundation, auth, database schema)

---

## Tasks

### M2-T01: Create Contact List Page Structure

**Description:**
Build the main contacts list page with header, search input, and add contact button. Set up the page structure that will display contact cards.

**Acceptance Criteria:**
- [ ] Contacts page accessible at `/contacts`
- [ ] Page header with "Contacts" title
- [ ] Search input at top of page with placeholder "Search contacts..."
- [ ] "Add Contact" button in header (links to creation flow)
- [ ] Empty state displayed when no contacts exist
- [ ] Page uses PageContainer for consistent layout
- [ ] Loading state while fetching contacts

**Dependencies:** Milestone 1 complete

**Files to Create/Modify:**
- `app/(app)/contacts/page.tsx` - Contacts list page
- `app/(app)/contacts/loading.tsx` - Loading state
- `components/contacts/ContactsHeader.tsx` - Header with search and add button
- `components/contacts/EmptyContactsState.tsx` - Empty state component

**Technical Notes:**
- Use server component for initial data fetch
- Search will be client-side filtering (for ~50 contacts)
- Empty state message: "No contacts yet. Add your first one to get started."
- Add Contact button uses primary button style with Plus icon

---

### M2-T02: Implement Contact List Item Component

**Description:**
Create the contact list item component that displays in the contacts list. Shows name, company/role, cadence status indicator, and last contacted date.

**Acceptance Criteria:**
- [ ] Contact avatar with initials (first letters of first and last name)
- [ ] Name displayed prominently
- [ ] Company and role shown as secondary info
- [ ] Cadence status badge (On Track, Due Soon, Overdue, Never Contacted)
- [ ] Last contacted date in relative format ("3 days ago")
- [ ] Clickable - navigates to contact detail page
- [ ] Hover state matches design system

**Dependencies:** M2-T01

**Files to Create/Modify:**
- `components/contacts/ContactListItem.tsx` - List item component
- `components/ui/Avatar.tsx` - Avatar component with initials
- `components/ui/StatusBadge.tsx` - Cadence status badge
- `lib/utils/cadence.ts` - Cadence calculation utilities

**Technical Notes:**
- Avatar: 36px, rounded-full, bg-accent-subtle, text-accent-text
- Status calculation: overdue (past cadence_days), due soon (within 3 days), on track (otherwise)
- Use date-fns or similar for relative date formatting
- Badge colors from design system: status-overdue, status-due, status-ontrack

---

### M2-T03: Build Contact List with Data Fetching

**Description:**
Fetch contacts from Supabase and display them in the contact list. Implement alphabetical sorting by default.

**Acceptance Criteria:**
- [ ] Contacts fetched from Supabase for authenticated user
- [ ] Contacts sorted alphabetically by last name, then first name
- [ ] List displays all contacts using ContactListItem
- [ ] Loading state shown while fetching
- [ ] Error state if fetch fails
- [ ] Real-time updates when contacts change (optional, nice-to-have)

**Dependencies:** M2-T01, M2-T02

**Files to Create/Modify:**
- `app/(app)/contacts/page.tsx` - Add data fetching
- `lib/actions/contacts.ts` - Server actions for contact operations
- `components/contacts/ContactList.tsx` - List wrapper component

**Technical Notes:**
- Use server component data fetching or React Query
- Order by: `last_name.asc, first_name.asc`
- RLS ensures only user's contacts are returned
- Consider pagination for future (not needed for ~50 contacts)

---

### M2-T04: Implement Client-Side Search Filtering

**Description:**
Add client-side search functionality to filter contacts by name, company, or role as the user types.

**Acceptance Criteria:**
- [ ] Search input filters contacts as user types
- [ ] Filters by first name, last name, company, or role
- [ ] Case-insensitive search
- [ ] Debounced input (300ms) to prevent excessive re-renders
- [ ] Shows "No contacts match '[query]'" when no results
- [ ] Clear button (X) to reset search
- [ ] Search state preserved during navigation (optional)

**Dependencies:** M2-T03

**Files to Create/Modify:**
- `components/contacts/ContactsHeader.tsx` - Add search state
- `components/contacts/ContactList.tsx` - Filter logic
- `components/ui/SearchInput.tsx` - Reusable search input with clear button
- `lib/hooks/useDebounce.ts` - Debounce hook

**Technical Notes:**
- Use client component for search state
- Filter in memory since contact list is small
- Search matches if any of: first_name, last_name, company, role contains query
- Use `toLowerCase()` for case-insensitive matching

---

### M2-T05: Create Contact Creation Form

**Description:**
Build the contact creation form with all required fields. Form should validate input and create the contact in Supabase.

**Acceptance Criteria:**
- [ ] Form fields: first name (required), last name, email, phone, company, role, location, how we met, communication preference (dropdown), personal intel (textarea), cadence (dropdown)
- [ ] First name validation: required, cannot be empty
- [ ] Email validation: valid format if provided
- [ ] Communication preference options: Email, Text, Phone, In-Person
- [ ] Cadence options: Weekly (7), Biweekly (14), Monthly (30), Quarterly (90), Custom (number input)
- [ ] Submit creates contact in database
- [ ] Loading state during submission
- [ ] Success feedback and redirect to new contact card
- [ ] Error handling with user-friendly messages

**Dependencies:** M2-T01

**Files to Create/Modify:**
- `app/(app)/contacts/new/page.tsx` - New contact page
- `components/contacts/ContactForm.tsx` - Reusable contact form
- `lib/actions/contacts.ts` - createContact server action
- `lib/validations/contact.ts` - Zod schema for validation

**Technical Notes:**
- Use React Hook Form with Zod validation
- Communication preference stored as enum string
- Cadence stored as integer (days)
- last_contacted_at should be null initially
- On success, redirect to `/contacts/[id]`

---

### M2-T06: Build Contact Detail Page Structure

**Description:**
Create the contact detail page that displays all contact information. This is the "card" view that will be used during calls.

**Acceptance Criteria:**
- [ ] Contact detail page at `/contacts/[id]`
- [ ] Header: name, company, role, location, cadence status badge
- [ ] Structured info section: email (clickable), phone (clickable), how we met, communication preference, personal intel
- [ ] Placeholder for AI summary section ("No summary yet" until Milestone 4)
- [ ] Placeholder for action items section (until Milestone 3)
- [ ] Placeholder for notes feed section (until Milestone 3)
- [ ] "I just reached out" button in header
- [ ] Edit button in header
- [ ] Delete button (with confirmation)
- [ ] Back navigation to contacts list

**Dependencies:** M2-T05

**Files to Create/Modify:**
- `app/(app)/contacts/[id]/page.tsx` - Contact detail page
- `components/contacts/ContactHeader.tsx` - Contact card header
- `components/contacts/ContactInfo.tsx` - Structured info display
- `components/contacts/SummaryPlaceholder.tsx` - Placeholder for AI summary
- `components/contacts/ActionItemsPlaceholder.tsx` - Placeholder for action items
- `components/contacts/NotesPlaceholder.tsx` - Placeholder for notes

**Technical Notes:**
- Fetch contact by ID with server component
- Handle 404 if contact not found
- Email and phone should be `<a>` tags with mailto: and tel: protocols
- Use card structure from design system for info sections

---

### M2-T07: Implement "I Just Reached Out" Button

**Description:**
Add functionality to update the last_contacted_at timestamp with a single click. This is a quick action for marking that you've contacted someone.

**Acceptance Criteria:**
- [ ] Button visible in contact card header
- [ ] Single click updates last_contacted_at to current timestamp
- [ ] Optimistic UI update (button shows success immediately)
- [ ] Status badge updates to reflect new status
- [ ] Last contacted display updates
- [ ] Success toast/feedback (brief)
- [ ] Error handling if update fails

**Dependencies:** M2-T06

**Files to Create/Modify:**
- `components/contacts/ReachedOutButton.tsx` - The button component
- `lib/actions/contacts.ts` - updateLastContacted action
- `components/ui/Toast.tsx` - Toast notification component (or use existing)

**Technical Notes:**
- Use server action with optimistic update
- Button text: "I just reached out" or simple icon with tooltip
- After update, recalculate cadence status
- Use React's useOptimistic for immediate feedback

---

### M2-T08: Build Contact Edit Form

**Description:**
Create the edit form for updating contact information. Pre-populates with existing values and allows saving changes.

**Acceptance Criteria:**
- [ ] Edit page at `/contacts/[id]/edit` or modal overlay
- [ ] Form pre-populated with current contact values
- [ ] Same validation as creation form
- [ ] Save updates the contact and returns to card view
- [ ] Cancel returns to card view without saving
- [ ] Loading state during save
- [ ] Error handling for failed updates

**Dependencies:** M2-T05, M2-T06

**Files to Create/Modify:**
- `app/(app)/contacts/[id]/edit/page.tsx` - Edit contact page
- `components/contacts/ContactForm.tsx` - Reuse with edit mode
- `lib/actions/contacts.ts` - updateContact action

**Technical Notes:**
- Reuse ContactForm component with isEdit prop
- Fetch current contact data for pre-population
- On success, redirect to `/contacts/[id]`
- Handle case where contact doesn't exist (404)

---

### M2-T09: Implement Contact Deletion with Confirmation

**Description:**
Add delete functionality with a confirmation modal. Deletion cascades to remove associated notes and action items.

**Acceptance Criteria:**
- [ ] Delete button visible on contact card
- [ ] Confirmation modal appears on click
- [ ] Modal message: "Delete this contact? Notes and history will be removed."
- [ ] Confirm button proceeds with deletion
- [ ] Cancel button closes modal
- [ ] Deletion removes contact and cascades to notes/action_items
- [ ] After deletion, redirect to contacts list
- [ ] Success feedback
- [ ] Error handling if deletion fails

**Dependencies:** M2-T06

**Files to Create/Modify:**
- `components/contacts/DeleteContactButton.tsx` - Delete button with modal trigger
- `components/ui/ConfirmModal.tsx` - Reusable confirmation modal
- `lib/actions/contacts.ts` - deleteContact action

**Technical Notes:**
- Use dialog/modal component for confirmation
- Cascade delete should be handled by database FK constraints
- Delete button uses ghost or danger variant
- Confirmation modal should trap focus

---

### M2-T10: Add Last Contacted Display

**Description:**
Display the last contacted date on the contact card and in the contacts list. Show relative time with exact date on hover.

**Acceptance Criteria:**
- [ ] Last contacted shown on contact card header
- [ ] Last contacted shown on contact list item
- [ ] Display as relative time ("3 days ago", "2 weeks ago")
- [ ] Hover/tooltip shows exact date and time
- [ ] "Never contacted" shown if last_contacted_at is null
- [ ] Updates when "I just reached out" is clicked

**Dependencies:** M2-T06, M2-T07

**Files to Create/Modify:**
- `components/ui/RelativeTime.tsx` - Relative time display with tooltip
- `components/contacts/ContactHeader.tsx` - Add last contacted display
- `components/contacts/ContactListItem.tsx` - Add last contacted display

**Technical Notes:**
- Use date-fns `formatDistanceToNow` for relative time
- Use date-fns `format` for exact date in tooltip
- Tooltip format: "Jan 15, 2024 at 2:30 PM"
- Handle null case gracefully

---

### M2-T11: Create Contact Validation and Error Handling

**Description:**
Implement comprehensive validation for contact forms and consistent error handling across all contact operations.

**Acceptance Criteria:**
- [ ] Zod schema for contact validation
- [ ] Client-side validation with real-time feedback
- [ ] Server-side validation in actions
- [ ] Consistent error message format
- [ ] Field-level error display in forms
- [ ] Form-level error display for submission failures
- [ ] Network error handling

**Dependencies:** M2-T05

**Files to Create/Modify:**
- `lib/validations/contact.ts` - Zod schemas
- `components/ui/FormField.tsx` - Form field with error display
- `components/ui/FormError.tsx` - Form-level error display

**Technical Notes:**
- Email validation: optional but valid format if provided
- Phone validation: optional, basic format check
- Required fields: first_name only
- Error messages should be user-friendly, not technical

---

## Task Order (Suggested Implementation Sequence)

1. **M2-T01** - Contact List Page Structure
2. **M2-T02** - Contact List Item Component
3. **M2-T03** - Contact List with Data Fetching
4. **M2-T04** - Client-Side Search Filtering
5. **M2-T05** - Contact Creation Form
6. **M2-T11** - Validation and Error Handling (supports T05)
7. **M2-T06** - Contact Detail Page Structure
8. **M2-T07** - "I Just Reached Out" Button
9. **M2-T10** - Last Contacted Display
10. **M2-T08** - Contact Edit Form
11. **M2-T09** - Contact Deletion with Confirmation

**Parallelization Opportunities:**
- T02 can be built in parallel with T01
- T11 can be done alongside T05
- T07 and T10 can be done in parallel after T06

---

## Quality Checklist

- [ ] All forms validate correctly (client and server)
- [ ] Contact CRUD operations work end-to-end
- [ ] Cadence status calculates correctly for all scenarios
- [ ] Search filters work across name, company, role
- [ ] Mobile responsive - all views work on small screens
- [ ] Loading and error states for all async operations
- [ ] Delete confirmation prevents accidental deletion
- [ ] Design system followed - colors, typography, spacing consistent
