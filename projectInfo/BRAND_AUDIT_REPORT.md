# NetCard Brand Audit Report

**Date:** February 10, 2026
**Auditor:** Brand Guardian
**Scope:** UI copy, messaging, and brand consistency across authentication, dashboard, and core application screens

---

## Executive Summary

Overall, the RoloDex/NetCard implementation demonstrates strong alignment with brand guidelines in several areas, particularly visual structure and tone. However, there are notable inconsistencies that dilute the brand's precision and warmth. The primary issues fall into three categories:

1. **Brand Name Inconsistency** - The app uses "RoloDex" in implementation while brand guidelines specify "NetCard"
2. **Voice Violations** - Several instances of verbose or off-brand copy that conflict with the "Concise" and "Direct" voice principles
3. **Empty State Messaging** - Some empty states miss the inviting tone or fail to provide clear next actions

**Compliance Score:** 72/100

---

## 1. Critical Issues

### 1.1 Brand Name Mismatch

**Severity:** Critical
**Locations:**
- `/Users/ericschneider/Projects/Cursor/RoloDex/app/(auth)/layout.tsx` (line 36-37)
- `/Users/ericschneider/Projects/Cursor/RoloDex/components/layout/Sidebar.tsx` (line 24)
- `/Users/ericschneider/Projects/Cursor/RoloDex/app/(auth)/layout.tsx` (line 4-5)

**Current Copy:**
```tsx
<span className="text-h2 text-text-primary">RoloDex</span>
```
```tsx
title: 'RoloDex - Authentication',
description: 'Sign in to your RoloDex account',
```

**Issue:** Brand guidelines establish "NetCard" as the product name. Using "RoloDex" creates brand fragmentation and confuses identity.

**Recommendation:** Standardize all instances to "NetCard" or formally update brand guidelines if "RoloDex" is the intended final name.

---

### 1.2 "Welcome back" Greeting on Dashboard

**Severity:** High
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/app/(app)/dashboard/page.tsx` (line 13-14)

**Current Copy:**
```tsx
description={`Welcome back, ${user?.email}`}
```

**Issue:** Brand guidelines explicitly state under "Reduce to Essentials":
> No "Welcome back, [Name]!" headers

This directly violates the design principle. The greeting adds no functional value and conflicts with the "Quiet" personality.

**Recommended Rewrite:** Remove the description entirely, or if context is needed:
```tsx
// Option 1: Remove description
<PageHeader title="Dashboard" />

// Option 2: Use functional description
<PageHeader
  title="Dashboard"
  description="3 contacts to reach this week"
/>
```

---

### 1.3 Verbose Empty State Copy

**Severity:** Medium
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/app/(app)/dashboard/page.tsx` (lines 17-19)

**Current Copy:**
```tsx
Your contacts and nudges will appear here once we finish building the app.
```

**Issue:** This is developer-facing language, not user-facing. It's also verbose and doesn't follow the empty state pattern of "Brief description + optional action."

**Recommended Rewrite:**
```tsx
No nudges yet. Add contacts to see who needs attention.
```

---

## 2. Medium Priority Issues

### 2.1 Verbose Forgot Password Description

**Severity:** Medium
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/components/auth/ForgotPasswordForm.tsx` (lines 43-46)

**Current Copy:**
```tsx
Enter your email address and we'll send you a link to reset your password.
```

**Issue:** This is helpful but more verbose than brand voice requires. Can be shortened without losing meaning.

**Recommended Rewrite:**
```tsx
We'll send a reset link to your email.
```

---

### 2.2 Password Placeholder Redundancy

**Severity:** Low-Medium
**Locations:**
- `/Users/ericschneider/Projects/Cursor/RoloDex/components/auth/LoginForm.tsx` (line 90)
- `/Users/ericschneider/Projects/Cursor/RoloDex/components/auth/ResetPasswordForm.tsx` (line 121)

**Current Copy:**
```tsx
placeholder="Enter your password"
placeholder="Confirm your new password"
```

**Issue:** Placeholders should describe what goes there, not instruct the user to "enter" something. The field label already provides context.

**Recommended Rewrites:**
```tsx
// LoginForm.tsx - remove placeholder entirely, label is sufficient
// Or use a format hint if helpful:
placeholder="********"

// ResetPasswordForm.tsx
placeholder="Re-enter password"
```

---

### 2.3 Contacts Page Description

**Severity:** Medium
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/app/(app)/contacts/page.tsx` (line 9)

**Current Copy:**
```tsx
description="Manage your personal and professional network."
```

**Issue:** This reads like marketing copy, not product UI. Brand guidelines advise against marketing language in UI.

**Recommended Rewrite:**
```tsx
// Option 1: Remove entirely (preferred - reduce to essentials)
<PageHeader title="Contacts" />

// Option 2: Functional description
<PageHeader title="Contacts" description="47 contacts" />
```

---

### 2.4 Settings Page Empty State

**Severity:** Medium
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/app/(app)/settings/page.tsx` (lines 15-18)

**Current Copy:**
```tsx
<p className="type-body text-text-secondary mb-2">Settings coming soon</p>
<p className="type-small text-text-tertiary">
  Account settings and preferences will be available here.
</p>
```

**Issue:** "Coming soon" is developer-facing language. Two lines of explanatory text violates "Reduce to Essentials."

**Recommended Rewrite:**
```tsx
<p className="type-body text-text-secondary">
  Account and notification settings.
</p>
```

Or simply remove the empty state content entirely until the feature exists.

---

### 2.5 Contacts Empty State

**Severity:** Low-Medium
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/app/(app)/contacts/page.tsx` (lines 15-18)

**Current Copy:**
```tsx
<p className="type-body text-text-secondary mb-2">No contacts yet</p>
<p className="type-small text-text-tertiary">
  Your contacts will appear here once you add them.
</p>
```

**Issue:** Close to brand guidelines, but missing the action CTA. Brand guidelines show empty state pattern as: "No contacts yet. Add your first one to get started."

**Recommended Rewrite:**
```tsx
<p className="type-body text-text-secondary mb-4">
  No contacts yet. Add your first one to get started.
</p>
<button className="...">Add Contact</button>
```

---

### 2.6 Success Message Verbosity

**Severity:** Low
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/components/auth/SignupForm.tsx` (lines 43-46)

**Current Copy:**
```tsx
'Check your email for a confirmation link to complete your registration.'
```

**Issue:** Slightly verbose. "Complete your registration" is unnecessary context.

**Recommended Rewrite:**
```tsx
'Check your email for a confirmation link.'
```

---

### 2.7 Reset Password Success Message

**Severity:** Low
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/components/auth/ResetPasswordForm.tsx` (line 44)

**Current Copy:**
```tsx
'Your password has been updated successfully.'
```

**Issue:** Verbose. "Successfully" is unnecessary - the success state already conveys this.

**Recommended Rewrite:**
```tsx
'Password updated.'
```

---

## 3. Low Priority Issues

### 3.1 404 Page Copy

**Severity:** Low
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/app/not-found.tsx` (lines 9-10)

**Current Copy:**
```tsx
<h1 className="type-h2 text-text-primary mb-2">Page not found</h1>
<p className="type-body text-text-secondary max-w-md mb-8">
  The page you're looking for doesn't exist or has been moved.
</p>
```

**Issue:** Good but slightly verbose. The second sentence adds minimal value.

**Recommended Rewrite:**
```tsx
<h1 className="type-h2 text-text-primary mb-2">Page not found</h1>
<p className="type-body text-text-secondary max-w-md mb-8">
  This page doesn't exist.
</p>
```

---

### 3.2 Button with Icon on Primary Action

**Severity:** Low
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/app/not-found.tsx` (lines 12-18)

**Current Copy:**
```tsx
<Link ...>
  <Home className="w-4 h-4" />
  Back to Dashboard
</Link>
```

**Issue:** Brand guidelines state: "No icons on buttons where text is clear." The Home icon is decorative here - "Back to Dashboard" is self-explanatory.

**Recommended Rewrite:**
```tsx
<Link
  href="/dashboard"
  className="..."
>
  Go to Dashboard
</Link>
```

---

### 3.3 Error State Icon

**Severity:** Low
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/components/ui/ErrorState.tsx` (line 29)

**Current Copy:**
```tsx
<RefreshCw className="w-4 h-4" />
Try again
```

**Issue:** Same as above - the refresh icon is decorative when paired with "Try again" text.

**Recommended Rewrite:**
```tsx
Try again
```

---

## 4. Examples of Good Copy (Keep These)

The following instances demonstrate excellent brand alignment:

### 4.1 Login Form Title
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/components/auth/LoginForm.tsx` (line 49)
```tsx
<h1 className="type-h2 text-text-primary mb-6 text-center">Welcome back</h1>
```
**Why it works:** Warm, concise, human. Sets the right emotional tone without being verbose.

### 4.2 Create Account Button
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/components/auth/SignupForm.tsx` (line 188)
```tsx
'Create account'
```
**Why it works:** Verb + object pattern. Clear, direct action.

### 4.3 Forgot Password Link
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/components/auth/LoginForm.tsx` (line 107)
```tsx
Forgot password?
```
**Why it works:** Concise, conversational, no "your" needed.

### 4.4 Email Placeholder
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/components/auth/LoginForm.tsx` (line 69)
```tsx
placeholder="you@example.com"
```
**Why it works:** Shows format without instructing. Lowercase, casual, human.

### 4.5 Password Hint
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/components/auth/SignupForm.tsx` (line 121)
```tsx
Must be at least 6 characters
```
**Why it works:** Direct validation requirement. No "please" or "should."

### 4.6 Error State Default
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/components/ui/ErrorState.tsx` (lines 13-14)
```tsx
title = 'Something went wrong',
message = 'An unexpected error occurred. Please try again.',
```
**Why it works:** Follows the "What went wrong + what to do" pattern. Clear, actionable.

### 4.7 Auth Footer Tagline
**Location:** `/Users/ericschneider/Projects/Cursor/RoloDex/app/(auth)/layout.tsx` (line 45)
```tsx
Personal Networking CRM
```
**Why it works:** Descriptive, not marketing. Simple category identifier.

### 4.8 Loading States
**Locations:** All auth forms
```tsx
'Signing in...'
'Creating account...'
'Sending reset link...'
'Updating password...'
```
**Why they work:** Present progressive tense, concise, no exclamation marks or excess enthusiasm.

---

## 5. Brand Personality Assessment

| Trait | Score | Notes |
|-------|-------|-------|
| **Precise** | 7/10 | Most elements serve a purpose, but some decorative icons and verbose copy dilute precision |
| **Quiet** | 6/10 | "Welcome back" header violates quiet principle; some states are too explanatory |
| **Warm** | 8/10 | Good emotional tone in auth flows; empty states could be more inviting |
| **Fast** | 9/10 | Loading states implemented well; optimistic patterns in place |

---

## 6. Recommendations Summary

### Immediate Actions (Critical/High)
1. Resolve brand name: Decide between "NetCard" and "RoloDex" and standardize
2. Remove "Welcome back, [email]" from dashboard
3. Replace developer-facing empty state on dashboard

### Short-term Actions (Medium)
4. Condense verbose descriptions (Forgot Password, Settings)
5. Add action CTAs to empty states (Contacts page)
6. Remove or simplify page descriptions that read as marketing copy

### Polish Actions (Low)
7. Remove decorative icons from primary action buttons
8. Shorten success messages to minimum viable confirmation
9. Simplify 404 page copy

---

## 7. Copy Style Guide Quick Reference

Based on this audit, here's a quick reference for future copy:

| Context | Pattern | Example |
|---------|---------|---------|
| Page titles | Single word or short phrase | "Dashboard", "Contacts", "Settings" |
| Page descriptions | Functional data or remove | "47 contacts", remove if decorative |
| Empty states | Brief + action | "No contacts yet. Add your first one to get started." |
| Success messages | 2-3 words | "Password updated.", "Contact added." |
| Error messages | Problem + action | "Couldn't save. Check your connection and try again." |
| Button labels | Verb + object | "Add Contact", "Save Note" |
| Loading states | Gerund + ellipsis | "Saving...", "Loading..." |
| Placeholders | Format hint or remove | "you@example.com", none for password |

---

## 8. Checklist for Future Development

Use this checklist when adding new UI copy:

- [ ] Does every word earn its place? (Remove anything that doesn't change meaning)
- [ ] Is the action clear within 3 seconds?
- [ ] Does it follow Verb + Object pattern for buttons?
- [ ] Are empty states inviting, not apologetic?
- [ ] Does it avoid words-to-avoid list? (smart, powerful, seamless, etc.)
- [ ] Is AI functionality invisible? (No "AI-generated" labels)
- [ ] Would I say this to a busy colleague?
- [ ] Does it follow sentence case for labels?
- [ ] Are icons functional, not decorative?
- [ ] Is the brand name consistent?

---

*Report generated as part of brand consistency audit. For questions about brand guidelines, refer to `/Users/ericschneider/Projects/Cursor/RoloDex/projectInfo/BRAND_GUIDELINES.md`*
