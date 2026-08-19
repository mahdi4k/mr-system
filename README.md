# Rigora / ریگورا

Rigora is a Next.js PC hardware platform for browsing parts, building systems, reading content, and publishing user-owned hardware advertisements.

## Stack

- Next.js 16 App Router with TypeScript
- React 18 and Mantine 7
- Redux Toolkit and RTK Query
- Supabase email/password and Google Auth, PostgreSQL, Storage, and Row Level Security
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
NEXT_PUBLIC_ENABLE_PHONE_AUTH=false
# Server-only Supabase secret key (sb_secret_...) — required by the price-sync
# worker and the one-time product-image import. Never use a NEXT_PUBLIC_ prefix.
SUPABASE_SECRET_KEY=YOUR_SERVER_ONLY_SECRET_KEY
# Required only for private Telegram notifications about newly submitted ads.
TELEGRAM_BOT_TOKEN=YOUR_BOTFATHER_TOKEN
TELEGRAM_ADMIN_CHAT_ID=YOUR_PRIVATE_CHAT_ID
```

`NEXT_PUBLIC_WORDPRESS_API` is optional and is retained only for the existing blog comment feature. `SUPABASE_SECRET_KEY` and the Telegram values are server-only secrets. Never place them in a `NEXT_PUBLIC_*` variable or expose them to browser code.

## Supabase Setup

1. Create a Supabase project.
2. Open **Project Settings > API** and copy the Project URL and Publishable key into `.env.local`.
3. Open **SQL Editor** and run the migrations in filename order. Existing projects should apply each newer migration once. Run `supabase/migrations/20260812020000_articles.sql` to add dashboard article management and the `article-images` bucket.
4. Open **Authentication > URL Configuration**.
5. Set the Site URL to `http://localhost:3000` for local development.
6. Add `http://localhost:3000/auth/confirm` and the equivalent production URL to Redirect URLs.
7. In **Authentication > Providers > Email**, enable email/password authentication and keep email confirmation enabled.
8. In Google Cloud, create an OAuth web client with `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback` as an authorized redirect URI. Enable Google in **Authentication > Providers > Google** using that client ID and secret.
9. Phone OTP is retained but hidden by default. After configuring an SMS provider or Send SMS Hook, set `NEXT_PUBLIC_ENABLE_PHONE_AUTH=true` to reveal it.
10. Restart Next.js after changing environment variables.

To grant dashboard moderation access, set a trusted user's Auth `app_metadata.role` to `admin` from the Supabase Dashboard, then have that user sign out and back in to refresh the JWT. Users cannot edit `app_metadata` through the Rigora client. Normal marketplace users do not need this role.

The migration creates `profiles`, `ad_categories`, `ads`, `ad_images`, the public `ad-images` Storage bucket, indexes, timestamps, profile creation trigger, and all RLS/Storage policies. It can also be applied with the Supabase CLI because it uses the standard `supabase/migrations` layout.

### Telegram Ad Notifications

Run `supabase/migrations/20260814010000_telegram_ad_notifications.sql`, create a bot with Telegram `@BotFather`, send the bot `/start`, and obtain your private chat ID from the Bot API `getUpdates` response. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID` (and `SUPABASE_SECRET_KEY` for the price-sync worker) only to the server deployment environment. After an ad and its images save successfully, Rigora calls a protected owner-only endpoint and sends one private moderation notification. Failed sends release their claim so the browser can retry without failing ad creation.

## Auth And Ads

The browser and server clients live under `app/_lib/supabase`. `proxy.ts` refreshes auth cookies and redirects unauthenticated requests from protected routes. Supabase Auth is the only user session source; tokens are not manually stored in Redux or local storage. Users sign in with email/password or Google, while the profile display name acts as their public username. Contact phone numbers are optional and are not login credentials.

Public queries return published ads. Authenticated owners can create, read, update, and delete their own ads. New ads begin as pending, and only users with trusted `app_metadata.role = admin` can publish or reject them. Ownership is derived from `supabase.auth.getUser()` and enforced again by PostgreSQL RLS. Images are stored in Supabase Storage and represented by ordered URL records in `ad_images`.

## Chat

Chat uses the existing Supabase project and does not require a separate Socket.IO server. The chat migration creates `conversations` and `messages`, participant-only RLS policies, a secure get-or-create conversation function, read receipts, indexes, and the Realtime publication entry for persisted messages.

Only a signed-in buyer can start a conversation on a published ad. The database derives the seller from the ad, prevents conversations on the buyer's own ad, and reuses an existing conversation for the same buyer and ad. Only the buyer and seller can read that conversation or send messages. The initial UI loads the latest 30 messages and subscribes to new inserts through Supabase Realtime.

## Articles

Administrators can create drafts or publish articles from `/dashboard/articles`. Article writes and featured-image uploads are restricted by RLS and Storage policies to users with `app_metadata.role = admin`. Public blog pages read only published articles. Article content is stored as plain text and converted to escaped paragraphs for public rendering, preventing stored HTML injection.

## Checks

```bash
npm run prettier:check
npm run typecheck
npm run jest
npm run build
```
