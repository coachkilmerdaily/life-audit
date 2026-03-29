create table if not exists public.audit_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  audit_kind text not null check (audit_kind in ('full', 'mini')),
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists audit_sessions_user_kind_idx
  on public.audit_sessions (user_id, audit_kind);

alter table public.audit_sessions enable row level security;

create policy "Users can read their own audit sessions"
  on public.audit_sessions
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own audit sessions"
  on public.audit_sessions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own audit sessions"
  on public.audit_sessions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_audit_session_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists audit_sessions_set_updated_at on public.audit_sessions;

create trigger audit_sessions_set_updated_at
before update on public.audit_sessions
for each row
execute function public.set_audit_session_updated_at();
