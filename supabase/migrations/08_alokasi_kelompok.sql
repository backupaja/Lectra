CREATE TABLE IF NOT EXISTS public.alokasi_dosen_tambahan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alokasi_id UUID NOT NULL REFERENCES public.alokasi_anggaran(id) ON DELETE CASCADE,
    dosen_id UUID NOT NULL REFERENCES public.dosen(id) ON DELETE CASCADE,
    UNIQUE(alokasi_id, dosen_id)
);

ALTER TABLE public.alokasi_dosen_tambahan ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for all" ON public.alokasi_dosen_tambahan;
CREATE POLICY "Enable read for all" ON public.alokasi_dosen_tambahan FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON public.alokasi_dosen_tambahan;
CREATE POLICY "Enable insert for all" ON public.alokasi_dosen_tambahan FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable delete for all" ON public.alokasi_dosen_tambahan;
CREATE POLICY "Enable delete for all" ON public.alokasi_dosen_tambahan FOR DELETE USING (true);

DROP FUNCTION IF EXISTS public.get_dosen_alokasi(text, smallint, text);
-- Update get_dosen_alokasi
CREATE OR REPLACE FUNCTION public.get_dosen_alokasi(p_token TEXT, p_tahun SMALLINT, p_jenis TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  keperluan TEXT,
  keterangan TEXT,
  jenis_anggaran VARCHAR,
  nominal_anggaran BIGINT,
  total_realisasi BIGINT,
  sisa_anggaran BIGINT,
  persentase_terpakai NUMERIC
)
LANGUAGE plpgsql SECURITY DEFINER
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
  WITH realisasi_sum AS (
    SELECT r.alokasi_id, SUM(r.nominal) as total
    FROM public.realisasi_anggaran r
    GROUP BY r.alokasi_id
  )
  SELECT
    a.id,
    a.keperluan,
    a.keterangan,
    a.jenis_anggaran,
    a.nominal_anggaran,
    COALESCE(rs.total, 0)::BIGINT AS total_realisasi,
    (a.nominal_anggaran - COALESCE(rs.total, 0))::BIGINT AS sisa_anggaran,
    CASE
      WHEN a.nominal_anggaran > 0 THEN ROUND((COALESCE(rs.total, 0)::NUMERIC / a.nominal_anggaran) * 100, 2)
      ELSE 0
    END AS persentase_terpakai
  FROM public.alokasi_anggaran a
  LEFT JOIN realisasi_sum rs ON rs.alokasi_id = a.id
  WHERE (a.dosen_id = v_dosen_id OR EXISTS (SELECT 1 FROM public.alokasi_dosen_tambahan adt WHERE adt.alokasi_id = a.id AND adt.dosen_id = v_dosen_id))
    AND a.tahun = p_tahun
    AND (p_jenis IS NULL OR a.jenis_anggaran = p_jenis)
  ORDER BY a.created_at DESC;
END;
$$;

DROP FUNCTION IF EXISTS public.get_dosen_realisasi(text, smallint, text);
-- Update get_dosen_realisasi
CREATE OR REPLACE FUNCTION public.get_dosen_realisasi(p_token TEXT, p_tahun SMALLINT, p_jenis TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  alokasi_id UUID,
  tanggal_realisasi DATE,
  nominal BIGINT,
  keterangan TEXT,
  nomor_simkug TEXT,
  bukti_url TEXT,
  keperluan_alokasi TEXT
)
LANGUAGE plpgsql SECURITY DEFINER
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
    r.id,
    r.alokasi_id,
    r.tanggal_realisasi,
    r.nominal,
    r.keterangan,
    r.nomor_simkug,
    r.bukti_url,
    a.keperluan as keperluan_alokasi
  FROM public.realisasi_anggaran r
  JOIN public.alokasi_anggaran a ON a.id = r.alokasi_id
  WHERE (a.dosen_id = v_dosen_id OR EXISTS (SELECT 1 FROM public.alokasi_dosen_tambahan adt WHERE adt.alokasi_id = a.id AND adt.dosen_id = v_dosen_id))
    AND a.tahun = p_tahun
    AND (p_jenis IS NULL OR a.jenis_anggaran = p_jenis)
  ORDER BY r.tanggal_realisasi ASC;
END;
$$;

DROP FUNCTION IF EXISTS public.get_dosen_dashboard_stats(text, smallint);
-- Update get_dosen_dashboard_stats
CREATE OR REPLACE FUNCTION public.get_dosen_dashboard_stats(p_token TEXT, p_tahun SMALLINT)
RETURNS TABLE (
  bulan_label TEXT,
  bulan_num INTEGER,
  total_realisasi BIGINT,
  total_anggaran BIGINT,
  persentase_akumulasi NUMERIC
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dosen_id UUID;
  v_total_anggaran BIGINT;
BEGIN
  IF p_token IS NULL OR p_token !~ '^[0-9a-f]{64}$' THEN RETURN; END IF;

  SELECT d.id INTO v_dosen_id FROM public.dosen d WHERE d.share_token = p_token;
  IF v_dosen_id IS NULL THEN RETURN; END IF;

  SELECT COALESCE(SUM(a.nominal_anggaran), 0) INTO v_total_anggaran
  FROM public.alokasi_anggaran a
  WHERE (a.dosen_id = v_dosen_id OR EXISTS (SELECT 1 FROM public.alokasi_dosen_tambahan adt WHERE adt.alokasi_id = a.id AND adt.dosen_id = v_dosen_id))
    AND a.tahun = p_tahun;

  RETURN QUERY
  WITH monthly AS (
    SELECT 
      TO_CHAR(r.tanggal_realisasi, 'Mon') AS bulan_label,
      EXTRACT(MONTH FROM r.tanggal_realisasi) AS bulan_num,
      SUM(r.nominal)::BIGINT AS total_real
    FROM public.realisasi_anggaran r
    JOIN public.alokasi_anggaran a ON a.id = r.alokasi_id
    WHERE (a.dosen_id = v_dosen_id OR EXISTS (SELECT 1 FROM public.alokasi_dosen_tambahan adt WHERE adt.alokasi_id = a.id AND adt.dosen_id = v_dosen_id))
      AND a.tahun = p_tahun
    GROUP BY bulan_label, bulan_num
  )
  SELECT
    m.bulan_label,
    m.bulan_num::INTEGER,
    m.total_real,
    v_total_anggaran AS total_anggaran,
    CASE 
      WHEN v_total_anggaran > 0 THEN ROUND((SUM(m.total_real) OVER (ORDER BY m.bulan_num) / v_total_anggaran) * 100, 2)
      ELSE 0
    END AS persentase_akumulasi
  FROM monthly m
  ORDER BY m.bulan_num;
END;
$$;
