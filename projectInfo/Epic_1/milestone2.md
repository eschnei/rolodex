*The core unit of the product — create, view, edit contacts.*

### REQ 2.1: Contact Creation

- "Add Contact" button accessible from contacts list and dashboard
- Form fields: first name (required), last name, email, phone, company, role, location, how we met, communication preference (dropdown), personal intel (textarea), cadence (dropdown: weekly/biweekly/monthly/quarterly/custom integer)
- Validation: first name required, email format validated if provided
- On save: creates contact record, sets last_contacted_at to null (never contacted)
- Success feedback and redirect to the new contact card

### REQ 2.2: Contacts List

- Default view: all contacts sorted alphabetically
- Search bar: filters by name, company, or role (client-side for 50 contacts)
- Each list item shows: name, company/role, cadence status indicator (on track / due soon / overdue), last contacted date
- Cadence status logic: overdue = past cadence_days since last_contacted_at, due soon = within 3 days of cadence, on track = otherwise, never contacted = no last_contacted_at
- Click any contact to open their detail card
- Empty state with prompt to add first contact

### REQ 2.3: Contact Card Detail View

- Header: name, company, role, location, cadence status badge
- Structured info section: email, phone, how we met, communication preference, personal intel
- AI summary section (placeholder for Milestone 4 — shows "No summary yet" until then)
- Action items section (placeholder for Milestone 3)
- Notes feed section (placeholder for Milestone 3)
- "I just reached out" button — updates last_contacted_at to now with single click
- Edit button → opens edit form with all fields pre-populated
- Delete button with confirmation modal

### REQ 2.4: Contact Edit & Delete

- Edit form: same fields as creation, pre-populated with current values
- Save updates the record and returns to the card view
- Delete: confirmation modal ("Are you sure? This will delete all notes and action items for this contact.")
- Delete cascades to associated notes and action items