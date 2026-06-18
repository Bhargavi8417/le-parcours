# Le Parcours

🔗 **Live demo:** https://le-parcours-chi.vercel.app

A full-stack web application for an independent Paris-based relocation consultant helping international students move to France. Students manage their relocation journey; the admin (consultant) manages services, bookings, accommodations, and knowledge base articles.

## Why I built it

I noticed someone running an independent service helping students relocate to France struggling to manage client information, scattered documents, and accommodation details manually across spreadsheets and messages. I built Le Parcours as a single platform to organise the entire journey — giving students a clear, structured dashboard from application to settlement, and giving the consultant one place to manage everything.

## Try the live demo

| Role | Email | Password |
|---|---|---|
| Student | demo.student@leparcours.com | demo@123 |
| Admin | demo.admin@leparcours.com | demo@123 |

The admin account gives full access to the admin panel (bookings, students, services, articles, accommodations). The student account shows the full student journey dashboard.

---

## Features

**Student portal**
- Journey tracker — 5-stage progress (Application → Campus France → Visa → Arrival → Settlement)
- Service catalog — browse and book pre-arrival, post-arrival, settlement, and miscellaneous services
- Document checklist — per-stage document tracking with file uploads
- Accommodations — browse available Paris housing by neighbourhood with photo carousels
- Knowledge base — markdown guides filterable by stage
- Bilingual — full English/French toggle (cookie-based, no URL restructuring)

**Admin panel**
- Overview dashboard with live stats
- Bookings management — update status, add internal notes
- Student management — edit journey progress and add per-stage notes
- Services CRUD — create/edit/delete/toggle services with bilingual fields
- Articles editor — create/edit markdown knowledge base articles in English and French
- Accommodations manager — manage locations, listings, photo uploads/deletions, availability toggles

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Auth | Supabase Auth (email/password) |
| Database | Supabase (Postgres, Row Level Security) |
| Storage | Supabase Storage |
| i18n | next-intl v4 (cookie-based locale) |
| Deployment | Vercel |

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

---

## Local development setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd webapp
npm install
```

### 2. Configure environment variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find these values in your Supabase project under **Project Settings → API**.

> **Never commit `.env.local`** — it's already in `.gitignore`. The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security; keep it server-side only.

### 3. Set up the database

In the Supabase Dashboard, open **SQL Editor** and run the entire contents of `supabase/schema.sql`. This creates all 12 tables, enums, RLS policies, triggers, storage bucket policies, and seeds initial data (services, document templates, Paris locations).

### 4. Create Supabase Storage buckets

In the Supabase Dashboard, go to **Storage** and create four buckets:

| Bucket | Public? | Purpose |
|---|---|---|
| `documents` | No (private) | Student document uploads |
| `accommodations` | Yes | Accommodation photos |
| `articles` | Yes | Article cover images |
| `avatars` | Yes | Student profile photos |

Then go to **Storage → Policies** and add the following policies for each public bucket (accommodations, articles, avatars):
- **SELECT**: `true` (public reads)
- **INSERT/UPDATE/DELETE**: `auth.role() = 'authenticated'`

For the `documents` bucket, restrict to the owning student:
- **SELECT**: `auth.uid()::text = (storage.foldername(name))[1]`
- **INSERT**: same

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Create your admin account

1. Sign up on the app with the email you want to use as admin.
2. In Supabase Dashboard → **SQL Editor**, run:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your@email.com';
```

3. Sign out and sign back in — you will land directly on `/admin/dashboard`.

---

## Project structure

```
webapp/
├── app/
│   ├── (auth)/          # Login, signup pages
│   ├── (student)/       # Protected student portal routes
│   │   ├── dashboard/
│   │   ├── services/
│   │   ├── journey/
│   │   ├── documents/
│   │   ├── bookings/
│   │   ├── accommodations/
│   │   ├── guides/
│   │   └── profile/
│   ├── (admin)/admin/   # Protected admin routes (role=admin required)
│   │   ├── dashboard/
│   │   ├── bookings/
│   │   ├── inquiries/
│   │   ├── students/
│   │   ├── services/
│   │   ├── articles/
│   │   └── accommodations/
│   └── page.tsx         # Public landing page
├── components/
│   ├── admin/           # Admin-only components
│   ├── landing/         # Landing page components
│   ├── student/         # Student portal components
│   └── ui/             # Shared UI primitives
├── lib/
│   ├── actions/         # Server Actions (student + admin mutations)
│   ├── supabase/        # Supabase client helpers + middleware
│   └── utils.ts         # Utility functions and constants
├── messages/            # i18n translation files (en.json, fr.json)
├── i18n/                # next-intl configuration
├── types/               # TypeScript types
├── supabase/
│   └── schema.sql       # Full database schema
└── proxy.ts             # Auth session refresh + route protection
```

---

## Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js — no framework settings needed

### 3. Set environment variables

In Vercel → Project → **Settings → Environment Variables**, add:

```
NEXT_PUBLIC_SUPABASE_URL       = https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY  = your-anon-key
SUPABASE_SERVICE_ROLE_KEY      = your-service-role-key
NEXT_PUBLIC_APP_URL            = https://your-vercel-domain.vercel.app
```

Set all three to **Production**, **Preview**, and **Development** environments.

### 4. Configure Supabase for your production URL

In Supabase → **Authentication → URL Configuration**, set:
- **Site URL**: `https://your-vercel-domain.vercel.app`

### 5. Deploy

Click **Deploy** on Vercel. Your app is live. Subsequent pushes to `main` auto-deploy.

---

## Key decisions

- **Cookie-based locale** — next-intl is configured without URL segments (`/en/...`), so switching language doesn't change the URL
- **Role-based routing** — admins are redirected to `/admin/dashboard` on login and blocked from all student routes at the layout level; students never see any admin UI
- **Admin promotion via SQL** — there is no self-serve admin signup; the consultant manually promotes accounts in the Supabase dashboard
- **Service role key on server only** — all admin mutations use `createAdminClient()` which uses the service role key; it is never exposed to the browser
- **Accommodation carousels** — client component with CSS `translateX` sliding; no external carousel library

---

Built by Bhargavi Akula as a full-stack portfolio project.
