-- Update get_public_yearly_summary to accept p_fakultas parameter
DROP FUNCTION IF EXISTS public.get_public_yearly_summary();

CREATE OR REPLACE FUNCTION public.get_public_yearly_summary(p_fakultas TEXT DEFAULT 'SEMUA')
RETURNS TABLE (
  tahun           SMALLINT,
  total_anggaran  BIGINT,
  total_realisasi BIGINT,
  opex            BIGINT,
  capex           BIGINT,
  opex_realisasi  BIGINT,
  capex_realisasi BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.tahun,
    SUM(a.nominal_anggaran)::BIGINT AS total_anggaran,
    COALESCE(SUM(r_agg.total_real), 0)::BIGINT AS total_realisasi,
    SUM(CASE WHEN a.jenis_anggaran = 'OPEX' THEN a.nominal_anggaran ELSE 0 END)::BIGINT AS opex,
    SUM(CASE WHEN a.jenis_anggaran = 'CAPEX' THEN a.nominal_anggaran ELSE 0 END)::BIGINT AS capex,
    COALESCE(SUM(CASE WHEN a.jenis_anggaran = 'OPEX' THEN r_agg.total_real ELSE 0 END), 0)::BIGINT AS opex_realisasi,
    COALESCE(SUM(CASE WHEN a.jenis_anggaran = 'CAPEX' THEN r_agg.total_real ELSE 0 END), 0)::BIGINT AS capex_realisasi
  FROM public.alokasi_anggaran a
  LEFT JOIN (
    SELECT alokasi_id, SUM(nominal) AS total_real
    FROM public.realisasi_anggaran
    GROUP BY alokasi_id
  ) r_agg ON r_agg.alokasi_id = a.id
  JOIN public.dosen d ON a.dosen_id = d.id
  WHERE (p_fakultas = 'SEMUA' OR d.fakultas = p_fakultas)
  GROUP BY a.tahun
  ORDER BY a.tahun;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_yearly_summary(TEXT) TO anon, authenticated;
