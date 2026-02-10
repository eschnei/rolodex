# NetCard Brand Guidelines

A practical guide to maintaining brand consistency as NetCard is built and evolved.

---

## 1. Brand Essence

### Core Purpose
NetCard exists to make maintaining meaningful relationships effortless. We believe that strong networks are built on genuine connection, not administrative overhead. Our purpose is to remove the friction between intending to stay in touch and actually doing it.

### Vision
A world where staying connected with the people who matter never feels like work.

### Mission
Help individuals maintain ~50 key relationships with minimal effort by providing instant context before calls and gentle accountability between them.

### Brand Personality

**Precise** — Every element serves a purpose. No decoration, no clutter, no wasted space. Like a well-organized toolkit where everything is exactly where you need it.

**Quiet** — The product stays in the background until needed. Intelligence is built in, not announced. We never demand attention or interrupt flow.

**Warm** — Despite technical precision, NetCard feels approachable and human. We're helping people maintain real relationships, not manage contacts in a database.

**Fast** — Interactions feel instant. The UI never slows you down. If something can happen without waiting, it does.

### Brand Promise
You'll never walk into a call unprepared or forget to follow up with someone important.

---

## 2. Voice and Tone

### Voice Characteristics

**Concise** — Say it in fewer words. Every label, every message, every piece of copy should earn its place. If removing a word doesn't change the meaning, remove it.

**Direct** — Get to the point. No preamble, no hedging, no filler. Tell users what they need to know and what to do next.

**Helpful** — Guide without patronizing. Assume users are smart but busy. Provide enough context to act without explaining everything.

**Human** — Write like a capable assistant, not a robot. Avoid corporate speak, marketing fluff, and overly formal language.

### Tone Variations by Context

| Context | Tone | Example |
|---------|------|---------|
| **Onboarding** | Welcoming, encouraging | "Add your first contact to get started." |
| **Empty states** | Inviting, not sad | "No notes yet. This is where conversation details will live." |
| **Success** | Brief, confirming | "Note saved." or "Contact added." |
| **Errors** | Clear, actionable | "Couldn't save. Check your connection and try again." |
| **Nudges/reminders** | Gentle, informative | "Buck Thompson — 31 days since last contact." |
| **Destructive actions** | Calm, clear stakes | "Delete this contact? Notes and history will be removed." |

### Writing Principles

1. **Front-load important information** — Put the key detail first, context second
2. **Use active voice** — "Save note" not "Note will be saved"
3. **Prefer verbs over nouns** — "Search contacts" not "Contact search"
4. **Avoid jargon** — "last contacted" not "last touchpoint recorded"
5. **Skip the please** — "Enter a name" not "Please enter a name"

---

## 3. Visual Identity Summary

### The Feel
Clean cards floating on warmth. Raycast's precision meets sunset skies. Technical and human at once.

NetCard's visual identity balances two forces:

**Precision** — The monospace typography, tight spacing, and structured layouts create a sense of technical competence. This is a tool that takes your network seriously.

**Warmth** — The warm gradient backgrounds, soft shadows, and gentle status colors prevent the precision from feeling cold. These are human relationships, not database records.

### Key Visual Attributes

- **Light mode only** — Neutral foundation with intentional simplicity
- **Single accent color** — Indigo (#5B5BD6) used sparingly for actions and emphasis
- **Monospace typography** — JetBrains Mono throughout for a technical, precise feel
- **Status colors reserved for cadence** — Red, amber, green only indicate relationship health
- **Borders over shadows** — Most surfaces defined by borders; shadows reserved for elevation
- **Dense but not cluttered** — High information density achieved through structure

---

## 4. Design Principles (Expanded)

### 1. Speed Over Chrome

**What it means:** Every interaction should feel instant. The UI should never make users wait for local actions.

**In practice:**
- Use optimistic updates — show the result before the server confirms
- No loading spinners for actions that can be immediate
- Skeleton states instead of spinners when loading is unavoidable
- Transitions are 120ms for micro-interactions, 200ms for layout changes
- If data exists locally, show it immediately

**Examples:**
- Saving a note: Show "Note saved" immediately, sync in background
- Adding a contact: Card appears instantly, server confirmation happens silently
- Searching: Results filter as you type, no search button needed

### 2. Reduce to Essentials

**What it means:** If a UI element doesn't directly serve the task, remove it. Every pixel earns its place.

**In practice:**
- No decorative elements, icons-for-icons-sake, or visual flourishes
- Labels only when context isn't obvious
- White space is a feature, not empty space to fill
- One primary action per screen, secondary actions visually deprioritized
- Remove redundant confirmation steps for reversible actions

**Examples:**
- No "Welcome back, [Name]!" headers
- No explanatory paragraphs on settings pages
- No icons on buttons where text is clear
- No confirmation modals for actions that can be undone

### 3. Information Density Done Right

**What it means:** Show enough context to act without scrolling, but never overwhelm. Density through structure, not clutter.

**In practice:**
- Scannable layouts with clear visual hierarchy
- Use overline labels and consistent field positioning
- Group related information logically
- Progressive disclosure for secondary details
- The most important information should be visible without interaction

**Examples:**
- Contact card shows name, role, company, status, and summary without scrolling
- Dashboard nudge list shows enough context to decide who to contact
- Notes timeline shows timestamps and key content at a glance

### 4. AI Stays in the Background

**What it means:** AI powers summaries and extraction but never demands attention. Intelligence is built in, not bolted on.

**In practice:**
- No "AI-generated" badges, sparkle icons, or "powered by AI" labels
- AI features feel like native product capabilities
- No explanation of how AI works within the UI
- AI results appear where human-written content would appear
- Users shouldn't need to prompt, configure, or acknowledge AI

**Examples:**
- Summary appears at top of contact card — no "AI Summary" label needed
- Action items extracted automatically — no "AI detected these items" message
- Notes are parsed silently — no "AI is processing..." states

---

## 5. Do's and Don'ts

### Do

- **Use borders to define surfaces** — Subtle #E0E0E2 borders create separation without visual weight
- **Keep shadows for elevated layers only** — Modals, dropdowns, popovers get shadows; cards use borders
- **Let white space create hierarchy** — Generous spacing between sections, tighter within them
- **Use accent color sparingly** — Primary buttons and active/selected states only
- **Make every tap/click useful** — No dead ends, decorative elements, or non-functional UI
- **Show status through color** — Red/amber/green communicate cadence at a glance
- **Use consistent field layouts** — Same information in same position across similar views
- **Confirm destructive actions simply** — Clear statement of what will happen, two options

### Don't

- **Add shadows to every card** — Overuse makes the interface feel heavy and dated
- **Use color decoratively** — Colors have meaning; don't dilute them with decoration
- **Put "AI" badges on generated content** — The intelligence should feel native
- **Add confirmation modals for reversible actions** — Save, edit, and similar actions don't need confirmation
- **Use icons without labels on primary actions** — Primary CTAs need clear text
- **Nest more than 2 levels of navigation** — Flat hierarchy keeps users oriented
- **Show empty states as sad** — "No contacts yet" not "You don't have any contacts"
- **Use marketing language in UI** — No superlatives, no hype, no selling
- **Require users to "submit" or "confirm"** — Actions happen on interaction

---

## 6. UI Copy Guidelines

### Buttons and Actions

| Type | Pattern | Examples |
|------|---------|----------|
| Primary action | Verb + object | "Save Note", "Add Contact", "Send Digest" |
| Secondary action | Verb only if clear | "Cancel", "Skip", "Edit" |
| Destructive action | Clear verb | "Delete", "Remove" |
| Confirmation | Brief statement | "Note saved", "Contact added" |

### Form Labels and Fields

- Use sentence case for labels: "Last contacted", not "Last Contacted"
- Placeholders describe what goes there: "Search contacts...", "Add a note..."
- Keep labels outside inputs, not inside as placeholders
- Required fields: no asterisks needed if everything required is required

### Error Messages

**Pattern:** What went wrong + what to do

| Situation | Message |
|-----------|---------|
| Network error | "Couldn't save. Check your connection and try again." |
| Validation error | "Name is required." |
| Not found | "Contact not found. It may have been deleted." |
| Server error | "Something went wrong. Try again in a moment." |

### Empty States

**Pattern:** Brief description + optional action

| Context | Message |
|---------|---------|
| No contacts | "No contacts yet. Add your first one to get started." |
| No notes | "No notes yet. This is where conversation details will live." |
| No action items | "No action items." |
| Search no results | "No contacts match '[query]'." |

### Nudge and Notification Copy

| Context | Pattern | Example |
|---------|---------|---------|
| Daily digest subject | "NetCard: [count] contacts to reach" | "NetCard: 3 contacts to reach" |
| Overdue nudge | "[Name] — [days]d since last contact" | "Buck Thompson — 31 days since last contact" |
| Due soon nudge | "[Name] — due in [days]d" | "Sarah Chen — due in 2 days" |
| Digest CTA | Simple action | "View in NetCard" |

---

## 7. Emotional Design

How users should feel at key touchpoints:

### First Launch
**Feel:** Welcomed but not overwhelmed. Ready to start.
**Achieve by:** Clean onboarding with minimal steps. One clear action. No tutorials or walkthroughs.

### Adding First Contact
**Feel:** Accomplished. This is easy.
**Achieve by:** Quick form, instant feedback, clear next step.

### During a Call (Card Open)
**Feel:** Prepared and confident. Everything I need is right here.
**Achieve by:** Summary visible immediately. Key details scannable. Note input ready.

### After Saving Notes
**Feel:** Done. Taken care of.
**Achieve by:** Instant confirmation. Summary updates visibly. No additional steps needed.

### Receiving a Nudge
**Feel:** Reminded, not nagged. Helpful prompt, not guilt trip.
**Achieve by:** Simple information: who and how long. Context to act immediately.

### Marking Contact as "Reached"
**Feel:** Satisfied. Progress made.
**Achieve by:** Quick action, visual status change, no celebration ceremony.

### When Things Go Wrong
**Feel:** Informed and able to fix it. Not blamed.
**Achieve by:** Clear error message, actionable next step, no dramatic visuals.

---

## 8. Brand Keywords

### Words That Describe NetCard

| Word | Why |
|------|-----|
| **Prepared** | You're always ready for conversations |
| **Effortless** | Minimal friction, maximum utility |
| **Accountable** | Gentle nudges keep you on track |
| **Contextual** | Right information at the right time |
| **Quiet** | Works in background, doesn't demand attention |
| **Fast** | Instant interactions, no waiting |
| **Clear** | Obvious what to do, easy to understand |
| **Personal** | Your relationships, your way |

### Words to Avoid

| Word | Why |
|------|-----|
| **Smart/Intelligent** | Implies AI showing off; we want AI invisible |
| **Powerful** | Overused, implies complexity |
| **Revolutionary** | Marketing speak, not product truth |
| **Seamless** | Cliche, means nothing specific |
| **Leverage** | Corporate jargon |
| **Synergy** | Corporate jargon |
| **Robust** | Vague tech marketing |
| **Best-in-class** | Competitive comparison we don't need |
| **AI-powered** | We don't advertise the AI |
| **Cutting-edge** | Marketing fluff |
| **Game-changing** | Marketing fluff |
| **Delightful** | Overused in product design |

### Describing Features

| Instead of... | Say... |
|--------------|--------|
| "AI-powered summaries" | "Automatic summaries" or just "Summary" |
| "Smart extraction" | "Automatically captured" |
| "Intelligent reminders" | "Cadence reminders" or "Nudges" |
| "Seamless integration" | "Works with [specific thing]" |
| "Powerful search" | "Search" |

---

## Quick Reference

### The NetCard Formula
**Precision + Warmth + Speed = Trust**

### The Three-Second Test
Can a user understand what to do within three seconds of seeing any screen?

### The Removal Test
If you remove an element and nothing breaks, it shouldn't have been there.

### The Voice Test
Would you say this out loud to a busy colleague? If it sounds formal, wordy, or robotic, rewrite it.

---

*These guidelines are a living document. As NetCard evolves, the brand should evolve with it — but always in service of the core purpose: making relationship maintenance effortless.*
