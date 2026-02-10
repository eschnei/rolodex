*Get the app running with auth and a basic data model.*

### REQ 1.1: Project Scaffolding

- Initialize Next.js 14+ app with App Router
- Configure TypeScript, ESLint, Prettier
- Set up Tailwind CSS for styling
- Connect Supabase project (client + server-side helpers)
- Deploy to Vercel with environment variables configured
- Set up a dev, preview, and production environment pipeline

### REQ 1.2: Authentication

- Use email auth provided by supabase
- Protected routes — unauthenticated users redirect to login
- Session persistence across page reloads
- Sign out functionality
- User profile record created in DB on first login (id, email, name, avatar, created_at)

### REQ 1.3: Database Schema

- **users** — id, email, name, avatar_url, digest_time (default 8am), timezone, created_at, updated_at
- **contacts** — id, user_id, first_name, last_name, email, phone, company, role, location, how_we_met, communication_preference (email/text/phone/in-person), personal_intel (text), cadence_days (integer), last_contacted_at, ai_summary (text), created_at, updated_at
- **notes** — id, contact_id, user_id, content (text), note_type (manual/transcript), created_at
- **action_items** — id, contact_id, user_id, description, is_completed (boolean), source_note_id (nullable FK), created_at, completed_at
- Row-level security policies: users can only access their own data
- Indexes on user_id for all tables, contact_id for notes and action_items

### REQ 1.4: App Layout

- Persistent sidebar navigation (collapses to bottom nav on mobile)
- Nav items: Dashboard, Contacts, Settings
- Responsive breakpoints: desktop (1024px+), tablet (768px), mobile (< 768px)
- Loading states and error boundaries at the layout level
- Consistent page container with max-width for readability