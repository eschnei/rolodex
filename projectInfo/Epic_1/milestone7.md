*Make it ready for others to use and contribute to.*

### REQ 7.1: UI/UX Polish

- Consistent color system, typography, and spacing
- Smooth transitions between views (no jarring page reloads)
- Keyboard shortcuts: "N" for new contact, "/" for search, "Esc" to close modals
- Optimistic UI updates for all mutations (feels instant)
- Accessibility pass: proper labels, focus management, sufficient contrast
- Performance: contact list and dashboard render under 1 second

### REQ 7.2: Onboarding

- First-time user flow: welcome screen explaining the core concept in one sentence
- CSV import: upload a CSV with columns mapped to contact fields (name, email, company, etc.), preview before import, handles duplicates by email match
- Option to skip import and add contacts manually
- Guided prompt to connect Gmail after first login

### REQ 7.3: Data Management

- Export all contacts + notes as CSV or JSON from settings
- Bulk actions on contacts list: delete selected, update cadence for selected
- Account deletion: removes all user data from Supabase (GDPR-friendly)

### REQ 7.4: Open Source Packaging

- Public GitHub repo with MIT license
- README: what it is, screenshots/demo GIF, tech stack, one-click deploy to Vercel button
- Setup guide: environment variables needed (Supabase keys, Google OAuth credentials, Anthropic API key)
- .env.example file with all required variables documented
- Contributing guide: how to run locally, PR process, code style expectations
- Issue templates: bug report, feature request
- Demo instance link for people to try without deploying