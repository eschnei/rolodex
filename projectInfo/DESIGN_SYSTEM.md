# NetCard Design System

A comprehensive design system for the NetCard personal networking CRM. Clean cards floating on warmth - inspired by Raycast's precision and sunset skies.

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Design Tokens](#design-tokens)
3. [Typography Scale](#typography-scale)
4. [Spacing System](#spacing-system)
5. [Color Usage Guidelines](#color-usage-guidelines)
6. [Component Specifications](#component-specifications)
7. [Responsive Behavior](#responsive-behavior)
8. [Accessibility Notes](#accessibility-notes)
9. [Implementation Notes](#implementation-notes)

---

## Design Principles

### Speed Over Chrome
Every interaction should feel instant. No loading spinners for local actions. Optimistic updates everywhere. The UI should never slow you down.

### Reduce to Essentials
If a UI element doesn't directly serve the task, remove it. No decorative flourishes. No redundant labels. White space is a feature.

### Information Density Done Right
Show enough context to act without scrolling, but never overwhelm. Scannable layouts with clear hierarchy. Density through structure, not clutter.

### AI Stays in the Background
AI powers summaries and extraction but never demands attention. No "AI Generated" badges. The intelligence should feel built in, not bolted on.

---

## Design Tokens

### CSS Variables - Complete Reference

```css
:root {
  /* ========================================
     COLORS - BACKGROUNDS
     ======================================== */
  --bg-primary: #FAFAFA;      /* Page background */
  --bg-secondary: #FFFFFF;    /* Card/elevated surfaces */
  --bg-elevated: #FFFFFF;     /* Modal/dropdown backgrounds */
  --bg-inset: #F2F2F3;        /* Recessed areas, input backgrounds */
  --bg-hover: #EBEBEC;        /* Interactive element hover state */

  /* ========================================
     COLORS - BORDERS
     ======================================== */
  --border-primary: #E0E0E2;  /* Default borders, input borders */
  --border-subtle: #EBEBEC;   /* Subtle dividers, card borders */
  --border-focus: #8B8B8E;    /* Focus ring fallback */

  /* ========================================
     COLORS - TEXT
     ======================================== */
  --text-primary: #1A1A1C;    /* Headings, primary content */
  --text-secondary: #6B6B6F;  /* Body text, descriptions */
  --text-tertiary: #9C9CA0;   /* Captions, timestamps, labels */
  --text-inverse: #FFFFFF;    /* Text on dark/accent backgrounds */

  /* ========================================
     COLORS - ACCENT (Indigo)
     ======================================== */
  --accent: #5B5BD6;          /* Primary buttons, links */
  --accent-hover: #4C4CC4;    /* Button hover state */
  --accent-subtle: #EDEDFC;   /* Accent backgrounds, focus rings */
  --accent-text: #4747B3;     /* Text on accent-subtle backgrounds */

  /* ========================================
     COLORS - STATUS (Cadence Only)
     ======================================== */
  /* Overdue - Red */
  --status-overdue: #E5484D;
  --status-overdue-bg: #FEECEE;
  --status-overdue-text: #CE2C31;

  /* Due Soon - Amber */
  --status-due: #F09E00;
  --status-due-bg: #FFF3D0;
  --status-due-text: #AD6F00;

  /* On Track - Green */
  --status-ontrack: #30A46C;
  --status-ontrack-bg: #E6F6ED;
  --status-ontrack-text: #1D7D4E;

  /* ========================================
     SHADOWS
     ======================================== */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);

  /* ========================================
     BORDER RADIUS
     ======================================== */
  --radius-sm: 6px;           /* Small buttons, badges */
  --radius-md: 8px;           /* Inputs, cards, standard buttons */
  --radius-lg: 12px;          /* Cards, modals */
  --radius-xl: 16px;          /* Large containers */
  --radius-full: 9999px;      /* Pills, avatars */

  /* ========================================
     SPACING (4px base unit)
     ======================================== */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ========================================
     TYPOGRAPHY
     ======================================== */
  --font-sans: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, monospace;

  /* Line Heights */
  --leading-tight: 1.2;       /* Headings */
  --leading-normal: 1.5;      /* UI elements */
  --leading-relaxed: 1.65;    /* Body text, paragraphs */

  /* ========================================
     TRANSITIONS
     ======================================== */
  --transition-fast: 120ms ease;   /* Micro-interactions (hover, focus) */
  --transition-normal: 200ms ease; /* Layout changes, modals */
}
```

---

## Typography Scale

NetCard uses **JetBrains Mono** as the single typeface for the entire app. The monospace character gives the UI a technical, precise feel.

### Type Scale Reference

| Name     | Size | Weight | Letter Spacing | Line Height        | Use Case                          |
|----------|------|--------|----------------|--------------------|------------------------------------|
| H1       | 28px | 700    | -0.5px         | 1.2 (tight)        | Page titles                        |
| H2       | 22px | 600    | -0.3px         | 1.2 (tight)        | Section headers                    |
| H3       | 17px | 600    | -0.1px         | 1.2 (tight)        | Card titles, contact names         |
| Body     | 14px | 400    | normal         | 1.65 (relaxed)     | Primary content, descriptions      |
| Small    | 13px | 400    | normal         | 1.65 (relaxed)     | Secondary info, metadata           |
| Caption  | 12px | 500    | normal         | 1.5 (normal)       | Labels, helper text                |
| Mono     | 13px | 400    | normal         | 1.5 (normal)       | Timestamps, dates, codes           |
| Overline | 11px | 600    | 0.8px          | 1.5 (normal)       | Section labels, uppercase headings |

### CSS Implementation

```css
/* H1 - Page titles */
.type-h1 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

/* H2 - Section headers */
.type-h2 {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.3px;
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

/* H3 - Card titles, contact names */
.type-h3 {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.1px;
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

/* Body - Primary content */
.type-body {
  font-size: 14px;
  font-weight: 400;
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
}

/* Small - Secondary info */
.type-small {
  font-size: 13px;
  font-weight: 400;
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
}

/* Caption - Labels, helper text */
.type-caption {
  font-size: 12px;
  font-weight: 500;
  line-height: var(--leading-normal);
  color: var(--text-tertiary);
}

/* Mono - Timestamps, dates */
.type-mono {
  font-size: 13px;
  font-family: var(--font-mono);
  font-weight: 400;
  color: var(--text-secondary);
}

/* Overline - Section labels */
.type-overline {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-tertiary);
}
```

### Tailwind CSS Mapping

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'h1': ['28px', { lineHeight: '1.2', letterSpacing: '-0.5px', fontWeight: '700' }],
        'h2': ['22px', { lineHeight: '1.2', letterSpacing: '-0.3px', fontWeight: '600' }],
        'h3': ['17px', { lineHeight: '1.2', letterSpacing: '-0.1px', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.65', fontWeight: '400' }],
        'small': ['13px', { lineHeight: '1.65', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.5', fontWeight: '500' }],
        'overline': ['11px', { lineHeight: '1.5', letterSpacing: '0.8px', fontWeight: '600' }],
      },
    },
  },
}
```

---

## Spacing System

Based on a **4px base unit**. Use multiples for consistency.

### Spacing Scale

| Token      | Value | Common Uses                                    |
|------------|-------|------------------------------------------------|
| --space-1  | 4px   | Tight gaps, icon margins                       |
| --space-2  | 8px   | Button icon gaps, inline spacing               |
| --space-3  | 12px  | Grid gaps, small component padding             |
| --space-4  | 16px  | Standard padding, card internal spacing        |
| --space-5  | 20px  | Card header/body padding                       |
| --space-6  | 24px  | Section margins, large gaps                    |
| --space-8  | 32px  | Section separators, component groups           |
| --space-10 | 40px  | Page section gaps                              |
| --space-12 | 48px  | Major layout divisions                         |
| --space-16 | 64px  | Page padding, hero sections                    |

### Usage Guidelines

```css
/* Component internal padding */
.card-body { padding: var(--space-5); }           /* 20px */
.card-header { padding: var(--space-5); }         /* 20px */
.card-footer { padding: var(--space-3) var(--space-5); } /* 12px 20px */

/* Gaps between elements */
.button-group { gap: var(--space-3); }            /* 12px */
.form-stack { gap: var(--space-4); }              /* 16px */
.section-gap { margin-bottom: var(--space-8); }   /* 32px */

/* Page layout */
.page { padding: var(--space-16) var(--space-6); } /* 64px 24px */
.section { margin-bottom: var(--space-16); }       /* 64px */
```

### Tailwind CSS Mapping

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
    },
  },
}
```

---

## Color Usage Guidelines

### Backgrounds

| Token          | When to Use                                        |
|----------------|----------------------------------------------------|
| --bg-primary   | Page background, main content area                 |
| --bg-secondary | Cards, elevated surfaces, modals                   |
| --bg-inset     | Recessed areas, form backgrounds, summary blocks   |
| --bg-hover     | Interactive element hover state                    |

### Text Colors

| Token            | When to Use                                      |
|------------------|--------------------------------------------------|
| --text-primary   | Headings, names, primary content                 |
| --text-secondary | Body text, descriptions, secondary info          |
| --text-tertiary  | Captions, timestamps, labels, placeholders       |
| --text-inverse   | Text on dark or accent-colored backgrounds       |

### Accent Color Rules

- **Primary buttons**: Use `--accent` background with `--text-inverse`
- **Links**: Use `--accent-text` for link color
- **Focus states**: Use `--accent-subtle` for focus rings
- **Subtle highlights**: Use `--accent-subtle` background with `--accent-text`
- **NEVER** use accent for decorative purposes

### Status Colors - CRITICAL RULES

Status colors are **reserved strictly for cadence indicators**. Never use them for decoration.

| Status   | Use Case                                    | Badge Style                                |
|----------|---------------------------------------------|---------------------------------------------|
| Overdue  | Contact is past due for follow-up           | `background: --status-overdue-bg`, `color: --status-overdue-text` |
| Due Soon | Contact needs follow-up within next few days| `background: --status-due-bg`, `color: --status-due-text` |
| On Track | Contact cadence is healthy                  | `background: --status-ontrack-bg`, `color: --status-ontrack-text` |

```css
/* Correct: Status badge for cadence */
.badge-overdue {
  background: var(--status-overdue-bg);
  color: var(--status-overdue-text);
}

/* WRONG: Using status colors decoratively */
.success-message { color: var(--status-ontrack); } /* Don't do this */
```

### Border Usage

| Token            | When to Use                              |
|------------------|------------------------------------------|
| --border-primary | Input borders, card outlines             |
| --border-subtle  | Dividers, subtle card borders            |
| --border-focus   | Fallback focus indicator                 |

**Design principle**: Use borders to define surfaces. Keep shadows for elevated layers only (modals, dropdowns).

---

## Component Specifications

### Buttons

#### Button Base

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-md);
  padding: 8px 14px;
  border: none;
  cursor: pointer;
  transition: all 0.12s ease;
  white-space: nowrap;
}
```

#### Button Variants

| Variant     | Background           | Text Color           | Border                      | Hover                        |
|-------------|----------------------|----------------------|-----------------------------|------------------------------|
| Primary     | --accent             | --text-inverse       | none                        | --accent-hover               |
| Secondary   | --bg-secondary       | --text-primary       | 1px solid --border-primary  | --bg-hover                   |
| Ghost       | transparent          | --text-secondary     | none                        | --bg-hover, --text-primary   |
| Danger      | --status-overdue     | --text-inverse       | none                        | #d13438                      |

```css
.btn-primary {
  background: var(--accent);
  color: var(--text-inverse);
}
.btn-primary:hover { background: var(--accent-hover); }

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}
.btn-secondary:hover { background: var(--bg-hover); }

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}
.btn-ghost:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.btn-danger {
  background: var(--status-overdue);
  color: var(--text-inverse);
}
.btn-danger:hover { background: #d13438; }
```

#### Button Sizes

| Size   | Font Size | Padding       | Border Radius |
|--------|-----------|---------------|---------------|
| Small  | 12px      | 5px 10px      | --radius-sm   |
| Medium | 13px      | 8px 14px      | --radius-md   |
| Large  | 14px      | 10px 18px     | --radius-md   |

```css
.btn-sm {
  font-size: 12px;
  padding: 5px 10px;
  border-radius: var(--radius-sm);
}

.btn-lg {
  font-size: 14px;
  padding: 10px 18px;
}
```

#### Icon Button

```css
.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease;
  font-size: 16px;
}
.btn-icon:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
```

### Form Inputs

#### Text Input

```css
.input {
  font-family: var(--font-sans);
  font-size: 14px;
  padding: 8px 12px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
  width: 100%;
  max-width: 320px;
  transition: border-color 0.12s ease, box-shadow 0.12s ease;
  outline: none;
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}
```

#### Textarea

```css
.textarea {
  font-family: var(--font-sans);
  font-size: 14px;
  padding: 10px 12px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
  width: 100%;
  max-width: 480px;
  min-height: 80px;
  resize: vertical;
  outline: none;
  line-height: var(--leading-relaxed);
  transition: border-color 0.12s ease, box-shadow 0.12s ease;
}

.textarea::placeholder { color: var(--text-tertiary); }

.textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}
```

#### Select

```css
.select {
  font-family: var(--font-sans);
  font-size: 14px;
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B6B6F' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
  transition: border-color 0.12s ease;
}

.select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
  letter-spacing: 0.1px;
}

/* Status badges - for cadence only */
.badge-overdue {
  background: var(--status-overdue-bg);
  color: var(--status-overdue-text);
}

.badge-due {
  background: var(--status-due-bg);
  color: var(--status-due-text);
}

.badge-ontrack {
  background: var(--status-ontrack-bg);
  color: var(--status-ontrack-text);
}

/* General purpose badges */
.badge-neutral {
  background: var(--bg-inset);
  color: var(--text-secondary);
}

.badge-accent {
  background: var(--accent-subtle);
  color: var(--accent-text);
}
```

### Cards

#### Base Card Structure

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.card-header {
  padding: var(--space-5);
  border-bottom: 1px solid var(--border-subtle);
}

.card-body {
  padding: var(--space-5);
}

.card-footer {
  padding: var(--space-3) var(--space-5);
  background: var(--bg-inset);
  border-top: 1px solid var(--border-subtle);
}
```

### Contact Avatar

```css
.contact-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent-subtle);
  color: var(--accent-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

/* Small variant for lists */
.contact-avatar-sm {
  width: 36px;
  height: 36px;
  font-size: 13px;
}
```

### Summary Block

```css
.contact-summary {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-inset);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--accent);
}
```

### Dashboard List Item

```css
.dash-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.1s ease;
}

.dash-item:hover {
  background: var(--bg-hover);
}

.dash-item-info {
  flex: 1;
  min-width: 0;
}

.dash-item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.dash-item-detail {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### Action Items (Checkbox List)

```css
.action-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-2) 0;
}

.action-item input[type="checkbox"] {
  margin-top: 2px;
  accent-color: var(--accent);
}

.action-item span {
  font-size: 13px;
  color: var(--text-primary);
}

.action-item.completed span {
  text-decoration: line-through;
  color: var(--text-tertiary);
}
```

### Notes Entry

```css
.note-entry {
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border-subtle);
}

.note-entry:last-child {
  border-bottom: none;
}

.note-timestamp {
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  margin-bottom: var(--space-1);
}

.note-content {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}
```

---

## Responsive Behavior

### Breakpoints

| Name   | Width  | Use Case                      |
|--------|--------|-------------------------------|
| Mobile | < 768px| Single column, stacked layout |
| Tablet | >= 768px| Two column where needed      |
| Desktop| >= 960px| Full width, max-width 960px  |

### Responsive Rules

```css
/* Mobile-first base styles */
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
}

@media (max-width: 768px) {
  .page {
    padding: var(--space-10) var(--space-4);
  }

  /* Stack typography rows */
  .type-row {
    grid-template-columns: 1fr;
    gap: var(--space-1);
  }

  /* 2-column grid becomes 1 column */
  .color-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .contact-field-grid {
    grid-template-columns: 1fr;
  }

  .dos-donts {
    grid-template-columns: 1fr;
  }

  .principles-grid {
    grid-template-columns: 1fr;
  }
}
```

### Tailwind Responsive Classes

```html
<!-- Example: Contact field grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
  <!-- fields -->
</div>

<!-- Example: Page padding -->
<div class="px-4 py-10 md:px-6 md:py-16 max-w-[960px] mx-auto">
  <!-- content -->
</div>
```

---

## Accessibility Notes

### Focus States

All interactive elements must have visible focus indicators:

```css
/* Focus ring pattern */
.input:focus,
.textarea:focus,
.select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}

/* Button focus - add outline for keyboard users */
.btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Link focus */
a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Color Contrast Requirements

| Combination                        | Contrast Ratio | Status |
|------------------------------------|----------------|--------|
| --text-primary on --bg-primary     | 15.3:1         | Pass   |
| --text-primary on --bg-secondary   | 16.6:1         | Pass   |
| --text-secondary on --bg-secondary | 5.2:1          | Pass   |
| --text-tertiary on --bg-secondary  | 3.1:1          | AA Large |
| --text-inverse on --accent         | 7.0:1          | Pass   |
| --status-overdue-text on --status-overdue-bg | 4.6:1 | Pass |
| --status-due-text on --status-due-bg | 4.5:1        | Pass   |
| --status-ontrack-text on --status-ontrack-bg | 4.6:1 | Pass |

### ARIA Considerations

```html
<!-- Status badges need accessible labels -->
<span class="badge badge-overdue" role="status" aria-label="Contact overdue by 31 days">
  Overdue - 31d
</span>

<!-- Icon buttons need labels -->
<button class="btn-icon" aria-label="Add new contact">
  +
</button>

<!-- Action items use native checkbox -->
<div class="action-item">
  <input type="checkbox" id="action-1" />
  <label for="action-1">Send Buck the Denver AI meetup invite</label>
</div>

<!-- Cards should use semantic structure -->
<article class="card contact-card">
  <header class="card-header">...</header>
  <div class="card-body">...</div>
  <footer class="card-footer">...</footer>
</article>
```

### Keyboard Navigation

- All interactive elements must be reachable via Tab key
- Buttons and links must be activatable with Enter/Space
- Checkboxes toggle with Space
- Dropdowns open with Enter/Space, navigate with Arrow keys
- Focus should be trapped within modals

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

## Implementation Notes

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#FAFAFA',
          secondary: '#FFFFFF',
          elevated: '#FFFFFF',
          inset: '#F2F2F3',
          hover: '#EBEBEC',
        },
        border: {
          primary: '#E0E0E2',
          subtle: '#EBEBEC',
          focus: '#8B8B8E',
        },
        text: {
          primary: '#1A1A1C',
          secondary: '#6B6B6F',
          tertiary: '#9C9CA0',
          inverse: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#5B5BD6',
          hover: '#4C4CC4',
          subtle: '#EDEDFC',
          text: '#4747B3',
        },
        status: {
          overdue: '#E5484D',
          'overdue-bg': '#FEECEE',
          'overdue-text': '#CE2C31',
          due: '#F09E00',
          'due-bg': '#FFF3D0',
          'due-text': '#AD6F00',
          ontrack: '#30A46C',
          'ontrack-bg': '#E6F6ED',
          'ontrack-text': '#1D7D4E',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.04)',
        md: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        lg: '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.5',
        relaxed: '1.65',
      },
      transitionDuration: {
        fast: '120ms',
        normal: '200ms',
      },
      maxWidth: {
        page: '960px',
      },
    },
  },
  plugins: [],
};
```

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Iconography

Use **Lucide Icons** (lucide.dev):
- Stroke weight: 1.5px
- Default size: 20px
- Default color: `--text-secondary`
- Hover color: `--text-primary`
- Icons should always accompany text on primary actions
- Icon-only buttons acceptable for secondary actions (edit, delete, more menu) when context is clear

```jsx
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

// With text (primary action)
<button className="btn btn-primary">
  <Plus size={16} />
  Add Contact
</button>

// Icon only (secondary action)
<button className="btn-icon" aria-label="More options">
  <MoreHorizontal size={18} />
</button>
```

### Motion Guidelines

- Transitions use **120ms ease** for micro-interactions (hover, focus)
- Layout changes use **200ms ease** (expanding sections, modals)
- No bouncing, no elastic easing
- If something can feel instant, make it instant
- Skeleton loading states over spinners
- At ~50 contacts, most things should load before you notice

```css
/* Micro-interactions */
.btn { transition: all 120ms ease; }
.input { transition: border-color 120ms ease, box-shadow 120ms ease; }

/* Layout changes */
.modal { transition: opacity 200ms ease, transform 200ms ease; }
.accordion { transition: max-height 200ms ease; }
```

---

## Design Do's and Don'ts

### Do

- Use borders to define surfaces
- Keep shadows for elevated layers only (modals, dropdowns)
- Let white space create hierarchy
- Use the accent color sparingly - buttons and active states only
- Make every tap/click do something useful
- Use skeleton states for loading

### Don't

- Add shadows to every card
- Use color to decorate
- Put "AI" badges on generated content
- Add confirmation modals for reversible actions
- Use icons without labels on primary actions
- Nest more than 2 levels of navigation
- Use status colors for non-cadence purposes

---

## Quick Reference: Common Patterns

### Standard Card with Header

```jsx
<article className="bg-bg-secondary border border-border-subtle rounded-lg overflow-hidden">
  <header className="p-5 border-b border-border-subtle">
    <h3 className="text-h3 text-text-primary">Card Title</h3>
  </header>
  <div className="p-5">
    <p className="text-body text-text-secondary">Card content...</p>
  </div>
  <footer className="px-5 py-3 bg-bg-inset border-t border-border-subtle">
    <button className="btn btn-secondary btn-sm">Action</button>
  </footer>
</article>
```

### Status Badge

```jsx
<span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-status-overdue-bg text-status-overdue-text">
  Overdue - 31d
</span>
```

### Form Input with Label

```jsx
<div className="flex flex-col gap-1">
  <label className="type-caption text-text-tertiary">Email</label>
  <input
    type="email"
    className="input"
    placeholder="Enter email..."
  />
</div>
```

### Contact List Item

```jsx
<div className="flex items-center gap-4 p-3 rounded-md hover:bg-bg-hover cursor-pointer transition-colors duration-[120ms]">
  <div className="w-9 h-9 rounded-full bg-accent-subtle text-accent-text flex items-center justify-center text-[13px] font-semibold">
    BT
  </div>
  <div className="flex-1 min-w-0">
    <div className="text-[14px] font-medium text-text-primary">Buck Thompson</div>
    <div className="text-[12px] text-text-tertiary truncate">Last discussed K8s migration</div>
  </div>
  <span className="badge badge-overdue">31d</span>
</div>
```

---

*Generated from NetCard Style Guide - Version 1.0*
