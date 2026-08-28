-- =====================================================
-- Ceramic Admin – Supabase Storage for product images
-- Run in: Supabase Dashboard > SQL Editor
-- =====================================================

-- Public bucket: anyone can VIEW images, only logged-in
-- admins (authenticated) can upload/update/delete.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Everyone (site vitrine included) can display the images
create policy "public read product images"
on storage.objects for select
using (bucket_id = 'product-images');

-- Only authenticated admin users can upload
create policy "admin upload product images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images');

-- Only authenticated admin users can replace
create policy "admin update product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images');

-- Only authenticated admin users can delete
create policy "admin delete product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images');
