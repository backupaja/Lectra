-- 29_public_penerima_rpc.sql

-- Buat tipe kembalian jika belum ada (atau kita bisa pakai RETURNS TABLE)
CREATE OR REPLACE FUNCTION public.get_public_penerima_anggaran(p_tahun SMALLINT, p_jenis TEXT)
RETURNS TABLE (
  dosen_id UUID,
  nip VARCHAR,
  nama VARCHAR,
  fakultas VARCHAR,
  program_studi VARCHAR,
  jenis_anggaran VARCHAR,
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
  WHERE a.tahun = p_tahun AND a.jenis_anggaran = p_jenis

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
  WHERE a.tahun = p_tahun AND a.jenis_anggaran = p_jenis;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_penerima_anggaran(SMALLINT, TEXT) TO anon, authenticated;

-- Pastikan izin SELECT diberikan ulang untuk berjaga-jaga (jika user mau query langsung)
GRANT SELECT ON public.alokasi_anggaran TO anon;
GRANT SELECT ON public.dosen TO anon;
GRANT SELECT ON public.alokasi_dosen_tambahan TO anon;
