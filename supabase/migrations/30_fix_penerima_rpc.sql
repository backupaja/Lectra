-- 30_fix_penerima_rpc.sql
DROP FUNCTION IF EXISTS public.get_public_penerima_anggaran(SMALLINT, TEXT);

CREATE OR REPLACE FUNCTION public.get_public_penerima_anggaran(p_tahun SMALLINT, p_jenis TEXT)
RETURNS TABLE (
  dosen_id UUID,
  nip TEXT,
  nama TEXT,
  fakultas TEXT,
  program_studi TEXT,
  jenis_anggaran TEXT,
  nominal_anggaran BIGINT,
  alokasi_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id AS dosen_id,
    d.nip,
    d.nama,
    d.fakultas,
    d.program_studi,
    a.jenis_anggaran,
    a.nominal_anggaran,
    a.id AS alokasi_id
  FROM public.alokasi_anggaran a
  JOIN public.dosen d ON a.dosen_id = d.id
  WHERE a.tahun = p_tahun AND (p_jenis = 'all' OR a.jenis_anggaran = p_jenis)

  UNION ALL

  SELECT
    d.id AS dosen_id,
    d.nip,
    d.nama,
    d.fakultas,
    d.program_studi,
    a.jenis_anggaran,
    a.nominal_anggaran,
    a.id AS alokasi_id
  FROM public.alokasi_anggaran a
  JOIN public.alokasi_dosen_tambahan adt ON adt.alokasi_id = a.id
  JOIN public.dosen d ON adt.dosen_id = d.id
  WHERE a.tahun = p_tahun AND (p_jenis = 'all' OR a.jenis_anggaran = p_jenis);
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_penerima_anggaran(SMALLINT, TEXT) TO anon, authenticated;
