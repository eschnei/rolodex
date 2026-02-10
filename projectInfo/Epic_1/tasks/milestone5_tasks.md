# Milestone 5: Nudge Engine - Development Tasks

## Milestone Summary

Never forget to follow up. This milestone implements the cadence tracking system and nudge engine. It calculates who's due or overdue for contact, creates a dashboard sorted by urgency, and sends daily email digests via Gmail API to remind users who to reach out to.

**Key Deliverables:**
- Cadence tracking logic (overdue, due today, due soon, on track)
- Dashboard view sorted by urgency
- Daily email digest via Gmail API
- User settings for digest preferences

**Prerequisite:** Milestone 4 completed (AI summarization for context in digests)

---

## Tasks

### M5-T01: Implement Cadence Tracking Logic

**Description:**
Create the core logic for calculating contact cadence status. Compare last_contacted_at + cadence_days against current date to determine status.

**Acceptance Criteria:**
- [ ] Status categories implemented: overdue, due today, due soon (within 3 days), on track
- [ ] Handle contacts with no cadence set (excluded from nudge logic)
- [ ] Handle contacts never contacted (last_contacted_at is null) - treat as overdue immediately
- [ ] Calculate days until due / days overdue
- [ ] Function returns: status, days_until_due, days_overdue
- [ ] Timezone-aware calculations using user's timezone

**Dependencies:** Milestone 4 complete

**Files to Create/Modify:**
- `lib/utils/cadence.ts` - Update/expand cadence utilities
- `lib/types.ts` - CadenceStatus type definition
- `lib/utils/dates.ts` - Date utility functions

**Technical Notes:**
- Status calculation:
  - overdue: now > last_contacted_at + cadence_days
  - due today: now == due date
  - due soon: now + 3 days >= due date
  - on track: otherwise
- Handle null last_contacted_at as "never contacted" = immediately overdue
- Use user's timezone from profile for accurate day boundaries

---

### M5-T02: Build Dashboard Page Structure

**Description:**
Create the main dashboard page that serves as the landing page after login. Shows contacts organized by urgency.

**Acceptance Criteria:**
- [ ] Dashboard accessible at `/dashboard` (default after login)
- [ ] Quick stats at top: total contacts, overdue count, outreach streak
- [ ] Sections: Overdue, Due Today, Due Soon (next 3 days)
- [ ] Empty section handling (don't show if no contacts in that status)
- [ ] All caught up state: "You're all caught up" if nothing due
- [ ] Loading state while fetching data
- [ ] Page uses PageContainer for consistent layout

**Dependencies:** M5-T01

**Files to Create/Modify:**
- `app/(app)/dashboard/page.tsx` - Dashboard page
- `app/(app)/page.tsx` - Redirect to dashboard
- `components/dashboard/DashboardStats.tsx` - Stats display
- `components/dashboard/DashboardSection.tsx` - Section container
- `components/dashboard/EmptyDashboard.tsx` - All caught up state

**Technical Notes:**
- Outreach streak: consecutive days with no overdue contacts (requires tracking)
- Stats cards should be compact, scannable
- Default landing page after login
- Consider caching dashboard data for performance

---

### M5-T03: Create Dashboard Contact Item

**Description:**
Build the list item component for dashboard entries. Shows contact info, days since last contact, and summary snippet.

**Acceptance Criteria:**
- [ ] Contact name and company/role displayed
- [ ] Days since last contact (or "Never contacted")
- [ ] Cadence indicator (e.g., "Monthly")
- [ ] One-line from AI summary (truncated if needed)
- [ ] Status color indicator (red for overdue, amber for due soon)
- [ ] Click navigates to contact card
- [ ] Hover state matches design system

**Dependencies:** M5-T02

**Files to Create/Modify:**
- `components/dashboard/DashboardItem.tsx` - List item component
- `lib/utils/text.ts` - Text truncation utilities

**Technical Notes:**
- Summary snippet: first sentence or ~60 characters
- Use status colors from design system
- Layout: avatar, info, status indicator, days count
- Match design system dash-item pattern

---

### M5-T04: Implement Dashboard Data Fetching

**Description:**
Fetch all contacts for the user and categorize them by cadence status. Sort by urgency within each section.

**Acceptance Criteria:**
- [ ] Fetch all contacts for authenticated user
- [ ] Calculate cadence status for each contact
- [ ] Group contacts by status: overdue, due_today, due_soon
- [ ] Sort overdue by most overdue first (most days past due)
- [ ] Sort due_soon by soonest first
- [ ] Exclude contacts with no cadence set
- [ ] Return counts for stats display
- [ ] Efficient query - single fetch, client-side processing

**Dependencies:** M5-T01, M5-T02

**Files to Create/Modify:**
- `lib/actions/dashboard.ts` - Dashboard data fetching
- `lib/utils/cadence.ts` - Add sorting/grouping functions
- `app/(app)/dashboard/page.tsx` - Integrate data fetching

**Technical Notes:**
- Fetch contacts with: id, first_name, last_name, company, role, last_contacted_at, cadence_days, ai_summary
- Calculate streak: query contacts history or maintain streak counter
- Consider caching for frequently accessed dashboard

---

### M5-T05: Set Up Gmail API OAuth

**Description:**
Configure Gmail API OAuth to allow users to connect their Gmail account for sending digest emails.

**Acceptance Criteria:**
- [ ] Google Cloud project configured with Gmail API
- [ ] OAuth consent screen configured
- [ ] OAuth flow implemented in app
- [ ] Scopes requested: gmail.send (for sending digests from user's account)
- [ ] Token storage in database (encrypted)
- [ ] Token refresh handling
- [ ] Connect/disconnect UI in settings

**Dependencies:** M5-T02

**Files to Create/Modify:**
- `lib/gmail/oauth.ts` - OAuth flow handling
- `lib/gmail/client.ts` - Gmail API client
- `app/api/auth/gmail/callback/route.ts` - OAuth callback handler
- `app/(app)/settings/page.tsx` - Gmail connection UI
- `lib/actions/gmail.ts` - Server actions for Gmail operations

**Technical Notes:**
- Use `googleapis` package for Gmail API
- Store refresh token securely (consider encryption at rest)
- Handle token expiration and refresh automatically
- Scope: https://www.googleapis.com/auth/gmail.send

---

### M5-T06: Create Email Digest Template

**Description:**
Design and implement the email template for daily digest emails. Clean, readable format with actionable links.

**Acceptance Criteria:**
- [ ] Plain, clean email format (no heavy HTML)
- [ ] Subject: "NetCard: [count] contacts to reach"
- [ ] Lists contacts due or overdue today
- [ ] Each contact shows: name, company, days since last contact, one-line summary
- [ ] Each contact has link to open their card in the app
- [ ] Footer with link to dashboard
- [ ] Handles case of no contacts due (either skip or brief "all caught up")
- [ ] Mobile-readable formatting

**Dependencies:** M5-T03

**Files to Create/Modify:**
- `lib/email/templates/digest.ts` - Digest template
- `lib/email/render.ts` - Template rendering utilities

**Technical Notes:**
- Keep formatting simple - readable in any email client
- Use plain text or minimal HTML
- Links should use absolute URLs to production domain
- Consider both text and HTML versions for compatibility

---

### M5-T07: Implement Digest Sending Logic

**Description:**
Build the logic to compose and send digest emails via Gmail API. Email is sent from user's address to user's address (self-email).

**Acceptance Criteria:**
- [ ] Compose email from digest template
- [ ] Send via Gmail API using user's connected account
- [ ] Email sent from user's address to user's address
- [ ] Handle Gmail API errors gracefully
- [ ] Log send success/failure
- [ ] Respect user's digest_time preference
- [ ] Handle timezone conversion for send time

**Dependencies:** M5-T05, M5-T06

**Files to Create/Modify:**
- `lib/gmail/send.ts` - Email sending via Gmail API
- `lib/actions/digest.ts` - Digest composition and sending

**Technical Notes:**
- Gmail API: use messages.send with raw RFC 2822 format
- Base64 encode the message
- Handle rate limits (unlikely for single daily send)
- Log to database for debugging

---

### M5-T08: Set Up Scheduled Digest Job

**Description:**
Create a scheduled job that runs daily to send digest emails to all users based on their preferred send time.

**Acceptance Criteria:**
- [ ] Cron job runs at regular intervals (every hour or more frequent)
- [ ] Checks which users have digest due based on digest_time + timezone
- [ ] Processes users whose digest time has passed in current window
- [ ] Skips users without Gmail connected
- [ ] Skips users with digest disabled
- [ ] Respects "skip when all caught up" preference
- [ ] Handles errors for individual users without failing others

**Dependencies:** M5-T07

**Files to Create/Modify:**
- `app/api/cron/digest/route.ts` - Cron endpoint
- `vercel.json` - Cron configuration
- `lib/cron/digestJob.ts` - Job logic

**Technical Notes:**
- Use Vercel Cron or Supabase Edge Functions
- Run every 15-30 minutes to catch digest times accurately
- Track last_digest_sent_at to prevent duplicates
- Window: process users whose digest_time is in the past 30 min window

---

### M5-T09: Create Nudge Settings UI

**Description:**
Build the settings page section for configuring digest preferences.

**Acceptance Criteria:**
- [ ] Digest enabled toggle (on/off)
- [ ] Digest time picker (default 8:00 AM)
- [ ] Timezone dropdown (auto-detected on first login)
- [ ] "Skip digest when all caught up" toggle
- [ ] Gmail connection status display
- [ ] Connect/Disconnect Gmail buttons
- [ ] Changes save immediately (optimistic UI)
- [ ] Validation and error handling

**Dependencies:** M5-T05

**Files to Create/Modify:**
- `app/(app)/settings/page.tsx` - Settings page
- `components/settings/DigestSettings.tsx` - Digest settings section
- `components/settings/GmailConnection.tsx` - Gmail connection UI
- `lib/actions/user.ts` - Update user preferences

**Technical Notes:**
- Time picker: simple select or proper time input
- Timezone: use Intl.supportedValuesOf('timeZone') for options
- Optimistic updates with rollback on error
- Show connection status clearly

---

### M5-T10: Track Outreach Streak

**Description:**
Implement the outreach streak calculation - consecutive days with no overdue contacts.

**Acceptance Criteria:**
- [ ] Calculate streak: days in a row with zero overdue contacts
- [ ] Display on dashboard stats
- [ ] Streak resets to 0 when any contact becomes overdue
- [ ] Streak increments at end of each day with no overdue
- [ ] Handle edge cases: new users, no contacts, all contacts have no cadence

**Dependencies:** M5-T02

**Files to Create/Modify:**
- `lib/utils/streak.ts` - Streak calculation
- `components/dashboard/DashboardStats.tsx` - Display streak

**Technical Notes:**
- Options: calculate dynamically or store/update streak value
- Dynamic: query history of last_contacted_at updates
- Stored: update streak in cron job daily
- Start simple with dynamic calculation

---

### M5-T11: Add Dashboard Refresh and Real-Time Updates

**Description:**
Ensure dashboard updates when contacts are marked as reached out to, without requiring page reload.

**Acceptance Criteria:**
- [ ] Dashboard reflects changes after "I just reached out" action
- [ ] Contact moves between sections as status changes
- [ ] Stats update (overdue count, streak)
- [ ] Option: manual refresh button
- [ ] Option: auto-refresh on focus

**Dependencies:** M5-T04

**Files to Create/Modify:**
- `app/(app)/dashboard/page.tsx` - Refresh logic
- `lib/hooks/useDashboardData.ts` - Data fetching hook with revalidation

**Technical Notes:**
- Use React Query or SWR for data fetching with revalidation
- Revalidate on window focus
- Optimistic update when contact is marked reached
- Consider WebSocket for real-time (likely overkill for MVP)

---

## Task Order (Suggested Implementation Sequence)

1. **M5-T01** - Implement Cadence Tracking Logic
2. **M5-T02** - Build Dashboard Page Structure
3. **M5-T03** - Create Dashboard Contact Item
4. **M5-T04** - Implement Dashboard Data Fetching
5. **M5-T10** - Track Outreach Streak
6. **M5-T05** - Set Up Gmail API OAuth
7. **M5-T06** - Create Email Digest Template
8. **M5-T07** - Implement Digest Sending Logic
9. **M5-T09** - Create Nudge Settings UI
10. **M5-T08** - Set Up Scheduled Digest Job
11. **M5-T11** - Add Dashboard Refresh and Real-Time Updates

**Parallelization Opportunities:**
- T05 (Gmail OAuth) can start while T02-T04 are being built
- T06 can be done in parallel with T05
- T10 can be done alongside T02-T04

---

## Quality Checklist

- [ ] Cadence calculations are accurate across timezones
- [ ] Dashboard loads quickly (<1 second)
- [ ] Email digests are delivered reliably
- [ ] Gmail OAuth flow works smoothly
- [ ] Settings save correctly and persist
- [ ] Streak calculation is accurate
- [ ] Empty states are friendly, not sad
- [ ] Mobile dashboard is usable
- [ ] Digest emails are readable in all email clients
