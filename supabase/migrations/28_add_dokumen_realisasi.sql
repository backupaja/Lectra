-- 28_add_dokumen_realisasi.sql

-- 1. Add dokumen_path to realisasi_anggaran
ALTER TABLE public.realisasi_anggaran ADD COLUMN IF NOT EXISTS dokumen_path TEXT;

-- 2. Create Storage Bucket for dokumen_realisasi
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'dokumen_realisasi', 
  'dokumen_realisasi', 
  true, 
  10485760, 
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
) 
ON CONFLICT (id) DO UPDATE
SET public = true, 
    file_size_limit = 10485760, 
    allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

-- 3. RLS untuk Storage Bucket dokumen_realisasi
DROP POLICY IF EXISTS "Public can view dokumen_realisasi" ON storage.objects;
CREATE POLICY "Public can view dokumen_realisasi"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'dokumen_realisasi');

DROP POLICY IF EXISTS "Authenticated can insert dokumen_realisasi" ON storage.objects;
CREATE POLICY "Authenticated can insert dokumen_realisasi"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dokumen_realisasi');

DROP POLICY IF EXISTS "Authenticated can update dokumen_realisasi" ON storage.objects;
CREATE POLICY "Authenticated can update dokumen_realisasi"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'dokumen_realisasi');

DROP POLICY IF EXISTS "Authenticated can delete dokumen_realisasi" ON storage.objects;
CREATE POLICY "Authenticated can delete dokumen_realisasi"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'dokumen_realisasi');
