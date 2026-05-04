-- 1. Groups table
create table chapters (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  abbreviation      text,
  organization      text not null,
  type              text default 'club',
  founded_year      int,
  -- custom label overrides (null = use type defaults)
  custom_member     text,
  custom_members    text,
  custom_mentor     text,
  custom_mentee     text,
  custom_mentees    text,
  custom_cohort     text,
  custom_team       text,
  custom_tree_title text,
  created_at        timestamptz default now()
);

-- 2. Members table
create table members (
  id            uuid primary key default gen_random_uuid(),
  chapter_id    uuid references chapters(id) on delete cascade,
  big_id        uuid references members(id) on delete set null,
  first_name    text not null,
  last_name     text not null,
  email         text,
  phone         text,
  linkedin_url  text,
  pledge_class  text,
  class_year    int,
  status        text default 'active',
  family_name   text,
  show_phone    boolean default true,
  show_email    boolean default true,
  show_linkedin boolean default true,
  avatar_url    text,
  created_at    timestamptz default now()
);

-- 3. Group roles table (links Auth users to member profiles)
create table chapter_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete cascade,
  member_id  uuid references members(id) on delete cascade,
  role       text default 'member',
  joined_at  timestamptz default now(),
  unique(user_id, chapter_id)
);

-- 4. Row Level Security
alter table members enable row level security;
alter table chapters enable row level security;
alter table chapter_roles enable row level security;

-- Members can read all members in their own group
create policy "read own chapter members"
  on members for select
  using (
    chapter_id in (
      select chapter_id from chapter_roles
      where user_id = auth.uid()
    )
  );

-- Admins can insert/update/delete members in their group
create policy "admin manage members"
  on members for all
  using (
    chapter_id in (
      select chapter_id from chapter_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Users can read their own chapter_roles row
create policy "read own role"
  on chapter_roles for select
  using (user_id = auth.uid());

-- Admins can read all roles in their group
create policy "admin read chapter roles"
  on chapter_roles for select
  using (
    chapter_id in (
      select chapter_id from chapter_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Users can read their own group info
create policy "read own chapter"
  on chapters for select
  using (
    id in (
      select chapter_id from chapter_roles
      where user_id = auth.uid()
    )
  );

-- Admins can update their group info
create policy "admin update chapter"
  on chapters for update
  using (
    id in (
      select chapter_id from chapter_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );
