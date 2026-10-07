-- 25_add_dosen_columns.sql
-- Adds nuptk column to dosen table (non-destructive)
-- Note: program_studi and fakultas already exist; loker is parsed into those two columns

ALTER TABLE public.dosen
  ADD COLUMN IF NOT EXISTS nuptk TEXT;

COMMENT ON COLUMN public.dosen.nuptk IS 'Nomor Unik Pendidik dan Tenaga Kependidikan';
