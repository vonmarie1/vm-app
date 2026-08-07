-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query)
-- Adds tables for ally bookmarking and voice-session rate limiting.
-- Uses the same Clerk JWT pattern already relied on by the `allies` table's
-- RLS policies (auth.jwt()->>'sub' holds the signed-in Clerk user id).

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  ally_id uuid not null references allies(id) on delete cascade,
  user_id text not null,
  created_at timestamptz not null default now(),
  unique (ally_id, user_id)
);

alter table bookmarks enable row level security;

create policy "Users can view their own bookmarks"
  on bookmarks for select
  using (auth.jwt()->>'sub' = user_id);

create policy "Users can create their own bookmarks"
  on bookmarks for insert
  with check (auth.jwt()->>'sub' = user_id);

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using (auth.jwt()->>'sub' = user_id);

create table if not exists session_starts (
  id uuid primary key default gen_random_uuid(),
  ally_id uuid not null references allies(id) on delete cascade,
  user_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists session_starts_user_id_created_at_idx
  on session_starts (user_id, created_at);

alter table session_starts enable row level security;

create policy "Users can view their own session starts"
  on session_starts for select
  using (auth.jwt()->>'sub' = user_id);

create policy "Users can record their own session starts"
  on session_starts for insert
  with check (auth.jwt()->>'sub' = user_id);
