-- =========================
-- NANOBIO PRO MASTER SCHEMA
-- =========================

-- EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ================= USERS PROFILE =================
create table profiles (
id uuid primary key references auth.users(id) on delete cascade,
full_name text,
institution text,
field text,
avatar_url text,
bio text,
xp integer default 0,
level integer default 1,
streak integer default 0,
longest_streak integer default 0,
daily_goal integer default 30,
created_at timestamptz default now()
);

-- ================= DOMAINS =================
create table domains (
id uuid primary key default gen_random_uuid(),
name text not null,
slug text unique not null
);

-- ================= TIERS =================
create table tiers (
id uuid primary key default gen_random_uuid(),
name text not null
);

-- ================= MODULES =================
create table modules (
id uuid primary key default gen_random_uuid(),
domain_id uuid references domains(id) on delete cascade,
tier_id uuid references tiers(id),
title text not null,
slug text unique not null,
description text,
difficulty integer default 1,
estimated_minutes integer default 30,
content text not null,
created_at timestamptz default now()
);

-- ================= CHAPTERS =================
create table chapters (
id uuid primary key default gen_random_uuid(),
module_id uuid references modules(id) on delete cascade,
title text,
position integer
);

-- ================= KEY TERMS =================
create table key_terms (
id uuid primary key default gen_random_uuid(),
module_id uuid references modules(id) on delete cascade,
term text,
definition text
);

-- ================= REFERENCES =================
create table references (
id uuid primary key default gen_random_uuid(),
module_id uuid references modules(id) on delete cascade,
citation text,
doi text
);

-- ================= PROGRESS =================
create table module_progress (
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id) on delete cascade,
module_id uuid references modules(id) on delete cascade,
completed boolean default false,
progress integer default 0,
last_opened timestamptz default now(),
unique(user_id, module_id)
);

-- ================= STUDY SESSIONS =================
create table study_sessions (
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id) on delete cascade,
minutes integer,
created_at timestamptz default now()
);

-- ================= QUIZ BANK =================
create type question_type as enum ('MCQ','TRUE_FALSE','ASSERTION_REASON');

create table quiz_banks (
id uuid primary key default gen_random_uuid(),
title text,
category text
);

create table questions (
id uuid primary key default gen_random_uuid(),
bank_id uuid references quiz_banks(id) on delete cascade,
type question_type,
question text,
option_a text,
option_b text,
option_c text,
option_d text,
correct_answer text,
explanation text,
difficulty integer default 1,
topic text
);

create table quiz_attempts (
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id),
bank_id uuid references quiz_banks(id),
score integer,
created_at timestamptz default now()
);

create table quiz_responses (
id uuid primary key default gen_random_uuid(),
attempt_id uuid references quiz_attempts(id) on delete cascade,
question_id uuid references questions(id),
selected text,
correct boolean
);

-- ================= BOOKMARKS =================
create table bookmarks (
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id),
module_id uuid references modules(id),
unique(user_id,module_id)
);

-- ================= NOTES =================
create table notes (
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id),
module_id uuid references modules(id),
content text,
created_at timestamptz default now()
);

-- ================= ACHIEVEMENTS =================
create table achievements (
id uuid primary key default gen_random_uuid(),
title text,
description text,
xp_reward integer,
rarity text
);

create table user_achievements (
user_id uuid references auth.users(id) on delete cascade,
achievement_id uuid references achievements(id),
earned_at timestamptz default now(),
primary key(user_id,achievement_id)
);

-- ================= CERTIFICATES =================
create table certificates (
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id),
title text,
code text unique,
issued_at timestamptz default now()
);

-- ================= NOTIFICATIONS =================
create table notifications (
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id),
title text,
body text,
read boolean default false,
created_at timestamptz default now()
);
