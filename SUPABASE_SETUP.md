# Life Audit Supabase Setup

This setup is now aimed at a safer production-style foundation, even before payments are added.

## What this schema creates

Running [supabase-schema.sql](C:\Users\cnrat\OneDrive\Documents\Life Audit\supabase-schema.sql) now creates or upgrades:

- `profiles`
- `entitlements`
- `audit_sessions`
- `audit_answers`
- `audit_results`
- `audit_events`

It also:

- enables Row Level Security on every user-facing table
- creates per-user policies so users can only access their own rows
- creates a profile row automatically when a new auth user is created
- adds update triggers for timestamp tracking

## 1. Create your Supabase project

- Create a Supabase project.
- In `Authentication -> Providers`, enable `Email`.
- For the current stage, email/password auth is enough.

## 2. Add site URLs

In `Authentication -> URL Configuration` add:

- your local/dev URL if needed
- your staging URL if you use one
- your production domain when ready

If you want password reset redirects back into the portal, keep the same destination in:

- [supabase-config.js](C:\Users\cnrat\OneDrive\Documents\Life Audit\supabase-config.js)

## 3. Run the schema

Open Supabase:

- `SQL Editor`
- `New query`

Then paste in:

- [supabase-schema.sql](C:\Users\cnrat\OneDrive\Documents\Life Audit\supabase-schema.sql)

and run it.

This is idempotent, so it is safe to run again as the structure evolves.

## 4. Configure the site

Open:

- [supabase-config.js](C:\Users\cnrat\OneDrive\Documents\Life Audit\supabase-config.js)

Add:

- `url`: your Supabase project URL
- `anonKey`: your publishable/anon frontend key
- `redirectTo`: your portal URL if needed for recovery links

## 5. Current app behavior

Once configured:

- [portal.html](C:\Users\cnrat\OneDrive\Documents\Life Audit\portal.html) supports sign-in, sign-up, password reset, and draft access
- the Full Audit is locked behind account access
- the Full Audit draft saves to Supabase when a signed-in user is active
- local storage still works as a fallback during development

## 6. What is still intentionally not built yet

- Stripe payments
- webhook processing
- paid entitlements
- onboarding/follow-up email sending

The schema includes `entitlements` now so payments can write into it later.

## 7. Recommended next step

Before launch:

- move raw reflective answers from session JSON into `audit_answers`
- write processed outputs into `audit_results`
- keep `audit_sessions` focused on draft/progress metadata

That keeps sensitive free text better separated from general session state.
