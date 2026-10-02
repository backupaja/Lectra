-- 02_functions.sql

-- =============================================
-- HELPER: is_admin()
-- =============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  )
$$;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- =============================================
-- PUBLIC DASHBOARD
-- =============================================
CREATE OR REPLACE FUNCTION public.get_public_yearly_summary()
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
  GROUP BY a.tahun
  ORDER BY a.tahun;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_public_yearly_summary() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_yearly_summary() TO anon;

CREATE OR REPLACE FUNCTION public.get_public_monthly_summary(p_tahun SMALLINT)
RETURNS TABLE (
  bulan      TEXT,
  realisasi  BIGINT,
  sisa       BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_anggaran BIGINT;
BEGIN
  IF p_tahun < 2000 OR p_tahun > 2100 THEN
    RETURN;
  END IF;

  SELECT COALESCE(SUM(nominal_anggaran), 0) INTO v_total_anggaran
  FROM public.alokasi_anggaran
  WHERE tahun = p_tahun;

  RETURN QUERY
  WITH monthly_realisasi AS (
    SELECT
      EXTRACT(MONTH FROM r.tanggal_realisasi)::INT AS bulan_num,
      TO_CHAR(r.tanggal_realisasi, 'Mon') AS bulan_label,
      SUM(r.nominal)::BIGINT AS total_real
    FROM public.realisasi_anggaran r
    JOIN public.alokasi_anggaran a ON a.id = r.alokasi_id
    WHERE a.tahun = p_tahun
    GROUP BY bulan_num, bulan_label
  )
  SELECT
    m.bulan_label AS bulan,
    m.total_real AS realisasi,
    GREATEST(0, v_total_anggaran - m.total_real)::BIGINT AS sisa
  FROM monthly_realisasi m
  ORDER BY m.bulan_num;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_public_monthly_summary(SMALLINT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_monthly_summary(SMALLINT) TO anon;

-- =============================================
-- DOSEN DASHBOARD
-- =============================================
CREATE OR REPLACE FUNCTION public.get_dosen_profile(p_token TEXT)
RETURNS TABLE (
  id                 UUID,
  nama               TEXT,
  jabatan_fungsional TEXT,
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
    d.nama,
    d.jabatan_fungsional,
    d.fakultas,
    d.program_studi,
    d.status
  FROM public.dosen d
  WHERE d.share_token = p_token;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_dosen_profile(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_dosen_profile(TEXT) TO anon;

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
  WHERE a.dosen_id = v_dosen_id
    AND a.tahun = p_tahun
    AND (p_jenis IS NULL OR a.jenis_anggaran = p_jenis)
  GROUP BY a.id
  ORDER BY a.jenis_anggaran, a.keperluan;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_dosen_alokasi(TEXT, SMALLINT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_dosen_alokasi(TEXT, SMALLINT, TEXT) TO anon;

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
  WHERE a.dosen_id = v_dosen_id
    AND a.tahun = p_tahun
    AND (p_jenis IS NULL OR a.jenis_anggaran = p_jenis)
  ORDER BY r.tanggal_realisasi ASC;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_dosen_realisasi(TEXT, SMALLINT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_dosen_realisasi(TEXT, SMALLINT, TEXT) TO anon;

CREATE OR REPLACE FUNCTION public.get_dosen_monthly_summary(
  p_token TEXT,
  p_tahun SMALLINT
)
RETURNS TABLE (
  bulan       TEXT,
  realisasi   BIGINT,
  sisa        BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dosen_id UUID;
  v_total_anggaran BIGINT;
BEGIN
  IF p_token IS NULL OR p_token !~ '^[0-9a-f]{64}$' THEN RETURN; END IF;

  SELECT d.id INTO v_dosen_id FROM public.dosen d WHERE d.share_token = p_token;
  IF v_dosen_id IS NULL THEN RETURN; END IF;

  SELECT COALESCE(SUM(nominal_anggaran), 0) INTO v_total_anggaran
  FROM public.alokasi_anggaran
  WHERE dosen_id = v_dosen_id AND tahun = p_tahun;

  RETURN QUERY
  WITH monthly AS (
    SELECT
      TO_CHAR(r.tanggal_realisasi, 'Mon') AS bulan_label,
      EXTRACT(MONTH FROM r.tanggal_realisasi)::INT AS bulan_num,
      SUM(r.nominal)::BIGINT AS total_real
    FROM public.realisasi_anggaran r
    JOIN public.alokasi_anggaran a ON a.id = r.alokasi_id
    WHERE a.dosen_id = v_dosen_id
      AND a.tahun = p_tahun
    GROUP BY bulan_label, bulan_num
  )
  SELECT
    m.bulan_label AS bulan,
    m.total_real AS realisasi,
    GREATEST(0, v_total_anggaran - m.total_real)::BIGINT AS sisa
  FROM monthly m
  ORDER BY m.bulan_num;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_dosen_monthly_summary(TEXT, SMALLINT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_dosen_monthly_summary(TEXT, SMALLINT) TO anon;
