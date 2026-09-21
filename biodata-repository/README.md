# Biodata Repository

A simple, public repository for matrimonial biodata PDFs. People can upload
a biodata (gender + age + PDF), and anyone can browse, filter, view and
download published biodatas. There are no accounts, no matchmaking, no
chat, and no approval queue — an upload becomes visible immediately.

## What it stores

The database intentionally stores almost nothing:

| Column       | Meaning                          |
| ------------ | --------------------------------- |
| `id`         | Unique ID                         |
| `gender`     | `male` or `female`                |
| `age`        | 18–70                              |
| `file_url`   | Public URL of the uploaded PDF     |
| `created_at` | Upload timestamp                   |

No name, location, religion, caste, profession, education, salary, height
or horoscope fields exist — that information only lives inside the PDF
itself, which visitors open/download to read.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Supabase** — Postgres database + file storage
- Deploy target: **Vercel** (free tier)

## Project structure

```
src/
  app/
    page.tsx                  Homepage
    upload/page.tsx           Upload form (client component)
    biodatas/page.tsx         Browse + filter list
    biodatas/[id]/page.tsx    View one biodata + report form
    api/upload/route.ts       Server-side upload handler (validates + writes)
    api/report/route.ts       Server-side report handler
  components/                 Navbar, Footer, BiodataCard, filters, report form
  lib/supabase/client.ts      Browser Supabase client (anon key, read-only)
  lib/supabase/admin.ts       Server-only Supabase client (service role key)
  lib/validation.ts           Shared validation rules (file size, age range, ...)
  types/biodata.ts            Shared TypeScript types
supabase/schema.sql           Database tables, RLS policies, storage bucket
```

### Why an API route for uploads instead of writing from the browser?

The anon key is public by design — it's shipped to every visitor's
browser, and Row Level Security (RLS) decides what it's allowed to do. To
keep RLS dead simple (public **read-only** access), all writes (uploading
a biodata, submitting a report) go through Next.js API routes
(`/api/upload`, `/api/report`) that run only on the server. Those routes
use the **service role key**, which is never sent to the browser, and do
their own validation (gender, age range, file type, file size, and a PDF
"magic bytes" check) before touching the database or storage. This is a
standard, beginner-friendly pattern: public key = read-only in the
browser, secret key = all writes, server-side only.

## 1. Install

```bash
npm install
```

## 2. Configure Supabase

You need a free Supabase project. This step requires you to do a few
things in your browser — here's exactly what to do.

**1. Create a project**
- Go to https://supabase.com and sign up / log in.
- Click **New project**, give it a name (e.g. `biodata-repository`), set a
  database password (save it somewhere), pick a region, and create it.
  Wait ~1–2 minutes for it to finish provisioning.

**2. Run the database schema**
- In your Supabase project, open **SQL Editor** (left sidebar) → **New query**.
- Open `supabase/schema.sql` from this repo, copy its entire contents, paste
  it into the SQL editor, and click **Run**.
- This creates the `biodatas` and `reports` tables with Row Level Security
  enabled, and it also creates the `biodatas` storage bucket (public) if it
  doesn't already exist.

**3. Double-check the storage bucket**
- Open **Storage** (left sidebar). You should see a bucket named `biodatas`.
- Click it → **Configuration** and confirm **Public bucket** is turned ON.
  (If the bucket isn't there for some reason, click **New bucket**, name it
  exactly `biodatas`, and toggle **Public bucket** on.)

**4. Copy your API keys**
- Open **Settings** (left sidebar, gear icon) → **API**.
- You need three values:
  - **Project URL** → copy it.
  - **anon / public key** → copy it.
  - **service_role key** → click reveal, copy it. **Keep this secret** —
    never put it in frontend code or commit it to GitHub.

**5. Paste them into your local env file**
- In the `biodata-repository` folder, copy `.env.local.example` to
  `.env.local`:
  ```bash
  cp .env.local.example .env.local
  ```
- Open `.env.local` and paste in the three values:
  ```
  NEXT_PUBLIC_SUPABASE_URL=<your Project URL>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon/public key>
  SUPABASE_SERVICE_ROLE_KEY=<your service_role key>
  ```
- `.env.local` is already listed in `.gitignore`, so it will never be
  committed.

## 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000. You should be able to:

- Visit the homepage.
- Go to **Upload**, pick a gender, enter an age (18–70), attach a PDF
  ≤ 1 MB, and publish it.
- Go to **Browse Biodatas** and see it appear immediately, with working
  gender/age filters.
- Open the biodata's page, use **View PDF** / **Download PDF**, and submit
  a test report.

## 4. Push to GitHub

If you haven't already connected this project to a GitHub repo:

```bash
git add .
git commit -m "Add Biodata Repository MVP"
git push -u origin <your-branch-name>
```

(If this project already lives inside an existing repo/branch, just
`git add`, `commit`, and `push` as usual.)

## 5. Deploy to Vercel (free)

1. Go to https://vercel.com and sign up / log in with your GitHub account.
2. Click **Add New... → Project**, and import this GitHub repository.
3. Since this app lives in the `biodata-repository` subfolder, set
   **Root Directory** to `biodata-repository` in the import screen.
4. Under **Environment Variables**, add the same three variables from your
   `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**. Vercel will build and give you a free `*.vercel.app`
   URL — that's your live site. No domain purchase needed.

Any time you push new commits to the connected branch, Vercel redeploys
automatically.

## Notes on scope

This is intentionally minimal by design:

- No login/accounts, no matching, no chat, no favorites, no payments.
- No moderation queue — publishing is instant; the **Report this biodata**
  feature lets visitors flag a listing, and reports are stored privately
  (visible only to you, in the Supabase dashboard → Table Editor →
  `reports`) for you to review and delete biodatas manually if needed.
- The only stored profile fields are gender and age — everything else the
  visitor learns comes from opening the PDF itself, which is explained to
  uploaders before they publish.
