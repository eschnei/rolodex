# Milestone 7: Polish & Open Source - Development Tasks

## Milestone Summary

Make NetCard ready for others to use and contribute to. This milestone focuses on UI/UX polish, onboarding flow, data management features, and packaging the project for open source release with comprehensive documentation.

**Key Deliverables:**
- UI/UX polish pass with keyboard shortcuts
- Onboarding flow with CSV import
- Data export and account management
- Open source repo setup with documentation
- Demo deployment

**Prerequisite:** Milestones 1-6 completed (all core functionality)

---

## Tasks

### M7-T01: Conduct UI/UX Polish Pass

**Description:**
Comprehensive review and polish of all UI elements. Ensure consistent color system, typography, spacing, and smooth transitions throughout the app.

**Acceptance Criteria:**
- [ ] All components use design system tokens consistently
- [ ] Color usage follows design system rules (status colors only for cadence)
- [ ] Typography matches design system scale
- [ ] Spacing is consistent across all views
- [ ] Smooth transitions between views (no jarring page reloads)
- [ ] Hover states and focus states on all interactive elements
- [ ] Icons consistent (Lucide, 1.5px stroke, correct sizes)
- [ ] No visual bugs or misalignments

**Dependencies:** All previous milestones

**Files to Create/Modify:**
- All component files - review and update as needed
- `app/globals.css` - Ensure all tokens defined
- `tailwind.config.js` - Verify configuration

**Technical Notes:**
- Review each page systematically
- Check against DESIGN_SYSTEM.md specifications
- Test on multiple screen sizes
- Use browser dev tools to verify exact values

---

### M7-T02: Implement Keyboard Shortcuts

**Description:**
Add keyboard shortcuts for common actions to improve power user experience.

**Acceptance Criteria:**
- [ ] "N" opens new contact form
- [ ] "/" focuses search input
- [ ] "Esc" closes modals and popovers
- [ ] Shortcuts work globally (when not in an input)
- [ ] Shortcuts don't interfere with native browser shortcuts
- [ ] Visual hint for shortcuts (optional: keyboard shortcut legend)

**Dependencies:** M7-T01

**Files to Create/Modify:**
- `lib/hooks/useKeyboardShortcuts.ts` - Keyboard handler hook
- `app/(app)/layout.tsx` - Register global shortcuts
- `components/ui/KeyboardHint.tsx` - Optional shortcut hints

**Technical Notes:**
- Use useEffect with document.addEventListener
- Check if event target is input/textarea before triggering
- Consider using a library like `react-hotkeys-hook`
- Prevent default where appropriate

---

### M7-T03: Optimize for Performance

**Description:**
Ensure all views render quickly and feel instant. Contact list and dashboard should render under 1 second.

**Acceptance Criteria:**
- [ ] Contact list renders under 1 second
- [ ] Dashboard renders under 1 second
- [ ] Contact card loads quickly
- [ ] No noticeable lag during interactions
- [ ] Images and assets optimized
- [ ] Bundle size reasonable
- [ ] Lighthouse performance score >90

**Dependencies:** All previous milestones

**Files to Create/Modify:**
- Various - based on performance analysis
- `next.config.js` - Optimization settings

**Technical Notes:**
- Use React DevTools Profiler to identify bottlenecks
- Implement lazy loading where appropriate
- Optimize images with Next.js Image component
- Consider virtualization if lists grow (probably not needed at 50 contacts)
- Minimize client-side JavaScript

---

### M7-T04: Accessibility Audit and Fixes

**Description:**
Conduct accessibility audit and fix issues. Ensure proper labels, focus management, and keyboard navigation.

**Acceptance Criteria:**
- [ ] All interactive elements keyboard accessible
- [ ] Proper ARIA labels on buttons, inputs, and landmarks
- [ ] Focus management in modals (trap focus, return focus on close)
- [ ] Sufficient color contrast (WCAG AA minimum)
- [ ] Screen reader testing (basic)
- [ ] No accessibility errors in Lighthouse
- [ ] Reduced motion support for animations

**Dependencies:** M7-T01

**Files to Create/Modify:**
- All component files - add ARIA attributes as needed
- `app/globals.css` - Reduced motion media query

**Technical Notes:**
- Use axe DevTools browser extension for automated testing
- Test with keyboard-only navigation
- Check contrast ratios against design system spec
- Add role="status" for dynamic content updates

---

### M7-T05: Create Onboarding Welcome Screen

**Description:**
Build a first-time user welcome screen that introduces the core concept and guides users to their first action.

**Acceptance Criteria:**
- [ ] Welcome screen shown on first login
- [ ] Explains core concept in one sentence
- [ ] Options: Import contacts from CSV OR add contacts manually
- [ ] Skip option to go straight to empty app
- [ ] Clean, minimal design matching app aesthetic
- [ ] Only shown once per user

**Dependencies:** M7-T01

**Files to Create/Modify:**
- `app/(app)/onboarding/page.tsx` - Onboarding page
- `components/onboarding/WelcomeScreen.tsx` - Welcome component
- `lib/actions/user.ts` - Track onboarding completion

**Technical Notes:**
- Store onboarding_completed in user profile
- Redirect new users to /onboarding before /dashboard
- One sentence: "NetCard helps you stay connected with your key contacts."
- Large, clear CTA buttons

---

### M7-T06: Implement CSV Import

**Description:**
Build CSV import functionality for bulk contact creation. Allow users to upload a CSV file, map columns, preview, and import.

**Acceptance Criteria:**
- [ ] Upload CSV file via file input
- [ ] Parse CSV and display column headers
- [ ] Map CSV columns to contact fields (name, email, company, etc.)
- [ ] Preview first 5-10 rows before import
- [ ] Handle duplicate detection by email match
- [ ] Import creates contact records
- [ ] Progress indication during import
- [ ] Summary after import (X contacts created, Y skipped as duplicates)

**Dependencies:** M7-T05

**Files to Create/Modify:**
- `components/import/CsvImporter.tsx` - Main import component
- `components/import/ColumnMapper.tsx` - Column mapping UI
- `components/import/ImportPreview.tsx` - Preview component
- `lib/import/csvParser.ts` - CSV parsing utility
- `lib/actions/import.ts` - Server action for bulk creation

**Technical Notes:**
- Use PapaParse or similar for CSV parsing
- Common column names: First Name, Last Name, Email, Company, Title/Role
- Flexible matching: "First Name", "first_name", "FirstName" all map to first_name
- Batch insert for performance

---

### M7-T07: Add Gmail Connection Prompt After Onboarding

**Description:**
After first login/onboarding, prompt users to connect their Gmail for email tracking and digests.

**Acceptance Criteria:**
- [ ] Prompt appears after onboarding or first contact creation
- [ ] Clear explanation of what Gmail connection enables
- [ ] "Connect Gmail" button starts OAuth flow
- [ ] "Skip" option to dismiss
- [ ] Only shown once (or until connected)
- [ ] Privacy assurance messaging

**Dependencies:** M7-T05, M5-T05

**Files to Create/Modify:**
- `components/onboarding/GmailPrompt.tsx` - Prompt component
- `app/(app)/onboarding/gmail/page.tsx` - Dedicated page or modal

**Technical Notes:**
- Messaging: "Connect your Gmail to automatically track email touchpoints and receive daily nudges."
- Privacy: "We only read email dates and subjects - never the content."
- Can be skipped and accessed later via Settings

---

### M7-T08: Implement Data Export

**Description:**
Allow users to export all their contacts and notes as CSV or JSON from settings.

**Acceptance Criteria:**
- [ ] Export option in settings
- [ ] Choose format: CSV or JSON
- [ ] Export includes all contacts with all fields
- [ ] Export includes all notes (associated with contacts)
- [ ] Export includes action items
- [ ] File downloads directly to user's device
- [ ] Clear indication of what's included in export

**Dependencies:** M7-T01

**Files to Create/Modify:**
- `app/(app)/settings/page.tsx` - Export section
- `components/settings/DataExport.tsx` - Export component
- `lib/export/csv.ts` - CSV generation
- `lib/export/json.ts` - JSON generation
- `lib/actions/export.ts` - Data gathering action

**Technical Notes:**
- CSV format: one row per contact with notes as JSON in column
- JSON format: nested structure with contacts containing notes array
- Use Blob and download anchor for client-side download
- Handle large datasets without timeout

---

### M7-T09: Add Bulk Actions to Contact List

**Description:**
Enable selecting multiple contacts and performing bulk operations like delete or update cadence.

**Acceptance Criteria:**
- [ ] Checkbox on each contact list item for selection
- [ ] "Select all" option
- [ ] Bulk action bar appears when items selected
- [ ] Actions: Delete selected, Update cadence for selected
- [ ] Delete: confirmation modal with count
- [ ] Update cadence: dropdown to select new cadence
- [ ] Clear selection after action completes

**Dependencies:** M7-T01

**Files to Create/Modify:**
- `components/contacts/ContactListItem.tsx` - Add checkbox
- `components/contacts/BulkActionBar.tsx` - Bulk actions component
- `lib/actions/contacts.ts` - Bulk action server actions

**Technical Notes:**
- Use React state for selection tracking
- Sticky bulk action bar at top or bottom when items selected
- Confirmation for delete: "Delete X contacts? This cannot be undone."
- Optimistic update or loading state during bulk operations

---

### M7-T10: Implement Account Deletion

**Description:**
Allow users to delete their account and all associated data. GDPR-friendly permanent deletion.

**Acceptance Criteria:**
- [ ] Account deletion option in settings (with warning)
- [ ] Confirmation step with clear explanation of what's deleted
- [ ] Requires typing "DELETE" or similar confirmation
- [ ] Deletes all user data: profile, contacts, notes, action items
- [ ] Revokes Gmail OAuth tokens
- [ ] Signs user out after deletion
- [ ] Redirects to goodbye/confirmation page

**Dependencies:** M7-T01

**Files to Create/Modify:**
- `app/(app)/settings/page.tsx` - Danger zone section
- `components/settings/DeleteAccount.tsx` - Delete account component
- `lib/actions/account.ts` - Account deletion action
- `app/(auth)/deleted/page.tsx` - Post-deletion confirmation page

**Technical Notes:**
- Use database cascade or explicit deletion of all related records
- Consider soft delete with delay (GDPR allows 30-day window)
- Log deletion for audit purposes
- Revoke all OAuth tokens

---

### M7-T11: Create README and Setup Documentation

**Description:**
Write comprehensive README for the GitHub repository. Include project description, screenshots, tech stack, and setup instructions.

**Acceptance Criteria:**
- [ ] README.md with project overview and purpose
- [ ] Screenshots or demo GIF showing key features
- [ ] Tech stack listed (Next.js, Supabase, Anthropic, etc.)
- [ ] One-click "Deploy to Vercel" button
- [ ] Local development setup instructions
- [ ] Environment variable documentation
- [ ] Link to live demo instance

**Dependencies:** All previous tasks

**Files to Create/Modify:**
- `README.md` - Main documentation
- `docs/SETUP.md` - Detailed setup guide
- `public/screenshots/` - Screenshot images

**Technical Notes:**
- Badge for license, deploy status
- Clear step-by-step setup for local dev
- List all required env vars with descriptions
- Include troubleshooting section

---

### M7-T12: Create Environment Variable Template

**Description:**
Create a comprehensive .env.example file documenting all required environment variables.

**Acceptance Criteria:**
- [ ] All required environment variables listed
- [ ] Clear comments explaining each variable
- [ ] Indicates which are required vs optional
- [ ] Grouped by service (Supabase, Google, Anthropic, etc.)
- [ ] No actual secrets in the file

**Dependencies:** All previous milestones

**Files to Create/Modify:**
- `.env.example` - Template file

**Technical Notes:**
- Variables to include:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - ANTHROPIC_API_KEY
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET
  - NEXT_PUBLIC_APP_URL

---

### M7-T13: Create Contributing Guide and Issue Templates

**Description:**
Set up open source contribution guidelines and GitHub issue templates.

**Acceptance Criteria:**
- [ ] CONTRIBUTING.md with guidelines for contributors
- [ ] Code style expectations documented
- [ ] PR process explained
- [ ] Bug report issue template
- [ ] Feature request issue template
- [ ] Local development instructions
- [ ] Testing expectations

**Dependencies:** M7-T11

**Files to Create/Modify:**
- `CONTRIBUTING.md` - Contributing guidelines
- `.github/ISSUE_TEMPLATE/bug_report.md` - Bug template
- `.github/ISSUE_TEMPLATE/feature_request.md` - Feature template
- `.github/PULL_REQUEST_TEMPLATE.md` - PR template

**Technical Notes:**
- Keep guidelines approachable for new contributors
- Include code of conduct reference
- Explain branching strategy
- List areas where contributions are welcome

---

### M7-T14: Add MIT License

**Description:**
Add the MIT license file to make the project officially open source.

**Acceptance Criteria:**
- [ ] LICENSE file with MIT license text
- [ ] Correct year and copyright holder
- [ ] Referenced in README

**Dependencies:** None

**Files to Create/Modify:**
- `LICENSE` - MIT license file
- `README.md` - License badge and reference

**Technical Notes:**
- MIT is permissive and widely understood
- Update year to current year
- Copyright holder: individual or organization

---

### M7-T15: Deploy Demo Instance

**Description:**
Set up a demo deployment that people can try without creating their own instance.

**Acceptance Criteria:**
- [ ] Demo deployed to Vercel (or similar)
- [ ] Demo uses separate Supabase project (or same with demo flag)
- [ ] Demo account available or easy signup
- [ ] Sample data pre-populated for demo account
- [ ] Clear indication that it's a demo
- [ ] Link in README and docs
- [ ] Rate limiting or abuse prevention

**Dependencies:** All previous tasks

**Files to Create/Modify:**
- Vercel project configuration
- `README.md` - Demo link
- Demo seeding script (optional)

**Technical Notes:**
- Consider resetting demo data periodically
- May need to limit API usage (Anthropic costs)
- Clear demo indicator in UI: "Demo Mode"
- Or: just deploy normally and let people create accounts

---

## Task Order (Suggested Implementation Sequence)

1. **M7-T14** - Add MIT License (quick win)
2. **M7-T01** - UI/UX Polish Pass
3. **M7-T04** - Accessibility Audit
4. **M7-T02** - Keyboard Shortcuts
5. **M7-T03** - Performance Optimization
6. **M7-T05** - Create Onboarding Welcome Screen
7. **M7-T06** - CSV Import
8. **M7-T07** - Gmail Connection Prompt
9. **M7-T08** - Data Export
10. **M7-T09** - Bulk Actions
11. **M7-T10** - Account Deletion
12. **M7-T12** - Environment Variable Template
13. **M7-T11** - README and Setup Documentation
14. **M7-T13** - Contributing Guide and Issue Templates
15. **M7-T15** - Demo Instance

**Parallelization Opportunities:**
- T14 can be done immediately
- T01-T04 can be done in parallel by different people
- T11-T13 (documentation) can be done in parallel
- T15 should be last after all polish is complete

---

## Quality Checklist

- [ ] All UI elements match design system
- [ ] Keyboard navigation works throughout
- [ ] Accessibility audit passes (no critical issues)
- [ ] Performance targets met (<1 second renders)
- [ ] Onboarding flow is smooth
- [ ] CSV import handles various formats
- [ ] Data export works for large accounts
- [ ] Account deletion is complete and secure
- [ ] README is clear and comprehensive
- [ ] Demo is accessible and functional
- [ ] All environment variables documented
- [ ] License is correctly applied
