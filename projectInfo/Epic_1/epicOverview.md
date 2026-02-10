## Epic Overview

Build an open-source, web-based personal networking CRM with smart contact cards, AI-powered note summarization, and an automated email nudge system.

---

Milestone 1: Foundation

*Get the app running with auth and a basic data model.*

- Project scaffolding (Next.js, Supabase, Vercel deployment)
- Supabase auth setup
- Database schema: contacts, notes, action items, user settings
- Basic app layout and navigation shell
- Responsive design foundation (works on desktop and mobile browsers)

Milestone 2: Contact Cards

*The core unit of the product — create, view, edit contacts.*

- Contact creation form with structured fields (name, role, company, location, how we met, communication preference, personal intel)
- Contact list view with search and simple filtering
- Individual contact card detail view
- Edit and delete contacts
- Cadence setting per contact (weekly, biweekly, monthly, quarterly, custom)

Milestone 3: Notes & Action Items

*Make the card useful during a live call.*

- Notes input on the contact card (fast, minimal, auto-saving text area)
- Chronological notes feed on each card (timestamped entries)
- Action items with checkboxes (tied to a contact, created from notes or manually)
- Transcript upload — paste or file upload as a supplemental note entry
- "Last contacted" timestamp (manual toggle: "I just talked to this person")

Milestone 4: AI Summarization

*Let AI do the organizing so you don't have to.*

- On note save: AI parses raw notes to extract key details, personal info, business updates, and action items
- Living summary at the top of each contact card — regenerated on every new note
- Extracted action items auto-populate the action items section
- Transcript processing — same extraction pipeline applied to uploaded transcripts
- Summary is scannable in under 10 seconds (concise, structured output)

Milestone 5: Nudge Engine

*Never forget to follow up.*

- Cadence tracking logic — calculate who's due or overdue based on last contacted date and cadence setting
- Dashboard view: sorted by urgency (overdue → due today → upcoming)
- Daily email digest via Gmail API — list of who to reach out to today with summary context for each person
- Configurable digest time (morning default)
- One-click from digest to open the contact card in the app

Milestone 6: Gmail Integration

*Auto-track email touchpoints so you don't have to.*

- Gmail API OAuth connection
- Sync last sent/received email per contact (matched by email address)
- Auto-update "last contacted" timestamp from email activity
- Surface last email subject/date on the contact card for quick context

Milestone 7: Polish & Open Source

*Make it ready for others to use and contribute to.*

- UI/UX polish pass — clean, fast, consistent responsive experience
- Onboarding flow (import contacts from CSV or manual entry)
- README, setup docs, environment variable guide
- Open source repo setup (license, contributing guide, issues template)
- Demo deployment for people to try it