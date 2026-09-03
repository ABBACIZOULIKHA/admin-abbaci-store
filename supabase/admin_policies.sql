-- =====================================================
-- Ceramic Admin – write policies for authenticated users
-- Run in: Supabase Dashboard > SQL Editor
-- (The storefront keeps its read-only public access.)
-- =====================================================

-- Faience + related
create policy "admin write" on public.faience
  for all to authenticated using (true) with check (true);
create policy "admin write" on public.photos_grand_faience
  for all to authenticated using (true) with check (true);
create policy "admin write" on public.photos_unite_faience
  for all to authenticated using (true) with check (true);
create policy "admin write" on public.faience_categories
  for all to authenticated using (true) with check (true);
create policy "admin write" on public.faience_utilisations
  for all to authenticated using (true) with check (true);
create policy "admin write" on public.faience_finitions
  for all to authenticated using (true) with check (true);

-- Bathroom + related
create policy "admin write" on public.bathroom
  for all to authenticated using (true) with check (true);
create policy "admin write" on public.photos_grand_bathroom
  for all to authenticated using (true) with check (true);
create policy "admin write" on public.photos_unite_bathroom
  for all to authenticated using (true) with check (true);

-- Producers
create policy "admin write" on public.producers
  for all to authenticated using (true) with check (true);

-- Reference tables
create policy "admin write" on public.categories
  for all to authenticated using (true) with check (true);
create policy "admin write" on public.utilisations
  for all to authenticated using (true) with check (true);
create policy "admin write" on public.finitions
  for all to authenticated using (true) with check (true);

-- =====================================================
-- Create your admin account:
--   Supabase Dashboard > Authentication > Users > Add user
--   -> enter email + password, confirm.
-- Then log into the admin app with those credentials.
-- =====================================================
