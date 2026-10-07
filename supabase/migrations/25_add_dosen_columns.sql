-- 25_add_dosen_columns.sql
-- Adds nuptk and loker columns to dosen table (non-destructive)

ALTER TABLE public.dosen
  ADD COLUMN IF NOT EXISTS nuptk TEXT,
  ADD COLUMN IF NOT EXISTS loker TEXT;

COMMENT ON COLUMN public.dosen.nuptk IS 'Nomor Unik Pendidik dan Tenaga Kependidikan';
COMMENT ON COLUMN public.dosen.loker IS 'Lokasi Kerja (raw dari DATABASE DOSEN LECTRA)';
