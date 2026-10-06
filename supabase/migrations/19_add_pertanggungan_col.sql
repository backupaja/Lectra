-- Add pertanggungan column
ALTER TABLE public.alokasi_anggaran ADD COLUMN IF NOT EXISTS pertanggungan TEXT;
