# Milestone 1: Foundation - Development Tasks

## Milestone Summary

Get the NetCard app running with authentication and a basic data model. This milestone establishes the project scaffolding (Next.js 14+ with App Router), Supabase integration for database and auth, Vercel deployment pipeline, and the core application layout with responsive navigation.

**Key Deliverables:**
- Next.js 14+ app with TypeScript, Tailwind CSS, and ESLint/Prettier
- Supabase auth with email login and protected routes
- Complete database schema with RLS policies
- Responsive app layout with sidebar/bottom navigation

---

## Tasks

### M1-T01: Initialize Next.js Project with Core Dependencies

**Description:**
Create a new Next.js 14+ project using the App Router. Configure TypeScript with strict mode, ESLint, and Prettier for code quality. Install and configure Tailwind CSS with the NetCard design system tokens.

**Acceptance Criteria:**
- [ ] Next.js 14+ project initialized with App Router (`app/` directory structure)
- [ ] TypeScript configured with strict mode enabled
- [ ] ESLint configured with Next.js recommended rules
- [ ] Prettier configured with consistent formatting rules
- [ ] Tailwind CSS installed and configured with design system tokens from DESIGN_SYSTEM.md
- [ ] JetBrains Mono font loaded via Google Fonts
- [ ] Project runs locally with `npm run dev`

**Dependencies:** None

**Files to Create/Modify:**
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Prettier configuration
- `tailwind.config.js` - Tailwind with NetCard design tokens (colors, spacing, typography)
- `app/globals.css` - Base styles and CSS variables from DESIGN_SYSTEM.md
- `app/layout.tsx` - Root layout with font loading
- `next.config.js` - Next.js configuration

**Technical Notes:**
- Use `npx create-next-app@latest` with TypeScript and App Router options
- Include all CSS variables from DESIGN_SYSTEM.md in globals.css
- Configure Tailwind extend properties for NetCard custom colors, spacing, and typography
- Font loading: preconnect to fonts.googleapis.com and load JetBrains Mono (400, 500, 600, 700)

---

### M1-T02: Configure Supabase Project Connection

**Description:**
Set up Supabase project connection with both client-side and server-side helpers. Configure environment variables and create utility functions for database access.

**Acceptance Criteria:**
- [ ] Supabase project created and connected
- [ ] Environment variables configured for Supabase URL and anon key
- [ ] Supabase client utility created for client-side usage
- [ ] Supabase server utility created for server components/actions
- [ ] `.env.local` file created with required variables (gitignored)
- [ ] `.env.example` file created documenting required variables
- [ ] Connection verified with a simple test query

**Dependencies:** M1-T01

**Files to Create/Modify:**
- `.env.local` - Environment variables (do not commit)
- `.env.example` - Template for required environment variables
- `.gitignore` - Ensure .env.local is ignored
- `lib/supabase/client.ts` - Browser client utility
- `lib/supabase/server.ts` - Server-side client utility
- `lib/supabase/middleware.ts` - Middleware helpers for auth

**Technical Notes:**
- Use `@supabase/ssr` package for Next.js 14 App Router compatibility
- Server client should handle cookies for session management
- Create typed client using generated types (added in M1-T03)

---

### M1-T03: Create Database Schema

**Description:**
Create the complete database schema in Supabase with all tables, relationships, indexes, and row-level security policies. Generate TypeScript types from the schema.

**Acceptance Criteria:**
- [ ] `users` table created with all fields: id, email, name, avatar_url, digest_time, timezone, created_at, updated_at
- [ ] `contacts` table created with all fields: id, user_id, first_name, last_name, email, phone, company, role, location, how_we_met, communication_preference, personal_intel, cadence_days, last_contacted_at, ai_summary, created_at, updated_at
- [ ] `notes` table created with all fields: id, contact_id, user_id, content, note_type, created_at
- [ ] `action_items` table created with all fields: id, contact_id, user_id, description, is_completed, source_note_id, created_at, completed_at
- [ ] Foreign key relationships properly defined
- [ ] Indexes created on user_id for all tables, contact_id for notes and action_items
- [ ] RLS policies enabled: users can only access their own data
- [ ] Cascade delete configured: deleting contact removes associated notes and action_items
- [ ] TypeScript types generated and exported

**Dependencies:** M1-T02

**Files to Create/Modify:**
- `supabase/migrations/001_initial_schema.sql` - Complete schema SQL
- `lib/database.types.ts` - Generated TypeScript types
- `lib/types.ts` - Custom type definitions and utilities

**Technical Notes:**
- Use Supabase CLI or dashboard to create migration
- communication_preference should be enum: 'email', 'text', 'phone', 'in-person'
- note_type should be enum: 'manual', 'transcript'
- digest_time default: '08:00:00'
- Generate types with `npx supabase gen types typescript`
- RLS policies should check `auth.uid() = user_id`

---

### M1-T04: Implement Supabase Email Authentication

**Description:**
Set up email-based authentication using Supabase Auth. Create login, signup, and password reset flows. Implement session persistence and sign-out functionality.

**Acceptance Criteria:**
- [ ] Login page with email/password form
- [ ] Signup page with email/password form
- [ ] Password reset flow (forgot password link, reset email, password update page)
- [ ] Session persists across page reloads
- [ ] Sign out functionality works correctly
- [ ] Auth state properly managed throughout the app
- [ ] Loading states during auth operations
- [ ] Error handling for invalid credentials, existing email, etc.

**Dependencies:** M1-T02, M1-T03

**Files to Create/Modify:**
- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/signup/page.tsx` - Signup page
- `app/(auth)/forgot-password/page.tsx` - Forgot password page
- `app/(auth)/reset-password/page.tsx` - Password reset page
- `app/(auth)/layout.tsx` - Auth pages layout (centered, minimal)
- `components/auth/LoginForm.tsx` - Login form component
- `components/auth/SignupForm.tsx` - Signup form component
- `lib/actions/auth.ts` - Server actions for auth operations

**Technical Notes:**
- Use Supabase Auth UI components or custom forms
- Auth pages should have centered, minimal layout
- Use server actions for form submissions
- Redirect to dashboard after successful login
- Store session in cookies using Supabase SSR helpers

---

### M1-T05: Implement Protected Routes and Middleware

**Description:**
Create middleware to protect authenticated routes and redirect unauthenticated users to login. Set up the authenticated app route group.

**Acceptance Criteria:**
- [ ] Middleware intercepts requests to protected routes
- [ ] Unauthenticated users redirected to /login
- [ ] Authenticated users can access protected routes
- [ ] Authenticated users accessing /login redirected to dashboard
- [ ] Session refresh handled in middleware
- [ ] Route groups properly organized: (auth) for public, (app) for protected

**Dependencies:** M1-T04

**Files to Create/Modify:**
- `middleware.ts` - Next.js middleware for route protection
- `app/(app)/layout.tsx` - Protected app layout wrapper
- `lib/supabase/middleware.ts` - Supabase session handling in middleware

**Technical Notes:**
- Use Next.js middleware with Supabase SSR
- Protect all routes under (app) group
- Handle session refresh to prevent expiration issues
- Exclude static assets, API routes as needed from middleware

---

### M1-T06: Create User Profile on First Login

**Description:**
Automatically create a user profile record in the users table when a user signs up or logs in for the first time. Detect timezone from browser.

**Acceptance Criteria:**
- [ ] User profile record created in users table on first authentication
- [ ] Profile includes: id (from auth), email, name (from email prefix initially), timezone (detected)
- [ ] Profile only created if it doesn't already exist
- [ ] Timezone auto-detected from browser on first login
- [ ] User record properly linked via auth.uid()

**Dependencies:** M1-T04, M1-T03

**Files to Create/Modify:**
- `lib/actions/user.ts` - Server actions for user profile management
- `app/(app)/layout.tsx` - Check/create profile on authenticated layout mount
- `lib/utils/timezone.ts` - Timezone detection utility

**Technical Notes:**
- Use `Intl.DateTimeFormat().resolvedOptions().timeZone` for timezone detection
- Create profile as a server action called after login verification
- Use upsert or check-then-insert pattern to avoid duplicates
- Could also use Supabase database function/trigger on auth.users insert

---

### M1-T07: Build Responsive App Layout Shell

**Description:**
Create the main application layout with persistent sidebar navigation for desktop and bottom navigation for mobile. Implement the nav structure with Dashboard, Contacts, and Settings links.

**Acceptance Criteria:**
- [ ] Sidebar navigation on desktop (1024px+) with nav items: Dashboard, Contacts, Settings
- [ ] Bottom navigation bar on mobile (<768px) with same nav items
- [ ] Tablet view (768-1024px) uses collapsible sidebar or bottom nav
- [ ] Active nav item highlighted with accent color
- [ ] Smooth transitions between nav states
- [ ] User avatar/email shown in sidebar with sign-out option
- [ ] Navigation uses Next.js Link for client-side routing
- [ ] Layout follows NetCard design system (colors, spacing, typography)

**Dependencies:** M1-T01, M1-T05

**Files to Create/Modify:**
- `app/(app)/layout.tsx` - Main app layout with sidebar/nav
- `components/layout/Sidebar.tsx` - Desktop sidebar component
- `components/layout/BottomNav.tsx` - Mobile bottom navigation
- `components/layout/NavItem.tsx` - Reusable nav item component
- `components/layout/UserMenu.tsx` - User dropdown with sign out

**Technical Notes:**
- Use Lucide icons for nav items (LayoutDashboard, Users, Settings)
- Sidebar width: 240px on desktop
- Bottom nav height: 64px on mobile
- Use CSS media queries or Tailwind responsive classes
- Implement with CSS transitions for smooth breakpoint changes

---

### M1-T08: Implement Loading States and Error Boundaries

**Description:**
Add loading states for page transitions and error boundaries to catch and display errors gracefully at the layout level.

**Acceptance Criteria:**
- [ ] Loading.tsx files for main routes show skeleton or spinner
- [ ] Error.tsx boundary catches errors and shows recovery UI
- [ ] Global error boundary at root level
- [ ] Loading states use skeleton patterns per design system
- [ ] Error UI provides clear message and retry option
- [ ] Not-found page for 404 errors

**Dependencies:** M1-T07

**Files to Create/Modify:**
- `app/(app)/loading.tsx` - App-level loading state
- `app/(app)/error.tsx` - App-level error boundary
- `app/global-error.tsx` - Global error boundary
- `app/not-found.tsx` - 404 page
- `components/ui/Skeleton.tsx` - Skeleton loading component
- `components/ui/ErrorState.tsx` - Error display component

**Technical Notes:**
- Use React error boundaries via Next.js error.tsx convention
- Skeleton should match the layout of what's loading
- Error boundary should be a client component with 'use client'
- Provide "Try again" button that calls reset() in error boundary

---

### M1-T09: Set Up Vercel Deployment Pipeline

**Description:**
Configure Vercel deployment with environment variables for dev, preview, and production environments. Set up automatic deployments from Git.

**Acceptance Criteria:**
- [ ] Project connected to Vercel
- [ ] Environment variables configured for all environments (dev, preview, production)
- [ ] Automatic deployments on push to main branch
- [ ] Preview deployments for pull requests
- [ ] Production domain configured
- [ ] Build succeeds with no errors
- [ ] All environment variables documented in .env.example

**Dependencies:** M1-T01, M1-T02

**Files to Create/Modify:**
- `vercel.json` - Vercel configuration (if needed)
- `.env.example` - Updated with all required variables
- `README.md` - Deployment instructions

**Technical Notes:**
- Required env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- Set different Supabase projects or same project for different environments
- Enable Vercel analytics if desired
- Ensure build command works: `npm run build`

---

### M1-T10: Create Page Container and Typography Utilities

**Description:**
Create reusable page container component with consistent max-width and padding. Add typography utility classes that match the design system.

**Acceptance Criteria:**
- [ ] PageContainer component with max-width 960px and responsive padding
- [ ] PageHeader component for consistent page titles
- [ ] Typography classes match design system (h1, h2, h3, body, small, caption, mono, overline)
- [ ] All typography uses JetBrains Mono
- [ ] Responsive adjustments for mobile padding

**Dependencies:** M1-T01

**Files to Create/Modify:**
- `components/ui/PageContainer.tsx` - Page wrapper component
- `components/ui/PageHeader.tsx` - Page title component
- `app/globals.css` - Typography utility classes

**Technical Notes:**
- PageContainer: `max-w-[960px] mx-auto px-6 py-16 md:px-4 md:py-10`
- Typography classes should be available as Tailwind utilities or CSS classes
- Follow the exact specifications from DESIGN_SYSTEM.md typography scale

---

## Task Order (Suggested Implementation Sequence)

1. **M1-T01** - Initialize Next.js Project (no dependencies)
2. **M1-T02** - Configure Supabase Connection (depends on T01)
3. **M1-T03** - Create Database Schema (depends on T02)
4. **M1-T10** - Page Container and Typography (depends on T01, can parallel with T02/T03)
5. **M1-T04** - Implement Email Authentication (depends on T02, T03)
6. **M1-T05** - Protected Routes and Middleware (depends on T04)
7. **M1-T06** - Create User Profile on First Login (depends on T04, T03)
8. **M1-T07** - Build App Layout Shell (depends on T01, T05)
9. **M1-T08** - Loading States and Error Boundaries (depends on T07)
10. **M1-T09** - Vercel Deployment (depends on T01, T02, can be done earlier)

**Parallelization Opportunities:**
- T02 and T10 can run in parallel after T01
- T09 can be done any time after T01 and T02

---

## Quality Checklist

- [ ] All components use NetCard design system tokens
- [ ] Mobile responsive design verified on all pages
- [ ] TypeScript strict mode with no type errors
- [ ] ESLint passes with no errors
- [ ] Auth flow works end-to-end (signup, login, logout, password reset)
- [ ] RLS policies verified - users cannot access other users' data
- [ ] Production deployment successful on Vercel
