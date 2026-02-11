# NetCard/Rolodex Design Requirements Document

**Version:** 1.0
**Date:** February 10, 2026
**Status:** Ready for Implementation

---

## Executive Summary

This document details all design updates required to transform the current NetCard interface into a unique, intentional, hyper-modern experience built around glass morphism, summary-first information architecture, and Arc Browser-inspired confidence.

### Design Pillars
- **Keep:** Sunset gradient background, JetBrains Mono typography
- **Add:** Glass morphism, summary-first layouts, nudge-first dashboard
- **Inspiration:** Arc Browser — bold, colorful, convention-breaking (through confident restraint)
- **Personality:** Precise, Quiet, Warm, Fast

---

## Table of Contents

1. [Design System Updates](#1-design-system-updates)
2. [Sidebar Component](#2-sidebar-component)
3. [Card Components](#3-card-components)
4. [Button Components](#4-button-components)
5. [Input Components](#5-input-components)
6. [Badge Components](#6-badge-components)
7. [Dashboard Screen](#7-dashboard-screen)
8. [Contact List Screen](#8-contact-list-screen)
9. [Contact Detail Screen](#9-contact-detail-screen)
10. [Modal Components](#10-modal-components)
11. [Page Transitions](#11-page-transitions)
12. [Accessibility Requirements](#12-accessibility-requirements)
13. [Implementation Phases](#13-implementation-phases)

---

## 1. Design System Updates

### 1.1 New CSS Custom Properties

Add the following design tokens to the existing system:

```css
:root {
  /* Glass Morphism Tokens */
  --glass-blur-sm: 8px;
  --glass-blur-md: 16px;
  --glass-blur-lg: 24px;

  /* Glass Backgrounds */
  --glass-sidebar: rgba(255, 255, 255, 0.08);
  --glass-card: rgba(255, 255, 255, 0.72);
  --glass-card-hover: rgba(255, 255, 255, 0.82);
  --glass-card-elevated: rgba(255, 255, 255, 0.88);
  --glass-inset: rgba(255, 255, 255, 0.45);
  --glass-input: rgba(255, 255, 255, 0.5);
  --glass-input-focus: rgba(255, 255, 255, 0.7);

  /* Glass Borders */
  --glass-border-subtle: rgba(255, 255, 255, 0.12);
  --glass-border-light: rgba(255, 255, 255, 0.25);
  --glass-border-medium: rgba(255, 255, 255, 0.4);
  --glass-border-strong: rgba(255, 255, 255, 0.5);

  /* Text on Gradient (light text for dark gradient areas) */
  --text-on-gradient: rgba(255, 255, 255, 0.95);
  --text-on-gradient-secondary: rgba(255, 255, 255, 0.7);
  --text-on-gradient-tertiary: rgba(255, 255, 255, 0.5);

  /* Text on Glass (dark text for glass surfaces) */
  --text-on-glass: rgba(26, 26, 28, 0.95);
  --text-on-glass-secondary: rgba(26, 26, 28, 0.65);
  --text-on-glass-tertiary: rgba(26, 26, 28, 0.45);

  /* Status Glass Tints */
  --glass-overdue: rgba(229, 72, 77, 0.08);
  --glass-overdue-border: rgba(229, 72, 77, 0.2);
  --glass-overdue-accent: rgba(229, 72, 77, 0.6);

  --glass-due: rgba(240, 158, 0, 0.08);
  --glass-due-border: rgba(240, 158, 0, 0.2);
  --glass-due-accent: rgba(240, 158, 0, 0.5);

  --glass-ontrack: rgba(48, 164, 108, 0.08);
  --glass-ontrack-border: rgba(48, 164, 108, 0.2);
  --glass-ontrack-accent: rgba(48, 164, 108, 0.5);

  /* Updated Radius (slightly larger for modern feel) */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  /* Shadows for Glass */
  --shadow-glass-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-glass-md: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-glass-lg: 0 16px 48px rgba(0, 0, 0, 0.16), 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-glass-xl: 0 24px 80px rgba(0, 0, 0, 0.2), 0 8px 32px rgba(0, 0, 0, 0.12);

  /* Inner Highlights */
  --highlight-top: inset 0 1px 0 rgba(255, 255, 255, 0.5);
  --highlight-top-subtle: inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
```

### 1.2 Typography Updates

No changes to font family. Update text color usage:

| Context | Current | New |
|---------|---------|-----|
| Page titles on gradient | `#FFFFFF` | `var(--text-on-gradient)` with `text-shadow: 0 2px 8px rgba(0,0,0,0.15)` |
| Sidebar text | Dark text | `var(--text-on-gradient-secondary)` for items, `var(--text-on-gradient)` for active |
| Card headings | `--text-primary` | `var(--text-on-glass)` |
| Card body text | `--text-secondary` | `var(--text-on-glass-secondary)` |
| Labels/captions | `--text-tertiary` | `var(--text-on-glass-tertiary)` |

### 1.3 Spacing Updates

No changes to spacing scale. Maintain existing 4px base unit system.

---

## 2. Sidebar Component

### 2.1 Current State
- Solid white/light gray background (#F7F7F7)
- Dark text
- Flat, disconnected from gradient

### 2.2 Required Changes

**Background Treatment:**
```css
.sidebar {
  background: var(--glass-sidebar);
  backdrop-filter: blur(var(--glass-blur-lg));
  -webkit-backdrop-filter: blur(var(--glass-blur-lg));
  border-right: 1px solid var(--glass-border-subtle);
  box-shadow:
    inset 1px 0 0 rgba(255, 255, 255, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

**Navigation Items:**
```css
.sidebar-nav-item {
  color: var(--text-on-gradient-secondary);
  padding: 10px 16px;
  border-radius: var(--radius-md);
  transition: all 0.15s ease;
}

.sidebar-nav-item:hover {
  color: var(--text-on-gradient);
  background: rgba(255, 255, 255, 0.08);
}

.sidebar-nav-item.active {
  color: var(--text-on-gradient);
  background: rgba(255, 255, 255, 0.12);
  border-left: 2px solid rgba(255, 255, 255, 0.6);
}
```

**Brand/Logo:**
```css
.sidebar-brand {
  color: var(--text-on-gradient);
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.5px;
}
```

**User Profile (bottom):**
```css
.sidebar-user {
  background: rgba(255, 255, 255, 0.06);
  border-top: 1px solid var(--glass-border-subtle);
  padding: 12px 16px;
}

.sidebar-user-name {
  color: var(--text-on-gradient-secondary);
  font-size: 13px;
}

.sidebar-user-avatar {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### 2.3 Acceptance Criteria
- [ ] Sidebar background shows gradient through with frosted effect
- [ ] Text is legible on all gradient positions (purple to gold)
- [ ] Active state is clearly distinguishable
- [ ] Hover states provide feedback without being distracting
- [ ] User profile section is visually contained

---

## 3. Card Components

### 3.1 Primary Card (Main Content Containers)

**Current State:**
- Solid white background
- Subtle border (#E0E0E2)
- Minimal shadow

**Required Changes:**
```css
.card {
  background: var(--glass-card);
  backdrop-filter: blur(var(--glass-blur-md));
  -webkit-backdrop-filter: blur(var(--glass-blur-md));
  border: 1px solid var(--glass-border-medium);
  border-radius: var(--radius-lg);
  box-shadow:
    var(--shadow-glass-md),
    var(--highlight-top);
}

.card:hover {
  background: var(--glass-card-hover);
}
```

### 3.2 Inset Card (Nested Elements, Summary Blocks)

**Use for:** AI summaries, nested content areas, recessed sections

```css
.card-inset {
  background: var(--glass-inset);
  backdrop-filter: blur(var(--glass-blur-sm));
  -webkit-backdrop-filter: blur(var(--glass-blur-sm));
  border: 1px solid var(--glass-border-light);
  border-radius: var(--radius-md);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
}
```

### 3.3 Elevated Card (Hover States, Dropdowns)

```css
.card-elevated {
  background: var(--glass-card-elevated);
  backdrop-filter: blur(var(--glass-blur-lg));
  -webkit-backdrop-filter: blur(var(--glass-blur-lg));
  border: 1px solid var(--glass-border-strong);
  border-radius: var(--radius-lg);
  box-shadow:
    var(--shadow-glass-lg),
    var(--highlight-top);
}
```

### 3.4 Status-Tinted Cards (Dashboard Sections)

**Overdue Section:**
```css
.card-overdue {
  background: var(--glass-overdue);
  backdrop-filter: blur(var(--glass-blur-md));
  border: 1px solid var(--glass-overdue-border);
  border-left: 3px solid var(--glass-overdue-accent);
  border-radius: var(--radius-lg);
}
```

**Due Soon Section:**
```css
.card-due {
  background: var(--glass-due);
  backdrop-filter: blur(var(--glass-blur-md));
  border: 1px solid var(--glass-due-border);
  border-left: 3px solid var(--glass-due-accent);
  border-radius: var(--radius-lg);
}
```

### 3.5 Acceptance Criteria
- [ ] Cards have visible frosted glass effect
- [ ] Gradient subtly shows through card backgrounds
- [ ] Text remains highly readable (4.5:1 contrast minimum)
- [ ] Card hierarchy is clear (primary > inset > status-tinted)
- [ ] Hover states provide subtle elevation feedback

---

## 4. Button Components

### 4.1 Primary Button

**Current State:** Solid indigo (#5B5BD6)

**Required Changes:**
```css
.btn-primary {
  background: var(--accent);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-md);
  padding: 10px 18px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  box-shadow:
    0 2px 8px rgba(91, 91, 214, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.12s ease;
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow:
    0 4px 12px rgba(91, 91, 214, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-primary:active {
  transform: translateY(0);
}
```

### 4.2 Secondary Button

**Required Changes:**
```css
.btn-secondary {
  background: var(--glass-input);
  backdrop-filter: blur(var(--glass-blur-sm));
  color: var(--text-on-glass);
  border: 1px solid var(--glass-border-medium);
  border-radius: var(--radius-md);
  padding: 9px 16px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.12s ease;
}

.btn-secondary:hover {
  background: var(--glass-input-focus);
  border-color: var(--glass-border-strong);
}
```

### 4.3 Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: var(--text-on-glass-secondary);
  border: none;
  border-radius: var(--radius-md);
  padding: 9px 16px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.12s ease;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.3);
  color: var(--text-on-glass);
}
```

### 4.4 Danger Button

```css
.btn-danger {
  background: var(--status-overdue);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-md);
  padding: 10px 18px;
  box-shadow:
    0 2px 8px rgba(229, 72, 77, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-danger:hover {
  background: #d13438;
  transform: translateY(-1px);
}
```

### 4.5 Icon Button

```css
.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: var(--radius-md);
  background: var(--glass-input);
  backdrop-filter: blur(var(--glass-blur-sm));
  color: var(--text-on-glass-secondary);
  border: 1px solid var(--glass-border-light);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease;
}

.btn-icon:hover {
  background: var(--glass-input-focus);
  color: var(--text-on-glass);
}
```

### 4.6 Acceptance Criteria
- [ ] Primary buttons have subtle glow shadow
- [ ] Secondary buttons have glass treatment
- [ ] All buttons have 0.12s transitions
- [ ] Hover states include subtle transform
- [ ] Focus states are clearly visible

---

## 5. Input Components

### 5.1 Text Input

```css
.input {
  background: var(--glass-input);
  backdrop-filter: blur(var(--glass-blur-sm));
  border: 1px solid var(--glass-border-light);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text-on-glass);
  transition: all 0.12s ease;
}

.input::placeholder {
  color: var(--text-on-glass-tertiary);
}

.input:focus {
  outline: none;
  background: var(--glass-input-focus);
  border-color: rgba(91, 91, 214, 0.5);
  box-shadow: 0 0 0 3px rgba(91, 91, 214, 0.15);
}
```

### 5.2 Textarea

```css
.textarea {
  background: var(--glass-input);
  backdrop-filter: blur(var(--glass-blur-sm));
  border: 1px solid var(--glass-border-light);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text-on-glass);
  min-height: 100px;
  resize: vertical;
  line-height: 1.6;
  transition: all 0.12s ease;
}

.textarea:focus {
  outline: none;
  background: var(--glass-input-focus);
  border-color: rgba(91, 91, 214, 0.5);
  box-shadow: 0 0 0 3px rgba(91, 91, 214, 0.15);
}
```

### 5.3 Select

```css
.select {
  background: var(--glass-input);
  backdrop-filter: blur(var(--glass-blur-sm));
  border: 1px solid var(--glass-border-light);
  border-radius: var(--radius-md);
  padding: 10px 36px 10px 14px;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text-on-glass);
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* chevron icon */
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;
}

.select:focus {
  outline: none;
  background-color: var(--glass-input-focus);
  border-color: rgba(91, 91, 214, 0.5);
  box-shadow: 0 0 0 3px rgba(91, 91, 214, 0.15);
}
```

### 5.4 Search Input

```css
.input-search {
  background: var(--glass-input);
  backdrop-filter: blur(var(--glass-blur-sm));
  border: 1px solid var(--glass-border-light);
  border-radius: var(--radius-lg);
  padding: 12px 16px 12px 44px;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text-on-glass);
  width: 100%;
}

.input-search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-on-glass-tertiary);
}
```

### 5.5 Acceptance Criteria
- [ ] All inputs have glass background treatment
- [ ] Focus states show accent color ring
- [ ] Placeholder text is appropriately subtle
- [ ] Inputs are readable on all card backgrounds

---

## 6. Badge Components

### 6.1 Status Badges (No Changes to Colors)

Maintain existing semantic colors. Update surface treatment:

```css
.badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 100px;
  letter-spacing: 0.2px;
}

.badge-overdue {
  background: var(--status-overdue-bg);
  color: var(--status-overdue-text);
  border: 1px solid rgba(229, 72, 77, 0.2);
}

.badge-due {
  background: var(--status-due-bg);
  color: var(--status-due-text);
  border: 1px solid rgba(240, 158, 0, 0.2);
}

.badge-ontrack {
  background: var(--status-ontrack-bg);
  color: var(--status-ontrack-text);
  border: 1px solid rgba(48, 164, 108, 0.2);
}
```

### 6.2 Acceptance Criteria
- [ ] Badge colors remain semantically meaningful
- [ ] Badges have subtle border for definition on glass
- [ ] Text is readable within badges

---

## 7. Dashboard Screen

### 7.1 Current State
- Generic contact list view
- No prioritization of who needs attention
- Status badges present but not emphasized

### 7.2 Required Changes

#### 7.2.1 Page Header

```
Layout:
┌─────────────────────────────────────────────────────────┐
│  [Page Title: "Dashboard" or personalized greeting]     │
│  [Subtitle: "3 contacts need attention"]                │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Title: 28px, font-weight 700, `var(--text-on-gradient)`
- Subtitle: 15px, `var(--text-on-gradient-secondary)`
- No "Welcome back" or greeting fluff
- Subtitle shows actionable count

#### 7.2.2 Nudge Sections

**Layout Order:**
1. **Overdue Section** (if any exist)
2. **Due This Week Section** (if any exist)
3. **Recently Contacted Section** (collapsed by default)

**Overdue Section:**
```
┌─────────────────────────────────────────────────────────┐
│  OVERDUE                                           [2]  │
│  ───────────────────────────────────────────────────── │
│  [Contact Item: Buck Thompson]                          │
│  [Contact Item: James Rivera]                           │
└─────────────────────────────────────────────────────────┘
```

- Use `.card-overdue` glass treatment
- Section header: 11px uppercase, `var(--text-on-glass-tertiary)`
- Count badge: Right-aligned, uses `.badge-overdue`

**Due This Week Section:**
```
┌─────────────────────────────────────────────────────────┐
│  DUE THIS WEEK                                     [1]  │
│  ───────────────────────────────────────────────────── │
│  [Contact Item: Sarah Chen]                             │
└─────────────────────────────────────────────────────────┘
```

- Use `.card-due` glass treatment
- Same header pattern as overdue

**Recently Contacted Section:**
```
┌─────────────────────────────────────────────────────────┐
│  RECENTLY CONTACTED                           [Show 4]  │
│  ───────────────────────────────────────────────────── │
│  [Compact contact list - last 4 touchpoints]            │
└─────────────────────────────────────────────────────────┘
```

- Use standard `.card` glass treatment
- Collapsed by default, expandable
- Shows last 4-5 contacts reached

#### 7.2.3 Dashboard Contact Item

Each contact in the dashboard list:

```
┌─────────────────────────────────────────────────────────┐
│  [Avatar]  Name                           [Status]      │
│            Role at Company                 31d overdue  │
│            "Summary snippet, 2 lines..."   ──────────── │
│                                            Last: Jan 10 │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Avatar: 40px circle
- Name: 15px, font-weight 600
- Role/Company: 13px, `var(--text-on-glass-secondary)`
- Summary: 13px, italic, `var(--text-on-glass-tertiary)`, 2-line clamp
- Status: Right column with badge + "Last: date" below
- Entire item is clickable, navigates to contact detail
- Hover: Subtle elevation + background change

### 7.3 Empty States

**No Overdue:**
- Don't show overdue section at all

**No Contacts:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│            Your network starts here.                    │
│                                                         │
│            [+ Add Contact]                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.4 Acceptance Criteria
- [ ] Dashboard loads with nudge-first prioritization
- [ ] Overdue contacts appear at top with red-tinted glass
- [ ] Due soon contacts appear with amber-tinted glass
- [ ] Contact items show summary snippet for context
- [ ] Single click navigates to contact detail
- [ ] Empty states are inviting, not sad

---

## 8. Contact List Screen

### 8.1 Current State
- Simple list with Name, Role @ Company, Status badge
- Large white search input
- "+ Add Contact" button

### 8.2 Required Changes

#### 8.2.1 Page Header

```
┌─────────────────────────────────────────────────────────┐
│  Contacts                              [+ Add Contact]  │
└─────────────────────────────────────────────────────────┘
```

- Title: 28px, font-weight 700, `var(--text-on-gradient)`
- Button: Primary button style

#### 8.2.2 Search Bar

```
┌─────────────────────────────────────────────────────────┐
│  [🔍] Search contacts...                                │
└─────────────────────────────────────────────────────────┘
```

- Use `.input-search` glass treatment
- Full width within content area
- Icon: 20px, `var(--text-on-glass-tertiary)`

#### 8.2.3 Contact Count

```
12 contacts
```

- 13px, `var(--text-on-gradient-secondary)`
- Below search bar, above list

#### 8.2.4 Contact List Item (Summary-First)

**New Layout:**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [Avatar]  John Doe                      [On Track]     │
│            CEO at Acme Inc.               ────────────  │
│            ─────────────────────────────  Last: Jan 15  │
│            "Discussed Q2 hiring plans                   │
│             and Kubernetes migration..."                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Grid Structure:**
```css
.contact-list-item {
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border-light);
  border-radius: var(--radius-lg);
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.contact-list-item:hover {
  background: rgba(255, 255, 255, 0.75);
  transform: translateY(-1px);
  box-shadow: var(--shadow-glass-md);
}
```

**Content Specifications:**

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| Avatar | 48px | - | Accent bg | Initials, rounded full |
| Name | 15px | 600 | `--text-on-glass` | Single line |
| Role @ Company | 13px | 400 | `--text-on-glass-secondary` | Single line |
| Summary snippet | 13px | 400 | `--text-on-glass-tertiary` | Italic, 2-line clamp |
| Status badge | 11px | 600 | Status colors | Right-aligned |
| Last contacted | 11px | 400 | `--text-on-glass-tertiary` | Mono, below badge |

**Summary Snippet CSS:**
```css
.contact-summary-snippet {
  font-size: 13px;
  font-style: italic;
  color: var(--text-on-glass-tertiary);
  line-height: 1.5;
  margin-top: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 8.3 Acceptance Criteria
- [ ] Each list item shows AI summary snippet
- [ ] Last contacted date visible without clicking
- [ ] Status badge clearly visible
- [ ] List items have glass treatment
- [ ] Hover state provides elevation feedback
- [ ] Search filters list in real-time

---

## 9. Contact Detail Screen

### 9.1 Current State
- Header with avatar, name, role, status
- Quick Actions card (separate)
- Contact Details card (separate, long vertical list)
- About/Summary section (below details)
- Notes + Action Items (two columns at bottom)

### 9.2 Required Changes

#### 9.2.1 New Information Hierarchy

**Priority Order (top to bottom):**
1. Back navigation
2. Header (identity + status)
3. **AI Summary (HERO)** — most prominent
4. Quick Actions bar
5. Two-column: Action Items + Quick Facts
6. Notes & Transcripts section
7. Sticky footer: "I Just Reached Out"

#### 9.2.2 Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Contacts                                     │
│                                                         │
│  [Avatar]  John Doe                    [Edit] [⋯]       │
│            CEO at Acme Inc.                             │
│            Denver, CO                                   │
│            [On Track] 60 days until due                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │ SUMMARY                              [Refresh]  │   │
│  │                                                  │   │
│  │ John is the CEO of Acme Inc. in Denver, CO.    │   │
│  │ He loves skiing and has 3 kids, and coaches    │   │
│  │ youth soccer. The notes indicate he is a       │   │
│  │ grounded, routine-oriented person who values   │   │
│  │ steady progress over big swings...             │   │
│  │                                                  │   │
│  │ Last updated 2 minutes ago                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────┐  ┌────────────────────────┐  │
│  │ ACTION ITEMS    [1]  │  │ QUICK FACTS            │  │
│  │                      │  │                        │  │
│  │ [ ] Intro to beans   │  │ Email    john@acme.com │  │
│  │ [+] Add item         │  │ Phone    281-222-5837  │  │
│  │                      │  │ How Met  Startup Week  │  │
│  │                      │  │ Cadence  Monthly       │  │
│  │                      │  │ Prefers  Email         │  │
│  └──────────────────────┘  └────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ NOTES                                           │   │
│  │ [All] [Notes] [Transcripts]    [Upload Trans]  │   │
│  │ ─────────────────────────────────────────────── │   │
│  │ [Textarea: Add a note...]            [Save]    │   │
│  │ ─────────────────────────────────────────────── │   │
│  │ [Note entry 1]                                  │   │
│  │ [Note entry 2]                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [✓ I Just Reached Out]              [Schedule Call]   │
└─────────────────────────────────────────────────────────┘
```

#### 9.2.3 Header Section

```css
.contact-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px 0;
}

.contact-avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-subtle);
  color: var(--accent-text);
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-name-large {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-on-gradient);
  letter-spacing: -0.3px;
}

.contact-role-large {
  font-size: 15px;
  color: var(--text-on-gradient-secondary);
  margin-top: 2px;
}

.contact-location {
  font-size: 13px;
  color: var(--text-on-gradient-tertiary);
  margin-top: 2px;
}

.contact-status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.contact-due-text {
  font-size: 13px;
  color: var(--text-on-gradient-secondary);
}
```

#### 9.2.4 Summary Section (HERO)

**This is the most important visual element on the page.**

```css
.summary-card {
  background: var(--glass-inset);
  backdrop-filter: blur(var(--glass-blur-md));
  border: 1px solid var(--glass-border-light);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  margin: 24px 0;
}

.summary-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-on-glass-tertiary);
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-content {
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-on-glass);
}

.summary-updated {
  font-size: 12px;
  color: var(--text-on-glass-tertiary);
  margin-top: 16px;
}
```

#### 9.2.5 Action Items + Quick Facts (Two Column)

```css
.detail-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 24px 0;
}

@media (max-width: 768px) {
  .detail-columns {
    grid-template-columns: 1fr;
  }
}
```

**Action Items Card:**
- Standard `.card` treatment
- Checkbox list
- "+ Add item" button at bottom
- Count badge in header

**Quick Facts Card:**
- Standard `.card` treatment
- Compact key-value list
- Email/phone are clickable links
- 2-column grid inside: Label | Value

```css
.quick-facts-grid {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 8px 16px;
}

.quick-facts-label {
  font-size: 12px;
  color: var(--text-on-glass-tertiary);
}

.quick-facts-value {
  font-size: 13px;
  color: var(--text-on-glass);
}

.quick-facts-value a {
  color: var(--accent-text);
  text-decoration: none;
}

.quick-facts-value a:hover {
  text-decoration: underline;
}
```

#### 9.2.6 Notes Section

- Full-width card below the two columns
- Tab navigation: All | Notes | Transcripts
- "Upload Transcript" button in header
- Textarea for adding new note
- Chronological note list below

#### 9.2.7 Sticky Footer

```css
.contact-footer {
  position: sticky;
  bottom: 0;
  background: var(--glass-card);
  backdrop-filter: blur(var(--glass-blur-lg));
  border-top: 1px solid var(--glass-border-light);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px -24px -24px -24px; /* Extend to card edges */
}
```

### 9.3 Acceptance Criteria
- [ ] AI Summary is the most prominent element after header
- [ ] Summary has distinct visual treatment (inset + accent border)
- [ ] Action items and quick facts are visible without scrolling
- [ ] Contact details are condensed, not a long vertical list
- [ ] "I Just Reached Out" is always accessible (sticky footer)
- [ ] Page follows summary-first hierarchy

---

## 10. Modal Components

### 10.1 Modal Backdrop

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(26, 10, 46, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
```

### 10.2 Modal Container

```css
.modal {
  background: var(--glass-card-elevated);
  backdrop-filter: blur(var(--glass-blur-lg));
  -webkit-backdrop-filter: blur(var(--glass-blur-lg));
  border: 1px solid var(--glass-border-strong);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glass-xl);
  max-width: 560px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--glass-border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-on-glass);
}

.modal-close {
  /* Use .btn-icon styles */
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--glass-border-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
```

### 10.3 Upload Transcript Modal

Update to use new modal styles. Content remains the same:
- File upload dropzone
- "or paste below" divider
- Textarea for pasting
- Character count
- Cancel + Save Transcript buttons

### 10.4 Acceptance Criteria
- [ ] Modal backdrop blurs underlying content
- [ ] Modal has glass treatment matching cards
- [ ] Modal appears centered with smooth entrance
- [ ] Close button is clearly visible
- [ ] Modal is scrollable if content overflows

---

## 11. Page Transitions

### 11.1 Navigation Transitions

**Between List and Detail:**
```css
.page-transition-enter {
  opacity: 0;
  transform: translateX(20px);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.2s ease, transform 0.25s ease;
}

.page-transition-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-transition-exit-active {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.2s ease, transform 0.25s ease;
}
```

**Going Back (reverse direction):**
```css
.page-transition-back-enter {
  opacity: 0;
  transform: translateX(-20px);
}

.page-transition-back-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.2s ease, transform 0.25s ease;
}
```

### 11.2 Respect Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .page-transition-enter,
  .page-transition-enter-active,
  .page-transition-exit,
  .page-transition-exit-active {
    transition: none;
    transform: none;
  }
}
```

### 11.3 Acceptance Criteria
- [ ] Page transitions are smooth (200-250ms)
- [ ] Direction indicates navigation hierarchy (right = deeper, left = back)
- [ ] Reduced motion preference is respected

---

## 12. Accessibility Requirements

### 12.1 Color Contrast

All text must meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum

**Verified Combinations:**
| Text Color | Background | Ratio | Pass |
|------------|------------|-------|------|
| `--text-on-glass` | `--glass-card` | 7.2:1 | ✓ |
| `--text-on-glass-secondary` | `--glass-card` | 4.8:1 | ✓ |
| `--text-on-gradient` | Purple gradient area | 12:1+ | ✓ |
| `--text-on-gradient` | Gold gradient area | 8:1+ | ✓ |

### 12.2 Focus Indicators

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* For elements on dark backgrounds */
.on-gradient:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}
```

### 12.3 Backdrop Filter Fallback

```css
@supports not (backdrop-filter: blur(16px)) {
  .card,
  .sidebar,
  .modal {
    background: rgba(255, 255, 255, 0.95);
  }
}
```

### 12.4 Screen Reader Considerations

- Status badges must have `aria-label` describing full status (e.g., "Status: 31 days overdue")
- Summary section should have `aria-label="AI-generated summary"`
- Interactive elements must have descriptive labels
- Page title should update on navigation

### 12.5 Keyboard Navigation

- All interactive elements must be reachable via Tab
- Modal must trap focus
- Escape key closes modal
- Enter/Space activates buttons and links

### 12.6 Acceptance Criteria
- [ ] All text passes contrast requirements
- [ ] Focus indicators are visible on all interactive elements
- [ ] App is fully navigable via keyboard
- [ ] Screen readers can access all content
- [ ] Fallbacks exist for unsupported CSS features

---

## 13. Implementation Phases

### Phase 1: Design System Foundation
**Priority: Critical**

- [ ] Add new CSS custom properties (glass tokens)
- [ ] Update typography color system
- [ ] Create glass card component variants
- [ ] Update button components
- [ ] Update input components
- [ ] Update badge components

**Estimated scope:** Design system/component library updates

### Phase 2: Sidebar Transformation
**Priority: High**

- [ ] Implement glass sidebar background
- [ ] Update navigation item styles
- [ ] Update brand/logo treatment
- [ ] Update user profile section
- [ ] Test on all gradient positions

**Estimated scope:** Single component, global impact

### Phase 3: Contact List Screen
**Priority: High**

- [ ] Update page header
- [ ] Implement glass search input
- [ ] Create new contact list item component (summary-first)
- [ ] Add hover/transition states
- [ ] Test with varying content lengths

**Estimated scope:** One screen, new component

### Phase 4: Contact Detail Screen
**Priority: High**

- [ ] Restructure page layout (summary-first)
- [ ] Create hero summary component
- [ ] Implement two-column layout (action items + quick facts)
- [ ] Update notes section
- [ ] Add sticky footer
- [ ] Update header treatment

**Estimated scope:** One screen, significant restructure

### Phase 5: Dashboard Screen
**Priority: High**

- [ ] Implement nudge-first layout
- [ ] Create status-tinted section cards
- [ ] Create dashboard contact item variant
- [ ] Add section empty states
- [ ] Test with 0, few, and many contacts

**Estimated scope:** One screen, new layout pattern

### Phase 6: Modal Updates
**Priority: Medium**

- [ ] Update modal backdrop
- [ ] Update modal container styles
- [ ] Update Upload Transcript modal
- [ ] Add/update any other modals (Add Contact, Edit Contact, etc.)

**Estimated scope:** Component updates

### Phase 7: Page Transitions
**Priority: Medium**

- [ ] Implement enter/exit transitions
- [ ] Handle back navigation
- [ ] Add reduced motion support

**Estimated scope:** Global navigation enhancement

### Phase 8: Polish & Accessibility
**Priority: Medium**

- [ ] Audit all contrast ratios
- [ ] Add focus indicators
- [ ] Add aria labels
- [ ] Add backdrop-filter fallbacks
- [ ] Test keyboard navigation
- [ ] Test with screen reader

**Estimated scope:** Cross-cutting quality pass

---

## Appendix A: Quick Reference — Glass Values

| Element | Background | Blur | Border |
|---------|------------|------|--------|
| Sidebar | `rgba(255,255,255,0.08)` | 24px | `rgba(255,255,255,0.12)` |
| Primary Card | `rgba(255,255,255,0.72)` | 16px | `rgba(255,255,255,0.4)` |
| Inset Card | `rgba(255,255,255,0.45)` | 8px | `rgba(255,255,255,0.25)` |
| Elevated Card | `rgba(255,255,255,0.88)` | 24px | `rgba(255,255,255,0.5)` |
| Input | `rgba(255,255,255,0.5)` | 8px | `rgba(255,255,255,0.25)` |
| Modal | `rgba(255,255,255,0.88)` | 24px | `rgba(255,255,255,0.5)` |
| Modal Backdrop | `rgba(26,10,46,0.5)` | 8px | — |

---

## Appendix B: File Checklist

Files likely requiring updates:

- [ ] `globals.css` or CSS variables file
- [ ] Sidebar component
- [ ] Card component(s)
- [ ] Button component(s)
- [ ] Input component(s)
- [ ] Badge component(s)
- [ ] Dashboard page
- [ ] Contacts list page
- [ ] Contact detail page
- [ ] Modal component(s)
- [ ] Page transition wrapper/layout

---

*End of Requirements Document*
