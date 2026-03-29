# Life Audit Security Architecture

## Current principles

- Frontend uses the publishable/anon key only.
- `service_role` must never be exposed in browser code.
- Every user-facing table in `public` must have RLS enabled.
- Policies must scope reads and writes to `auth.uid()`.

## Table responsibilities

- `profiles`
  - account/profile metadata
- `entitlements`
  - whether a user is allowed into product areas like the Full Life Audit
- `audit_sessions`
  - draft/progress/session metadata
- `audit_answers`
  - raw input, including sensitive free text
- `audit_results`
  - processed output, scores, diagnosis, strengths, friction points
- `audit_events`
  - optional audit history and internal lifecycle events

## Sensitive data handling

`audit_answers` is the table with the highest sensitivity.

Recommendations:

- keep access scoped strictly to the owner
- do not expose broad admin access casually
- decide retention rules intentionally
- later, add export/delete flows so users have clearer control over their data

## Stripe architecture later

Recommended flow:

1. user pays via Stripe Checkout
2. Stripe sends webhook
3. webhook hits Supabase Edge Function
4. Edge Function verifies Stripe signature
5. Edge Function updates `orders` and/or `entitlements`

Do not handle Stripe secrets in the frontend.

## Email architecture later

Recommended split:

- Stripe
  - receipts
  - payment confirmations
  - invoice emails
- App system
  - onboarding
  - password reset
  - audit-ready
  - follow-up

Recommended delivery approach:

- Supabase Edge Functions
- email provider such as Resend

## Australian consumer law note

Operationally, the product can state:

- no refunds for change of mind

But checkout, terms, and support handling still need to respect Australian Consumer Law for defective or misrepresented products.
