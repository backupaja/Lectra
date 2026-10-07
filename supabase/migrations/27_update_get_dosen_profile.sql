-- 27_update_get_dosen_profile.sql
-- Update get_dosen_profile RPC to include NIP and NUPTK

DROP FUNCTION IF EXISTS public.get_dosen_profile(text);

CREATE OR REPLACE FUNCTION public.get_dosen_profile(p_token TEXT)
RETURNS TABLE (
  id                 UUID,
  nip                TEXT,
  nama               TEXT,
  jabatan_fungsional TEXT,
  nuptk              TEXT,
  fakultas           TEXT,
  program_studi      TEXT,
  status             TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_token IS NULL OR p_token !~ '^[0-9a-f]{64}$' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    d.id,
    d.nip,
    d.nama,
    d.jabatan_fungsional,
    d.nuptk,
    d.fakultas,
    d.program_studi,
    d.status
  FROM public.dosen d
  WHERE d.share_token = p_token;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_dosen_profile(TEXT) TO anon, authenticated;
