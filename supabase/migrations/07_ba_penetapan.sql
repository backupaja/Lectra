-- 07_ba_penetapan.sql
-- Penyimpanan dokumen BA Penetapan (PDF) per tahun

-- ==========================================
-- TABEL
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ba_penetapan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tahun INTEGER NOT NULL,
  nama_file TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  ukuran BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ba_penetapan_tahun ON public.ba_penetapan (tahun);

ALTER TABLE public.ba_penetapan ENABLE ROW LEVEL SECURITY;

-- Hanya admin yang boleh melihat & mengelola
CREATE POLICY "ba_penetapan_admin_all"
  ON public.ba_penetapan FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ba_penetapan TO authenticated;

-- ==========================================
-- STORAGE BUCKET (private, khusus PDF maks 20MB)
-- ==========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ba-penetapan', 'ba-penetapan', false, 20971520, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "ba_penetapan_storage_admin_all"
  ON storage.objects FOR ALL
  USING (bucket_id = 'ba-penetapan' AND public.is_admin())
  WITH CHECK (bucket_id = 'ba-penetapan' AND public.is_admin());
