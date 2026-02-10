*Auto-track email touchpoints so you don't have to.*

### REQ 6.1: Gmail OAuth Connection

- Separate OAuth consent for Gmail API scopes (read-only access to sent/received messages)
- Connection status shown in Settings: connected / not connected
- Connect and disconnect buttons
- Handles token refresh automatically
- Scopes requested: gmail.readonly (minimum needed to check sent/received)

### REQ 6.2: Email Sync

- On-demand sync: triggered when a contact card is opened (checks for recent emails to/from that contact's email address)
- Background sync: periodic job (every 6 hours via cron) checks all contacts with email addresses
- Stores: last email date, last email subject, direction (sent/received) per contact
- Does not store email bodies — privacy-first, only metadata
- Only syncs emails from the last 90 days on initial connection

### REQ 6.3: Auto-Update Last Contacted

- If a sent email to a contact is more recent than their current last_contacted_at, update it automatically
- Received emails do not update last_contacted_at (the point is tracking your outreach, not theirs)
- Contact card shows: "Last emailed: [date] — [subject line]" in a subtle metadata line
- Manual "I just reached out" button still works and overrides if more recent (covers texts, calls, in-person)

### REQ 6.4: Conflict Resolution

- If manual last_contacted_at is more recent than email sync data, manual wins
- If email sync finds a more recent sent email, email date wins
- Display shows the most recent touchpoint regardless of source
- Tooltip or subtle label indicates source: "via email" or "manually logged"