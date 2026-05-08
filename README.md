# Force Gym Attendance (PWA)

QR-code attendance system for small gyms using Next.js, Supabase, and WhatsApp OTP.

## Prerequisites

- Node.js 20+
- Supabase project
- Meta WhatsApp Cloud API access
- Vercel account

## Setup

1. Copy env:
   - `cp .env.example .env.local`
2. Install:
   - `npm install`
3. Run SQL:
   - Execute `supabase/schema.sql`
   - Execute `supabase/seed.sql`
4. Start dev server:
   - `npm run dev`

## Deploy to Vercel

1. Import repo in Vercel.
2. Add all environment variables from `.env.example`.
3. Deploy.
4. Ensure cron routes are active from `vercel.json`.

## WhatsApp Template Submission

Use text in `templates/whatsapp-templates.md` and submit in Meta Business Manager:

- `gym_otp`
- `gym_daily_digest`
- `gym_inactivity_reminder`
- `gym_weekly_summary`

## Notes

- All data writes happen from server API routes with service-role key.
- Member cookie: `member_session` (JWT).
- Admin cookie: `admin_session` (JWT).
