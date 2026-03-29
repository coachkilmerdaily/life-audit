# Life Audit Supabase Setup

Use this to move the current static site into a tester-ready state with accounts and cloud draft saving.

## 1. Create a Supabase project

- Create a new Supabase project.
- In `Authentication -> Providers`, enable `Email`.
- For early testers, email/password is enough.

## 2. Add site URLs

In `Authentication -> URL Configuration` add:

- your future production domain
- your preview domain if you use one
- any local dev URL you use while testing

If you want email confirmation redirects, set the same destination in `supabase-config.js` as `redirectTo`.

## 3. Create the draft storage table

Run the SQL in:

- `supabase-schema.sql`

That creates:

- `audit_sessions`
- a unique draft per user per audit type
- row level security so users can only access their own draft

## 4. Configure the site

Open:

- `supabase-config.js`

Add:

- `url`: your Supabase project URL
- `anonKey`: your public anon key
- `redirectTo`: your portal URL if using email confirmation

## 5. Current behavior

Once configured:

- `portal.html` supports account creation and sign-in
- the Full Audit draft saves to Supabase when a signed-in user is active
- local storage still works as fallback

If Supabase is not configured:

- the site still works locally
- auth and cloud draft features stay inactive

## 6. Recommended next step before wider release

Build a proper post-login dashboard with:

- result history
- draft status
- purchase state
- ability to reopen the audit from the portal
