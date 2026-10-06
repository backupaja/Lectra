-- 20_grant_progress_jad.sql
-- Fix: 06_jad_features.sql melakukan REVOKE ALL pada progress_jad tanpa GRANT ulang,
-- sehingga admin (role authenticated) mendapat "permission denied for table progress_jad".
-- Akses tetap dibatasi oleh RLS policy "Admin full access progress_jad" (public.is_admin()).

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.progress_jad TO authenticated;
