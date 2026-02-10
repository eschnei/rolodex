*Never forget to follow up.*

### REQ 5.1: Cadence Tracking Logic

- For each contact: compare last_contacted_at + cadence_days against current date
- Status categories: overdue (past due date), due today (due date is today), due soon (within 3 days), on track (more than 3 days out), no cadence set, never contacted
- Contacts with no cadence set are excluded from nudge logic
- Contacts with no last_contacted_at are treated as overdue immediately

### REQ 5.2: Dashboard

- Default landing page after login
- Sections: Overdue (sorted by most overdue first), Due Today, Due Soon (next 3 days)
- Each entry shows: contact name, company/role, days since last contact, cadence, one-line from AI summary
- Click any entry to open the contact card
- If nothing is due: encouraging empty state ("You're all caught up")
- Quick stats at top: total contacts, overdue count, outreach streak (consecutive days with no overdue contacts)

### REQ 5.3: Daily Email Digest

- Sent via Gmail API using the user's own Gmail account (sends from their address to their address — self-email)
- Scheduled via Supabase Edge Function or Vercel Cron job, runs daily
- Configurable send time per user (stored in users.digest_time, default 8:00 AM in user's timezone)
- Email content: list of contacts due or overdue today, each with name, company, days since last contact, one-line AI summary snippet, and a link to open their card in the app
- If no one is due: either skip sending or send a brief "all caught up" message (user configurable in settings)
- Email is plain and clean — no heavy HTML template, just readable text with links

### REQ 5.4: User Settings for Nudges

- Settings page includes: digest enabled (on/off toggle), digest time (time picker), timezone (dropdown, auto-detected on first login), skip digest when all caught up (toggle)
- Changes save immediately (optimistic UI)