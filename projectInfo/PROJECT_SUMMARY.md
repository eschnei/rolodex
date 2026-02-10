# NetCard - Project Summary

## Overview

NetCard is an open-source, web-based personal networking CRM designed for solo operators, founders, and networkers managing approximately 50 key relationships. It serves as a live cheat sheet during calls and an accountability partner between them.

---

## Problem Statement

Maintaining meaningful relationships with key people in your network is difficult:
- Spreadsheets go stale
- Follow-ups get forgotten
- Context from past conversations gets lost
- No simple tool keeps you prepared for calls and accountable to outreach cadence

---

## Core Features

### 1. The Contact Card
A living dossier for each relationship containing:
- Structured fields (role, company, location, how you met, personal intel)
- Chronological notes feed
- AI-generated summary (10-second briefing before any call)
- Action items with checkboxes

### 2. Live Note-Taking
- Designed for use during calls, not after
- Fast, minimal text input with optional voice-to-text
- AI parsing on save extracts details, action items, and updates summary
- Optional transcript upload as supplemental context

### 3. Nudge Engine
- Per-contact cadence settings (weekly, biweekly, monthly, quarterly)
- Tracks last touchpoint
- Daily email digest of who's due or overdue
- Delivered via Gmail API

---

## Target User

Solo operators, founders, and networkers managing ~50 key relationships across email and text. Web-first with mobile-responsive design for on-the-go use.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Supabase |
| AI | Anthropic Claude API |
| Email | Gmail API |
| Deployment | Vercel |
| Icons | Lucide Icons |

---

## Design System

### Typography
- **Font Family**: JetBrains Mono (monospace throughout)
- **Headings**: Tight letter-spacing, weights 600-700
- **Body**: 14px, relaxed line-height (1.65)

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | #FAFAFA | Page background |
| `--bg-secondary` | #FFFFFF | Cards, surfaces |
| `--bg-inset` | #F2F2F3 | Recessed areas |
| `--accent` | #5B5BD6 | Primary actions (Indigo) |
| `--accent-subtle` | #EDEDFC | Hover states |
| `--text-primary` | #1A1A1C | Main text |
| `--text-secondary` | #6B6B6F | Secondary text |
| `--status-overdue` | #E5484D | Red - past due |
| `--status-due` | #F09E00 | Amber - due soon |
| `--status-ontrack` | #30A46C | Green - on track |

### Design Principles
1. **Speed over chrome** - Every interaction feels instant
2. **Reduce to essentials** - No decorative flourishes
3. **Information density done right** - Scannable, never overwhelming
4. **AI stays in background** - No "AI Generated" badges

---

## Database Schema

### Tables

**users**
- id, email, name, avatar_url
- digest_time (default 8am), timezone
- created_at, updated_at

**contacts**
- id, user_id, first_name, last_name
- email, phone, company, role, location
- how_we_met, communication_preference, personal_intel
- cadence_days (integer), last_contacted_at
- ai_summary (text)
- created_at, updated_at

**notes**
- id, contact_id, user_id
- content (text), note_type (manual/transcript)
- created_at

**action_items**
- id, contact_id, user_id
- description, is_completed
- source_note_id (nullable FK)
- created_at, completed_at

All tables protected by row-level security policies.

---

## Epic 1: Core Product Build

### Milestone 1: Foundation
*Get the app running with auth and a basic data model*

- Project scaffolding (Next.js, Supabase, Vercel)
- Supabase email authentication
- Database schema with RLS
- App layout with sidebar navigation
- Responsive design foundation

### Milestone 2: Contact Cards
*The core unit of the product*

- Contact creation form with structured fields
- Contact list with search and filtering
- Individual contact card detail view
- Edit and delete functionality
- Cadence settings per contact

### Milestone 3: Notes & Action Items
*Make the card useful during a live call*

- Live note input with auto-save (debounced)
- Chronological notes feed
- Action items with checkboxes
- Transcript upload (paste or file)
- "I just reached out" button

### Milestone 4: AI Summarization
*Let AI do the organizing*

- Note processing pipeline via Claude API
- Living summary regenerated on each note
- Auto-extracted action items (user confirms before saving)
- Transcript intelligence with chunking

### Milestone 5: Nudge Engine
*Never forget to follow up*

- Cadence tracking logic (overdue/due/on-track)
- Dashboard sorted by urgency
- Daily email digest via Gmail API
- Configurable digest time per user

### Milestone 6: Gmail Integration
*Auto-track email touchpoints*

- Gmail OAuth connection
- Email sync (on-demand + periodic)
- Auto-update last_contacted from sent emails
- Conflict resolution (manual vs email source)

### Milestone 7: Polish & Open Source
*Make it ready for others*

- UI/UX polish pass
- CSV import onboarding
- Data export (CSV/JSON)
- Open source repo setup (MIT license)
- README, setup docs, contributing guide

---

## Cadence Status Logic

| Status | Condition |
|--------|-----------|
| Overdue | Past `last_contacted_at + cadence_days` |
| Due Soon | Within 3 days of due date |
| On Track | More than 3 days out |
| Never Contacted | No `last_contacted_at` (treated as overdue) |
| No Cadence | Excluded from nudge logic |

---

## Success Criteria

- Never walk into a call without context
- Never forget to follow up with someone important
- Adding notes takes less effort than a text message
- The system gets smarter with every interaction, not more work

---

## What This Is NOT

- Not a sales CRM
- Not a team tool
- Not a full-featured contact database

It's a personal relationship tool that prioritizes **simplicity and context over features**. If it takes more than a few seconds to do anything, it's too complex.

---

## Key UI Components

### Buttons
- Primary (indigo), Secondary (outlined), Ghost, Danger
- Icon buttons for actions (32x32px)

### Inputs
- Text inputs, Textareas, Selects
- Focus state: indigo border with subtle shadow

### Badges
- Status badges: Overdue, Due Soon, On Track
- Accent badge for Transcripts

### Cards
- White background, subtle border
- Header, body, footer sections
- Contact card with avatar, summary, fields, action items, notes

---

## Motion Guidelines

- **Micro-interactions**: 120ms ease (hover, focus)
- **Layout changes**: 200ms ease (expanding sections, modals)
- No bouncing or elastic easing
- Skeleton loading states over spinners

---

## Responsive Breakpoints

| Breakpoint | Width |
|------------|-------|
| Desktop | 1024px+ |
| Tablet | 768px - 1023px |
| Mobile | < 768px |

Sidebar collapses to bottom navigation on mobile.

---

## File Structure Reference

```
projectInfo/
├── projectOverview.md      # Product brief
├── style_guid.html         # Visual style guide (HTML)
└── Epic_1/
    ├── epicOverview.md     # Epic summary
    ├── milestone1.md       # Foundation
    ├── milestone2.md       # Contact Cards
    ├── milestone3.md       # Notes & Action Items
    ├── milestone4.md       # AI Summarization
    ├── milestone5.md       # Nudge Engine
    ├── milestone6.md       # Gmail Integration
    └── milestone7.md       # Polish & Open Source
```
