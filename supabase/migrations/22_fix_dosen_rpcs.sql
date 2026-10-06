-- 22_fix_dosen_rpcs.sql

-- Drop the broken versions
DROP FUNCTION IF EXISTS public.get_dosen_alokasi(text, smallint, text);
DROP FUNCTION IF EXISTS public.get_dosen_realisasi(text, smallint, text);

-- Recreate get_dosen_alokasi with correct types and logic
CREATE OR REPLACE FUNCTION public.get_dosen_alokasi(
  p_token TEXT,
  p_tahun SMALLINT,
  p_jenis TEXT DEFAULT NULL
)
RETURNS TABLE (
  alokasi_id         UUID,
  jenis_anggaran     TEXT,
  keperluan          TEXT,
  nominal_anggaran   BIGINT,
  keterangan         TEXT,
  total_realisasi    BIGINT,
  jumlah_realisasi   BIGINT,
  budget_status      TEXT,
  sisa_anggaran      BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dosen_id UUID;
BEGIN
  IF p_token IS NULL OR p_token !~ '^[0-9a-f]{64}$' THEN
    RETURN;
  END IF;

  SELECT d.id INTO v_dosen_id FROM public.dosen d WHERE d.share_token = p_token;
  IF v_dosen_id IS NULL THEN RETURN; END IF;

  RETURN QUERY
  SELECT
    a.id AS alokasi_id,
    a.jenis_anggaran,
    a.keperluan,
    a.nominal_anggaran,
    a.keterangan,
    COALESCE(SUM(r.nominal), 0)::BIGINT AS total_realisasi,
    COUNT(r.id)::BIGINT AS jumlah_realisasi,
    CASE
      WHEN COALESCE(SUM(r.nominal), 0) > a.nominal_anggaran THEN 'OVER_BUDGET'
      WHEN COALESCE(SUM(r.nominal), 0) >= (a.nominal_anggaran * 0.8) THEN 'NEAR_LIMIT'
      ELSE 'NORMAL'
    END AS budget_status,
    (a.nominal_anggaran - COALESCE(SUM(r.nominal), 0))::BIGINT AS sisa_anggaran
  FROM public.alokasi_anggaran a
  LEFT JOIN public.realisasi_anggaran r ON r.alokasi_id = a.id
  WHERE (a.dosen_id = v_dosen_id OR EXISTS (SELECT 1 FROM public.alokasi_dosen_tambahan adt WHERE adt.alokasi_id = a.id AND adt.dosen_id = v_dosen_id))
    AND a.tahun = p_tahun
    AND (p_jenis IS NULL OR a.jenis_anggaran = p_jenis)
  GROUP BY a.id
  ORDER BY a.jenis_anggaran, a.keperluan;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_dosen_alokasi(TEXT, SMALLINT, TEXT) TO anon, authenticated;

-- Recreate get_dosen_realisasi with correct columns (removed bukti_url)
CREATE OR REPLACE FUNCTION public.get_dosen_realisasi(
  p_token TEXT,
  p_tahun SMALLINT,
  p_jenis TEXT DEFAULT NULL
)
RETURNS TABLE (
  realisasi_id       UUID,
  tanggal_realisasi  DATE,
  jenis_anggaran     TEXT,
  keperluan          TEXT,
  nominal            BIGINT,
  nomor_simkug       TEXT,
  keterangan         TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dosen_id UUID;
BEGIN
  IF p_token IS NULL OR p_token !~ '^[0-9a-f]{64}$' THEN RETURN; END IF;

  SELECT d.id INTO v_dosen_id FROM public.dosen d WHERE d.share_token = p_token;
  IF v_dosen_id IS NULL THEN RETURN; END IF;

  RETURN QUERY
  SELECT
    r.id AS realisasi_id,
    r.tanggal_realisasi,
    a.jenis_anggaran,
    a.keperluan,
    r.nominal,
    r.nomor_simkug,
    r.keterangan
  FROM public.realisasi_anggaran r
  JOIN public.alokasi_anggaran a ON a.id = r.alokasi_id
  WHERE (a.dosen_id = v_dosen_id OR EXISTS (SELECT 1 FROM public.alokasi_dosen_tambahan adt WHERE adt.alokasi_id = a.id AND adt.dosen_id = v_dosen_id))
    AND a.tahun = p_tahun
    AND (p_jenis IS NULL OR a.jenis_anggaran = p_jenis)
  ORDER BY r.tanggal_realisasi ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_dosen_realisasi(TEXT, SMALLINT, TEXT) TO anon, authenticated;
