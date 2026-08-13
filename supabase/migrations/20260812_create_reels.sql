-- Create reels table for homepage video reel section
create table if not exists public.reels (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  video_url   text not null,
  thumbnail_url text,
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Enable RLS
alter table public.reels enable row level security;

-- Public read
create policy "Public reels read" on public.reels
  for select using (true);

-- Admin full access (service role bypasses RLS automatically)
create policy "Admin reels write" on public.reels
  for all using (auth.role() = 'authenticated');
