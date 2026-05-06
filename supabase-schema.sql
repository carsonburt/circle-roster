-- ============================================================
-- Circle Roster — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- IMPORTANT: In Authentication → Settings, disable "Confirm email"
--            so users can log in immediately after signup.
-- ============================================================

-- Chapters
create table if not exists chapters (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  type            text not null default 'fraternity',
  primary_color   text default '#1D5FE8',
  logo_url        text,
  member_edits_require_approval boolean default true,
  feature_events  boolean default true,
  feature_polls   boolean default true,
  feature_tree    boolean default true,
  feature_inbox   boolean default true,
  feature_points  boolean default false,
  good_standing_min_points integer default 0,
  custom_member   text, custom_members  text,
  custom_mentor   text, custom_mentee   text, custom_mentees text,
  custom_cohort   text, custom_team     text, custom_tree_title text,
  created_at      timestamptz default now()
);

-- Members (user_id links to Supabase Auth)
create table if not exists members (
  id            uuid primary key default gen_random_uuid(),
  chapter_id    uuid not null references chapters(id) on delete cascade,
  user_id       uuid references auth.users(id) on delete set null,
  first_name    text not null,
  last_name     text not null,
  email         text default '',
  phone         text default '',
  linkedin_url  text default '',
  position      text default '',
  major         text default '',
  high_school   text default '',
  pledge_class  text default '',
  class_year    integer,
  status        text default 'active',
  big_id        uuid references members(id) on delete set null,
  is_admin      boolean default false,
  show_phone    boolean default true,
  show_email    boolean default true,
  show_linkedin boolean default true,
  avatar_url    text,
  password      text default 'password',
  created_at    timestamptz default now()
);

-- Events
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  chapter_id  uuid not null references chapters(id) on delete cascade,
  title       text not null,
  description text default '',
  date        date not null,
  time        text default '',
  location    text default '',
  created_at  timestamptz default now()
);

create table if not exists event_rsvps (
  event_id  uuid references events(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  primary key (event_id, member_id)
);

-- Announcements
create table if not exists announcements (
  id         uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id) on delete cascade,
  title      text not null,
  body       text default '',
  pinned     boolean default false,
  created_at timestamptz default now()
);

-- Dues
create table if not exists dues_terms (
  id         uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id) on delete cascade,
  label      text not null,
  finalized  boolean default false,
  created_at timestamptz default now()
);

create table if not exists dues_payments (
  term_id   uuid references dues_terms(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  paid      boolean default false,
  primary key (term_id, member_id)
);

-- Meetings
create table if not exists meetings (
  id         uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id) on delete cascade,
  title      text not null,
  date       date not null,
  created_at timestamptz default now()
);

create table if not exists meeting_attendance (
  meeting_id uuid references meetings(id) on delete cascade,
  member_id  uuid references members(id) on delete cascade,
  primary key (meeting_id, member_id)
);

-- Polls
create table if not exists polls (
  id          uuid primary key default gen_random_uuid(),
  chapter_id  uuid not null references chapters(id) on delete cascade,
  title       text not null,
  description text default '',
  closes_at   timestamptz,
  closed      boolean default false,
  created_at  timestamptz default now()
);

create table if not exists poll_options (
  id          uuid primary key default gen_random_uuid(),
  poll_id     uuid not null references polls(id) on delete cascade,
  text        text not null,
  order_index integer default 0
);

create table if not exists poll_votes (
  poll_id   uuid references polls(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  option_id uuid not null references poll_options(id) on delete cascade,
  primary key (poll_id, member_id)
);

-- Points
create table if not exists point_categories (
  id         uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id) on delete cascade,
  name       text not null,
  points     integer not null default 0
);

create table if not exists point_ledger (
  id            uuid primary key default gen_random_uuid(),
  chapter_id    uuid not null references chapters(id) on delete cascade,
  member_id     uuid not null references members(id) on delete cascade,
  category_id   uuid references point_categories(id) on delete set null,
  category_name text default '',
  points        integer not null,
  note          text default '',
  date          date default current_date,
  created_at    timestamptz default now()
);

-- Notifications
create table if not exists notifications (
  id             uuid primary key default gen_random_uuid(),
  chapter_id     uuid not null references chapters(id) on delete cascade,
  to_member_id   uuid references members(id) on delete cascade,
  from_member_id uuid references members(id) on delete set null,
  type           text not null,
  title          text not null,
  message        text default '',
  read           boolean default false,
  created_at     timestamptz default now()
);

-- Pending Edits
create table if not exists pending_edits (
  id           uuid primary key default gen_random_uuid(),
  chapter_id   uuid not null references chapters(id) on delete cascade,
  member_id    uuid not null references members(id) on delete cascade,
  fields       jsonb not null,
  requested_at timestamptz default now(),
  unique (chapter_id, member_id)
);

-- ============================================================
-- Grants (required when running via SQL editor)
-- ============================================================

grant usage on schema public to anon, authenticated;
grant all on all tables    in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table chapters         enable row level security;
alter table members          enable row level security;
alter table events           enable row level security;
alter table event_rsvps      enable row level security;
alter table announcements    enable row level security;
alter table dues_terms       enable row level security;
alter table dues_payments    enable row level security;
alter table meetings         enable row level security;
alter table meeting_attendance enable row level security;
alter table polls            enable row level security;
alter table poll_options     enable row level security;
alter table poll_votes       enable row level security;
alter table point_categories enable row level security;
alter table point_ledger     enable row level security;
alter table notifications    enable row level security;
alter table pending_edits    enable row level security;

-- Helper: returns the chapter_id for the current authenticated user
create or replace function my_chapter_id()
returns uuid language sql security definer stable as $$
  select chapter_id from members where user_id = auth.uid() limit 1;
$$;

-- Chapters: read/update own chapter; anyone can insert (signup)
create policy "chapters_select" on chapters for select using (id = my_chapter_id());
create policy "chapters_update" on chapters for update using (id = my_chapter_id());
create policy "chapters_insert" on chapters for insert with check (true);

-- Members: full access within own chapter; insert allowed for signup linking
create policy "members_select" on members for select using (chapter_id = my_chapter_id() or user_id = auth.uid());
create policy "members_insert" on members for insert with check (chapter_id = my_chapter_id() or user_id = auth.uid());
create policy "members_update" on members for update using (chapter_id = my_chapter_id() or user_id = auth.uid());
create policy "members_delete" on members for delete using (chapter_id = my_chapter_id());

-- All other tables: scoped to own chapter
create policy "events_all"             on events             for all using (chapter_id = my_chapter_id());
create policy "event_rsvps_all"        on event_rsvps        for all using (event_id in (select id from events where chapter_id = my_chapter_id()));
create policy "announcements_all"      on announcements      for all using (chapter_id = my_chapter_id());
create policy "dues_terms_all"         on dues_terms         for all using (chapter_id = my_chapter_id());
create policy "dues_payments_all"      on dues_payments      for all using (term_id in (select id from dues_terms where chapter_id = my_chapter_id()));
create policy "meetings_all"           on meetings           for all using (chapter_id = my_chapter_id());
create policy "meeting_attendance_all" on meeting_attendance for all using (meeting_id in (select id from meetings where chapter_id = my_chapter_id()));
create policy "polls_all"              on polls              for all using (chapter_id = my_chapter_id());
create policy "poll_options_all"       on poll_options       for all using (poll_id in (select id from polls where chapter_id = my_chapter_id()));
create policy "poll_votes_all"         on poll_votes         for all using (poll_id in (select id from polls where chapter_id = my_chapter_id()));
create policy "point_categories_all"   on point_categories   for all using (chapter_id = my_chapter_id());
create policy "point_ledger_all"       on point_ledger       for all using (chapter_id = my_chapter_id());
create policy "notifications_all"      on notifications      for all using (chapter_id = my_chapter_id());
create policy "pending_edits_all"      on pending_edits      for all using (chapter_id = my_chapter_id());
