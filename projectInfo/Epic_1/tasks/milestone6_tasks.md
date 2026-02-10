# Milestone 6: Gmail Integration - Development Tasks

## Milestone Summary

Auto-track email touchpoints so you don't have to manually log every interaction. This milestone extends Gmail integration to sync email metadata (not content) and automatically update last_contacted_at based on sent emails. Users get automatic touchpoint tracking without manual effort.

**Key Deliverables:**
- Gmail API read access for email metadata
- Sync last email date/subject per contact
- Auto-update last_contacted_at from sent emails
- Display email context on contact cards

**Prerequisite:** Milestone 5 completed (Gmail OAuth already set up for sending)

---

## Tasks

### M6-T01: Extend Gmail OAuth Scopes

**Description:**
Update the Gmail OAuth configuration to request read-only access to email metadata in addition to send access.

**Acceptance Criteria:**
- [ ] Add gmail.readonly scope to OAuth request
- [ ] Update consent screen if needed
- [ ] Handle scope upgrade for existing connected users
- [ ] Token includes both send and read permissions
- [ ] Privacy notice updated to explain what we access

**Dependencies:** M5-T05 (Gmail OAuth from Milestone 5)

**Files to Create/Modify:**
- `lib/gmail/oauth.ts` - Add gmail.readonly scope
- `app/(app)/settings/page.tsx` - Update privacy notice
- `lib/gmail/scopes.ts` - Scope definitions

**Technical Notes:**
- Scope: https://www.googleapis.com/auth/gmail.readonly
- Users may need to re-authorize if adding new scope
- Be explicit about what we read (only metadata, not body)
- Consider making email sync optional via user preference

---

### M6-T02: Create Email Metadata Schema

**Description:**
Add database fields or table to store email metadata per contact. Track last email date, subject, and direction.

**Acceptance Criteria:**
- [ ] Store per contact: last_email_date, last_email_subject, last_email_direction (sent/received)
- [ ] Option A: Add fields to contacts table
- [ ] Option B: Separate email_sync table with FK to contacts
- [ ] Track sync status: last_synced_at per contact or user
- [ ] Index for efficient queries

**Dependencies:** M6-T01

**Files to Create/Modify:**
- `supabase/migrations/xxx_email_metadata.sql` - Schema changes
- `lib/database.types.ts` - Update types
- `lib/types.ts` - EmailMetadata type

**Technical Notes:**
- Start simple: add fields to contacts table
- last_email_direction: 'sent' | 'received' | null
- Consider: storing multiple recent emails vs just the most recent
- Only need minimal metadata - no email bodies

---

### M6-T03: Implement Email Sync for Single Contact

**Description:**
Create the function to sync email metadata for a single contact. Queries Gmail API for recent emails to/from the contact's email address.

**Acceptance Criteria:**
- [ ] Query Gmail API for emails matching contact's email address
- [ ] Find most recent sent email and most recent received email
- [ ] Extract: date, subject, direction
- [ ] Store metadata in database
- [ ] Handle contacts without email address (skip)
- [ ] Handle Gmail API errors gracefully
- [ ] Respect rate limits

**Dependencies:** M6-T01, M6-T02

**Files to Create/Modify:**
- `lib/gmail/sync.ts` - Email sync logic
- `lib/actions/emailSync.ts` - Server action for sync

**Technical Notes:**
- Gmail API: messages.list with q parameter for email address
- Query: `from:[email] OR to:[email]`
- messages.get for subject and date (headers only, not full body)
- Batch requests if checking multiple emails

---

### M6-T04: Trigger Sync on Contact Card Open

**Description:**
Automatically check for recent emails when a contact card is opened. On-demand sync for immediate feedback.

**Acceptance Criteria:**
- [ ] When contact card opens, trigger email sync if Gmail connected
- [ ] Only sync if contact has email address
- [ ] Sync happens in background (don't block page load)
- [ ] UI updates when sync completes
- [ ] Don't re-sync if synced recently (e.g., within last hour)
- [ ] Handle case where Gmail is not connected

**Dependencies:** M6-T03

**Files to Create/Modify:**
- `app/(app)/contacts/[id]/page.tsx` - Trigger sync on load
- `lib/hooks/useEmailSync.ts` - Sync hook with caching
- `components/contacts/EmailContext.tsx` - Display component

**Technical Notes:**
- Use stale-while-revalidate pattern
- Show cached data immediately, update if new data found
- Skip sync if last_synced_at < 1 hour ago
- Non-blocking: use useEffect or server action

---

### M6-T05: Implement Background Email Sync

**Description:**
Create a periodic background job that syncs emails for all contacts. Runs every 6 hours to keep data fresh.

**Acceptance Criteria:**
- [ ] Cron job runs every 6 hours
- [ ] Processes all users with Gmail connected
- [ ] For each user, syncs all contacts with email addresses
- [ ] Only syncs emails from last 90 days (initial sync window)
- [ ] Handles rate limits and errors gracefully
- [ ] Logs sync results for debugging
- [ ] Skips users whose sync is already recent

**Dependencies:** M6-T03

**Files to Create/Modify:**
- `app/api/cron/email-sync/route.ts` - Cron endpoint
- `vercel.json` - Add cron schedule
- `lib/cron/emailSyncJob.ts` - Job logic

**Technical Notes:**
- Run less frequently than digest (every 6 hours sufficient)
- Batch process users to avoid timeout
- Consider pagination for users with many contacts
- 90-day limit on initial sync prevents excessive API calls

---

### M6-T06: Auto-Update Last Contacted from Email

**Description:**
When a sent email is found that's more recent than the current last_contacted_at, automatically update the timestamp.

**Acceptance Criteria:**
- [ ] If sent email date > current last_contacted_at, update it
- [ ] Received emails do NOT update last_contacted_at (only tracking your outreach)
- [ ] Manual "I just reached out" still works and overrides if more recent
- [ ] Store source of last_contacted_at: 'email' | 'manual' | null
- [ ] UI shows source indicator: "via email" or "manually logged"

**Dependencies:** M6-T03, M6-T02

**Files to Create/Modify:**
- `lib/gmail/sync.ts` - Add auto-update logic
- `lib/actions/contacts.ts` - Update with source tracking
- `lib/database.types.ts` - Add last_contacted_source field

**Technical Notes:**
- Compare dates: if sent_email_date > last_contacted_at, update
- Add column: last_contacted_source enum ('email', 'manual')
- When manual button clicked, set source to 'manual'
- When email sync updates, set source to 'email'

---

### M6-T07: Display Email Context on Contact Card

**Description:**
Show the last email information on the contact card. Provides quick context about recent email communication.

**Acceptance Criteria:**
- [ ] Display: "Last emailed: [date] - [subject line]"
- [ ] Positioned in structured info section or header
- [ ] Subject line truncated if too long
- [ ] Relative date format with hover for exact date
- [ ] If no emails found: show nothing (don't say "No emails")
- [ ] Loading state while syncing
- [ ] Refresh when sync completes

**Dependencies:** M6-T04

**Files to Create/Modify:**
- `components/contacts/EmailContext.tsx` - Email display component
- `components/contacts/ContactHeader.tsx` - Integrate display
- `components/contacts/ContactInfo.tsx` - Alternative placement

**Technical Notes:**
- Keep it subtle - one line of information
- Subject truncation: ~40 characters with ellipsis
- Only show if data exists - no empty states
- Consider icon to distinguish from last_contacted

---

### M6-T08: Handle Conflict Resolution

**Description:**
Implement logic to determine which touchpoint source to display and use when manual and email sources conflict.

**Acceptance Criteria:**
- [ ] If manual last_contacted_at is more recent than email sync, manual wins
- [ ] If email sync finds more recent sent email, email date wins
- [ ] Display shows the most recent touchpoint regardless of source
- [ ] Tooltip or subtle label indicates source: "via email" or "manually logged"
- [ ] Cadence calculation uses the most recent timestamp

**Dependencies:** M6-T06

**Files to Create/Modify:**
- `lib/utils/touchpoint.ts` - Conflict resolution logic
- `components/contacts/LastContacted.tsx` - Updated display with source
- `lib/utils/cadence.ts` - Use resolved timestamp

**Technical Notes:**
- Simple date comparison: use whichever is more recent
- Store both values and calculate on display if needed
- Or: single last_contacted_at with source indicator
- Clear visual indication of source without being noisy

---

### M6-T09: Add Email Sync Settings

**Description:**
Allow users to enable/disable email sync and view sync status in settings.

**Acceptance Criteria:**
- [ ] Toggle to enable/disable email sync (separate from Gmail connection)
- [ ] When disabled, don't sync emails but can still send digests
- [ ] Show last sync timestamp
- [ ] Manual "Sync now" button
- [ ] Clear indication of what email access means (metadata only)
- [ ] Changes save immediately

**Dependencies:** M6-T05

**Files to Create/Modify:**
- `app/(app)/settings/page.tsx` - Email sync settings
- `components/settings/EmailSyncSettings.tsx` - Settings component
- `lib/actions/user.ts` - Preference updates

**Technical Notes:**
- User preference: email_sync_enabled (default true if Gmail connected)
- Privacy assurance: "We only access email dates and subjects, never content"
- Show helpful status: "Last synced 2 hours ago"

---

### M6-T10: Handle Gmail Disconnect Gracefully

**Description:**
Ensure the app handles Gmail disconnection gracefully, with existing email data preserved.

**Acceptance Criteria:**
- [ ] Disconnect button removes Gmail tokens
- [ ] Existing email metadata is preserved (not deleted)
- [ ] Email sync stops but digests also stop if Gmail disconnected
- [ ] UI updates to show disconnected state
- [ ] Re-connection flow works smoothly
- [ ] Clear messaging about what disconnecting means

**Dependencies:** M6-T01

**Files to Create/Modify:**
- `lib/gmail/disconnect.ts` - Disconnect logic
- `lib/actions/gmail.ts` - Disconnect action
- `components/settings/GmailConnection.tsx` - Disconnect UI

**Technical Notes:**
- Delete tokens but keep synced metadata
- Confirmation before disconnect: "Disconnect Gmail? Digest emails and email sync will stop."
- After disconnect, digest settings should be disabled/hidden

---

## Task Order (Suggested Implementation Sequence)

1. **M6-T01** - Extend Gmail OAuth Scopes
2. **M6-T02** - Create Email Metadata Schema
3. **M6-T03** - Implement Email Sync for Single Contact
4. **M6-T04** - Trigger Sync on Contact Card Open
5. **M6-T06** - Auto-Update Last Contacted from Email
6. **M6-T07** - Display Email Context on Contact Card
7. **M6-T08** - Handle Conflict Resolution
8. **M6-T05** - Implement Background Email Sync
9. **M6-T09** - Add Email Sync Settings
10. **M6-T10** - Handle Gmail Disconnect Gracefully

**Parallelization Opportunities:**
- T07 can be developed alongside T06
- T09 and T10 can be done in parallel
- T08 can be integrated during T06/T07 development

---

## Quality Checklist

- [ ] OAuth scopes are minimal (only what's needed)
- [ ] Email sync works reliably without blocking UI
- [ ] Privacy is maintained - no email body access
- [ ] Conflict resolution logic is correct
- [ ] Source indicators are subtle but clear
- [ ] Background sync respects rate limits
- [ ] Disconnect flow is clean and clear
- [ ] Settings are intuitive
- [ ] Mobile experience is smooth
