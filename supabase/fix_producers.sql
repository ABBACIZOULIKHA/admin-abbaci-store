-- =====================================================
-- Fix: Producteurs (producers) - liste vide
-- Run in: Supabase Dashboard > SQL Editor > Run
-- =====================================================

-- 1) Make sure RLS is enabled
alter table public.producers enable row level security;

-- 2) Public (site vitrine + admin) can READ all producers
--    -> without this policy anon/authenticated reads return [] (empty list)
create policy "public read" on public.producers
  for select using (true);

-- 3) Authenticated admins can INSERT / UPDATE / DELETE
create policy "admin write" on public.producers
  for all to authenticated using (true) with check (true);

-- 4) If the table is empty, re-insert the example producers
insert into public.producers (name, logo_img)
values
  ('Ceramica', 'https://picsum.photos/seed/logo-ceramica/100/100'),
  ('Mosaic',   'https://picsum.photos/seed/logo-mosaic/100/100')
on conflict do nothing;
