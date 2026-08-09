# Rigora / ریگورا

Rigora is a Next.js PC hardware platform for browsing parts, building systems, reading content, and publishing user-owned hardware advertisements.

## Stack

- Next.js 16 App Router with TypeScript
- React 18 and Mantine 7
- Redux Toolkit and RTK Query
- Supabase Auth, PostgreSQL, Storage, and Row Level Security
- Jest and React Testing Library

## Local Setup

Requirements: Node.js 20.9+ and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Set these values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_WORDPRESS_API` is optional and is retained only for the existing blog comment feature. Never place a Supabase service-role key, database password, or other private credential in a `NEXT_PUBLIC_*` variable.

## Supabase Setup

1. Create a Supabase project.
2. Open **Project Settings > API** and copy the Project URL and Publishable key into `.env.local`.
3. Open **SQL Editor**, paste the complete contents of `supabase/migrations/20260809000000_initial_rigora.sql`, and run it once.
4. Open **Authentication > URL Configuration**.
5. Set the Site URL to `http://localhost:3000` for local development.
6. Add `http://localhost:3000/auth/confirm` and the equivalent production URL to Redirect URLs.
7. In **Authentication > Providers > Phone**, enable phone authentication and configure a supported SMS provider. Rigora uses Supabase phone OTP and does not store passwords or OTP codes.
8. Restart Next.js after changing environment variables.

To grant dashboard moderation access, set a trusted user's Auth `app_metadata.role` to `admin` from the Supabase Dashboard, then have that user sign out and back in to refresh the JWT. Users cannot edit `app_metadata` through the Rigora client. Normal marketplace users do not need this role.

The migration creates `profiles`, `ad_categories`, `ads`, `ad_images`, the public `ad-images` Storage bucket, indexes, timestamps, profile creation trigger, and all RLS/Storage policies. It can also be applied with the Supabase CLI because it uses the standard `supabase/migrations` layout.

## Auth And Ads

The browser and server clients live under `app/_lib/supabase`. `proxy.ts` refreshes auth cookies and redirects unauthenticated requests from protected routes. Supabase Auth is the only user session source; tokens are not manually stored in Redux or local storage.

Public queries return published ads. Authenticated owners can create, read, update, and delete their own ads. New ads begin as pending, and only users with trusted `app_metadata.role = admin` can publish or reject them. Ownership is derived from `supabase.auth.getUser()` and enforced again by PostgreSQL RLS. Images are stored in Supabase Storage and represented by ordered URL records in `ad_images`.

## Checks

```bash
npm run prettier:check
npm run typecheck
npm run jest
npm run build
```
