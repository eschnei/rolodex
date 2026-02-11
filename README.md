# ROLO

A personal networking CRM for managing your key relationships. Keep track of contacts, take notes during calls, and never forget to follow up.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/eschnei/rolodex.git
   cd rolodex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

4. **Set up the database**

   Run the SQL migration in your Supabase SQL Editor:
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and run in Supabase Dashboard → SQL Editor

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/eschnei/rolodex)

### Environment Variables

Configure these in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (app)/             # Protected routes (dashboard, contacts, settings)
│   ├── (auth)/            # Auth routes (login, signup, etc.)
│   └── layout.tsx         # Root layout
├── components/
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (Sidebar, BottomNav)
│   └── ui/                # Reusable UI components
├── lib/
│   ├── actions/           # Server actions
│   ├── supabase/          # Supabase client utilities
│   └── utils/             # Utility functions
├── projectInfo/           # Project documentation
│   ├── Epic_1/            # Milestone specs and tasks
│   ├── DESIGN_SYSTEM.md   # Design system reference
│   └── BRAND_GUIDELINES.md # Brand guidelines
└── supabase/
    └── migrations/        # Database migrations
```

## Features (Milestone 1)

- [x] Email authentication (signup, login, password reset)
- [x] Protected routes with middleware
- [x] Responsive layout (sidebar on desktop, bottom nav on mobile)
- [x] User profile with timezone detection
- [x] Loading states and error boundaries
- [x] Database schema with RLS policies

## Coming Soon

- Contact management (create, edit, delete)
- Notes and action items
- AI-powered summaries
- Email digest notifications
- Gmail integration

## License

MIT
