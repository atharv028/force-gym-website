create extension if not exists pgcrypto;

-- Members (gym customers)
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique, -- format: +91XXXXXXXXXX
  joined_on date default current_date,
  membership_expires_on date,
  photo_url text,
  active boolean default true,
  created_at timestamptz default now()
);
create index if not exists idx_members_phone on members(phone);

-- Member session tokens (long-lived, 90 days)
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  token_hash text unique not null, -- store hash, not raw token
  device_info text,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
create index if not exists idx_sessions_member on sessions(member_id);

-- OTP codes (5-min expiry)
create table if not exists otps (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code_hash text not null, -- bcrypt hash
  expires_at timestamptz not null,
  used boolean default false,
  attempts int default 0,
  created_at timestamptz default now()
);
create index if not exists idx_otps_phone on otps(phone, created_at desc);

-- Raw attendance scans (every tap, including rejected)
create table if not exists attendance_logs (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  scanned_at timestamptz default now(),
  lat double precision,
  lng double precision,
  distance_m int,
  rejected boolean default false,
  rejection_reason text
);
create index if not exists idx_attendance_member_date on attendance_logs(member_id, scanned_at desc);
create index if not exists idx_attendance_date on attendance_logs(scanned_at desc);

-- Computed daily summary (one row per member per day)
create table if not exists daily_summary (
  date date not null,
  member_id uuid references members(id) on delete cascade,
  in_time timestamptz,
  out_time timestamptz,
  duration_min int,
  scan_count int default 0,
  primary key (date, member_id)
);
create index if not exists idx_daily_member on daily_summary(member_id, date desc);

-- Gym configuration (single row, id=1)
create table if not exists gym_config (
  id int primary key default 1,
  gym_name text default 'My Gym',
  gym_lat double precision not null,
  gym_lng double precision not null,
  allowed_radius_m int default 150,
  opening_hour int default 5, -- IST 24h
  closing_hour int default 23,
  qr_token text not null,
  qr_token_rotated_at timestamptz default now(),
  owner_phone text,
  constraint single_row check (id = 1)
);

-- Admin accounts
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

-- Reminder log for inactivity notifications
create table if not exists reminder_log (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  reminder_type text not null,
  sent_at timestamptz default now()
);
create index if not exists idx_reminder_member_type_date on reminder_log(member_id, reminder_type, sent_at desc);

-- Lock down direct client access; everything goes through API routes
alter table members enable row level security;
alter table sessions enable row level security;
alter table otps enable row level security;
alter table attendance_logs enable row level security;
alter table daily_summary enable row level security;
alter table gym_config enable row level security;
alter table admins enable row level security;
alter table reminder_log enable row level security;

-- Deny all anon access (server uses service role key, bypasses RLS)
drop policy if exists "deny anon" on members;
create policy "deny anon" on members for all to anon using (false);

drop policy if exists "deny anon" on sessions;
create policy "deny anon" on sessions for all to anon using (false);

drop policy if exists "deny anon" on otps;
create policy "deny anon" on otps for all to anon using (false);

drop policy if exists "deny anon" on attendance_logs;
create policy "deny anon" on attendance_logs for all to anon using (false);

drop policy if exists "deny anon" on daily_summary;
create policy "deny anon" on daily_summary for all to anon using (false);

drop policy if exists "deny anon" on gym_config;
create policy "deny anon" on gym_config for all to anon using (false);

drop policy if exists "deny anon" on admins;
create policy "deny anon" on admins for all to anon using (false);

drop policy if exists "deny anon" on reminder_log;
create policy "deny anon" on reminder_log for all to anon using (false);
