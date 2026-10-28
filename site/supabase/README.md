# Connecting Supabase (and Resend for e-mails)

The site already works without a server: accounts, cart, orders, chat and the Control Room run in a demo kept in each
visitor's browser. Connecting Supabase turns all of it into the real thing, with no page changes.

## 1. Create the project
1. supabase.com → New project (region: closest to the UAE, e.g. Frankfurt or Mumbai).
2. SQL Editor → paste `schema.sql` → Run.
3. SQL Editor → paste `seed.sql` (made by `node scripts/supabase-seed.mjs`) → Run. This loads brands, models, categories and products.

## 2. Turn on real e-mail confirmation
Authentication → Providers → Email: enable "Confirm email". Authentication → Email Templates → "Confirm signup": use
`{{ .Token }}` so people receive a 6-digit code (the site asks for that code).
Authentication → SMTP: host `smtp.resend.com`, port 465, user `resend`, password = your Resend API key, sender = your domain.

## 3. Connect the site (Vercel)
Project → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` = Project Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Project Settings → API → anon public key
Redeploy. The site switches from the demo to Supabase by itself.

## 4. Make the owner the owner
Sign up on the site with the owner's e-mail, then run the last line of `schema.sql` with that e-mail. From then on the
owner adds every other staff member from the Control Room (/staff → Staff).

## 5. Automated e-mails
`supabase functions deploy send-emails`, then set the secrets `RESEND_API_KEY` and `MAIL_FROM`. Schedule it every minute
(Database → Cron). Orders, status changes, approvals and applications are e-mailed automatically.
