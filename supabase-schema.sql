create extension if not exists pgcrypto;

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_current_timestamp_updated_at();

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_key text not null,
  status text not null default 'active',
  source text not null default 'manual',
  notes text,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entitlements_product_key_check check (product_key in ('full_audit')),
  constraint entitlements_status_check check (status in ('active', 'inactive', 'revoked', 'test'))
);

create unique index if not exists entitlements_user_product_idx
  on public.entitlements (user_id, product_key);

drop trigger if exists entitlements_set_updated_at on public.entitlements;

create trigger entitlements_set_updated_at
before update on public.entitlements
for each row
execute function public.set_current_timestamp_updated_at();

create table if not exists public.audit_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  audit_kind text not null check (audit_kind in ('full', 'mini')),
  status text not null default 'draft',
  progress_index integer not null default 0,
  completion_percent integer not null default 0,
  state jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.audit_sessions
  add column if not exists status text not null default 'draft';

alter table public.audit_sessions
  add column if not exists progress_index integer not null default 0;

alter table public.audit_sessions
  add column if not exists completion_percent integer not null default 0;

alter table public.audit_sessions
  add column if not exists started_at timestamptz;

alter table public.audit_sessions
  add column if not exists completed_at timestamptz;

alter table public.audit_sessions
  drop constraint if exists audit_sessions_status_check;

alter table public.audit_sessions
  add constraint audit_sessions_status_check
  check (status in ('draft', 'completed', 'archived'));

create unique index if not exists audit_sessions_user_kind_idx
  on public.audit_sessions (user_id, audit_kind);

drop trigger if exists audit_sessions_set_updated_at on public.audit_sessions;

create trigger audit_sessions_set_updated_at
before update on public.audit_sessions
for each row
execute function public.set_current_timestamp_updated_at();

create table if not exists public.audit_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.audit_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  audit_kind text not null check (audit_kind in ('full', 'mini')),
  section_key text not null,
  question_key text not null,
  answer_text text,
  answer_value jsonb,
  is_skipped boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists audit_answers_session_question_idx
  on public.audit_answers (session_id, question_key);

create index if not exists audit_answers_user_idx
  on public.audit_answers (user_id, audit_kind);

drop trigger if exists audit_answers_set_updated_at on public.audit_answers;

create trigger audit_answers_set_updated_at
before update on public.audit_answers
for each row
execute function public.set_current_timestamp_updated_at();

create table if not exists public.audit_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.audit_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  audit_kind text not null check (audit_kind in ('full', 'mini')),
  overall_score numeric(5,2),
  completion_percent integer,
  strongest_areas jsonb not null default '[]'::jsonb,
  weakest_areas jsonb not null default '[]'::jsonb,
  friction_points jsonb not null default '[]'::jsonb,
  root_issue text,
  action_plan jsonb not null default '[]'::jsonb,
  result_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists audit_results_user_idx
  on public.audit_results (user_id, audit_kind);

drop trigger if exists audit_results_set_updated_at on public.audit_results;

create trigger audit_results_set_updated_at
before update on public.audit_results
for each row
execute function public.set_current_timestamp_updated_at();

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.audit_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  audit_kind text not null check (audit_kind in ('full', 'mini')),
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_events_user_idx
  on public.audit_events (user_id, audit_kind, created_at desc);

alter table public.profiles enable row level security;
alter table public.entitlements enable row level security;
alter table public.audit_sessions enable row level security;
alter table public.audit_answers enable row level security;
alter table public.audit_results enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles
  for select
  using (auth.uid() is not null and auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() is not null and auth.uid() = id)
  with check (auth.uid() is not null and auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() is not null and auth.uid() = id);

drop policy if exists "Users can read their own entitlements" on public.entitlements;
create policy "Users can read their own entitlements"
  on public.entitlements
  for select
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can read their own audit sessions" on public.audit_sessions;
create policy "Users can read their own audit sessions"
  on public.audit_sessions
  for select
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can insert their own audit sessions" on public.audit_sessions;
create policy "Users can insert their own audit sessions"
  on public.audit_sessions
  for insert
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can update their own audit sessions" on public.audit_sessions;
create policy "Users can update their own audit sessions"
  on public.audit_sessions
  for update
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can delete their own audit sessions" on public.audit_sessions;
create policy "Users can delete their own audit sessions"
  on public.audit_sessions
  for delete
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can read their own audit answers" on public.audit_answers;
create policy "Users can read their own audit answers"
  on public.audit_answers
  for select
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can insert their own audit answers" on public.audit_answers;
create policy "Users can insert their own audit answers"
  on public.audit_answers
  for insert
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can update their own audit answers" on public.audit_answers;
create policy "Users can update their own audit answers"
  on public.audit_answers
  for update
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can delete their own audit answers" on public.audit_answers;
create policy "Users can delete their own audit answers"
  on public.audit_answers
  for delete
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can read their own audit results" on public.audit_results;
create policy "Users can read their own audit results"
  on public.audit_results
  for select
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can insert their own audit results" on public.audit_results;
create policy "Users can insert their own audit results"
  on public.audit_results
  for insert
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can update their own audit results" on public.audit_results;
create policy "Users can update their own audit results"
  on public.audit_results
  for update
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can delete their own audit results" on public.audit_results;
create policy "Users can delete their own audit results"
  on public.audit_results
  for delete
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can read their own audit events" on public.audit_events;
create policy "Users can read their own audit events"
  on public.audit_events
  for select
  using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can insert their own audit events" on public.audit_events;
create policy "Users can insert their own audit events"
  on public.audit_events
  for insert
  with check (auth.uid() is not null and auth.uid() = user_id);

comment on table public.audit_answers is
  'Stores raw user answers. This table may contain sensitive reflective text and should remain tightly scoped behind RLS.';

comment on table public.audit_results is
  'Stores processed output derived from raw answers, such as scores, strengths, friction points, and action plans.';

comment on table public.entitlements is
  'Tracks whether a user is allowed to access a product area such as the Full Life Audit. Payment integration can write here later.';
