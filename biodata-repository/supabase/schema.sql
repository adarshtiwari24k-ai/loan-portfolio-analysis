-- Biodata Repository — Supabase schema
--
-- HOW TO USE:
-- 1. Open your Supabase project.
-- 2. Go to "SQL Editor" -> "New query".
-- 3. Paste this whole file and click "Run".
--
-- This creates the two tables the app needs and locks them down with
-- Row Level Security (RLS) so that:
--   * Anyone (using the public "anon" key) can READ published biodatas.
--   * Nobody can INSERT/UPDATE/DELETE directly from the browser — all
--     writes (uploading a biodata, submitting a report) go through the
--     app's server-side API routes, which use the secret "service role"
--     key and therefore bypass RLS entirely. This keeps the public key
--     safe to ship in frontend code while still preventing random people
--     from writing garbage rows straight into your database.
--   * Reports are never publicly readable — only you (via the Supabase
--     dashboard) can see them.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Table: biodatas
-- ---------------------------------------------------------------------
create table if not exists public.biodatas (
  id uuid primary key default gen_random_uuid(),
  gender text not null check (gender in ('male', 'female')),
  age integer not null check (age >= 18 and age <= 70),
  file_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists biodatas_created_at_idx on public.biodatas (created_at desc);
create index if not exists biodatas_gender_idx on public.biodatas (gender);
create index if not exists biodatas_age_idx on public.biodatas (age);

alter table public.biodatas enable row level security;

drop policy if exists "Public can read biodatas" on public.biodatas;
create policy "Public can read biodatas"
  on public.biodatas
  for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policy is created on purpose: uploads happen
-- through the /api/upload route using the service role key.

-- ---------------------------------------------------------------------
-- Table: reports
-- ---------------------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  biodata_id uuid not null references public.biodatas (id) on delete cascade,
  reason text not null check (
    reason in ('spam', 'inappropriate_content', 'privacy_concern', 'other')
  ),
  created_at timestamptz not null default now()
);

create index if not exists reports_biodata_id_idx on public.reports (biodata_id);

alter table public.reports enable row level security;

-- No select/insert policies are created: reports are written and read
-- only through the service role key (the /api/report route, and you
-- browsing the "reports" table in the Supabase dashboard).

-- ---------------------------------------------------------------------
-- Storage bucket: biodatas
-- ---------------------------------------------------------------------
-- Prefer creating this from the dashboard (Storage -> New bucket ->
-- name it "biodatas" -> toggle "Public bucket" ON). The insert below is
-- a convenience if you'd rather do it from SQL; it's safe to run either
-- way ("on conflict do nothing" skips it if the bucket already exists).
insert into storage.buckets (id, name, public)
values ('biodatas', 'biodatas', true)
on conflict (id) do nothing;

-- The bucket is public, so files can be read via their public URL
-- without any storage RLS policies. Uploads also go through the
-- service role key (server-side), so no storage write policies are
-- needed either.
