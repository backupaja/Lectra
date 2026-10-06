-- 06_jad_features.sql

-- 1. Table progress_jad
CREATE TABLE IF NOT EXISTS public.progress_jad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dosen_id UUID NOT NULL REFERENCES public.dosen(id) ON DELETE CASCADE,
    tahun SMALLINT NOT NULL CHECK (tahun >= 2000 AND tahun <= 2100),
    jabatan_awal TEXT,
    jabatan_target TEXT,
    status TEXT NOT NULL DEFAULT 'BELUM ADA DATA' CHECK (status IN ('BELUM ADA DATA', 'DALAM PROSES', 'TERCAPAI', 'BELUM TERCAPAI', 'TIDAK DITARGETKAN')),
    tanggal_sk DATE,
    nomor_sk TEXT,
    dokumen_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dosen_id, tahun),
    CONSTRAINT chk_tercapai_sk CHECK (status != 'TERCAPAI' OR (tanggal_sk IS NOT NULL AND dokumen_path IS NOT NULL))
);

-- Index
CREATE INDEX IF NOT EXISTS idx_progress_jad_lookup ON public.progress_jad(dosen_id, tahun);

-- RLS untuk tabel progress_jad
ALTER TABLE public.progress_jad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_jad FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.progress_jad FROM anon, authenticated;

-- Admin Policy (Full Access)
DROP POLICY IF EXISTS "Admin full access progress_jad" ON public.progress_jad;
CREATE POLICY "Admin full access progress_jad" 
ON public.progress_jad 
FOR ALL 
TO authenticated 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- 2. Storage Bucket dokumen_jad
INSERT INTO storage.buckets (id, name, public) 
VALUES ('dokumen_jad', 'dokumen_jad', false) 
ON CONFLICT (id) DO NOTHING;

-- RLS untuk Storage Bucket dokumen_jad
DROP POLICY IF EXISTS "Admin full access dokumen_jad objects" ON storage.objects;
CREATE POLICY "Admin full access dokumen_jad objects"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'dokumen_jad' AND public.is_admin())
WITH CHECK (bucket_id = 'dokumen_jad' AND public.is_admin());

-- 3. RPC Public Penerima Anggaran
DROP FUNCTION IF EXISTS public.get_public_penerima_anggaran(SMALLINT, TEXT);

CREATE OR REPLACE FUNCTION public.get_public_penerima_anggaran(p_tahun SMALLINT, p_jenis TEXT)
RETURNS TABLE (
    dosen_id UUID,
    nip TEXT,
    nama TEXT,
    fakultas TEXT,
    program_studi TEXT,
    jenis_anggaran TEXT,
    nominal_anggaran BIGINT
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
        a.nominal_anggaran
    FROM public.alokasi_anggaran a
    JOIN public.dosen d ON a.dosen_id = d.id
    WHERE a.tahun = p_tahun AND a.jenis_anggaran = p_jenis
    ORDER BY d.nama ASC;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_public_penerima_anggaran(SMALLINT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_penerima_anggaran(SMALLINT, TEXT) TO anon, authenticated;

-- 4. RPC Public Summary JAD
DROP FUNCTION IF EXISTS public.get_public_jad_summary(SMALLINT);
DROP FUNCTION IF EXISTS public.get_public_jad_summary(SMALLINT, TEXT);

CREATE OR REPLACE FUNCTION public.get_public_jad_summary(p_tahun SMALLINT, p_jenis TEXT DEFAULT 'all')
RETURNS TABLE (
    total_dosen_penerima BIGINT,
    total_tercapai BIGINT,
    total_dalam_proses BIGINT,
    total_belum_tercapai BIGINT,
    total_belum_ada_data BIGINT,
    total_tidak_ditargetkan BIGINT,
    persentase_keberhasilan NUMERIC,
    anggaran_tercapai BIGINT,
    anggaran_dalam_proses BIGINT,
    anggaran_belum_tercapai BIGINT,
    anggaran_belum_ada_data BIGINT,
    anggaran_tidak_ditargetkan BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH RekapDosen AS (
        -- Group anggaran per dosen (semua jenis OPEX/CAPEX)
        SELECT 
            dosen_id, 
            SUM(nominal_anggaran)::BIGINT AS total_nominal
        FROM public.alokasi_anggaran 
        WHERE tahun = p_tahun 
        AND (p_jenis = 'all' OR jenis_anggaran = p_jenis)
        GROUP BY dosen_id
    ),
    RekapJAD AS (
        -- Left join dengan progress_jad. Jika belum ada (NULL), gunakan 'BELUM TERCAPAI'
        SELECT 
            r.dosen_id,
            r.total_nominal,
            COALESCE(p.status, 'BELUM TERCAPAI') AS status_jad
        FROM RekapDosen r
        LEFT JOIN public.progress_jad p ON p.dosen_id = r.dosen_id AND p.tahun = p_tahun
    )
    SELECT
        COUNT(dosen_id)::BIGINT AS total_dosen_penerima,
        COUNT(dosen_id) FILTER (WHERE status_jad = 'TERCAPAI')::BIGINT AS total_tercapai,
        COUNT(dosen_id) FILTER (WHERE status_jad = 'DALAM PROSES')::BIGINT AS total_dalam_proses,
        COUNT(dosen_id) FILTER (WHERE status_jad = 'BELUM TERCAPAI')::BIGINT AS total_belum_tercapai,
        COUNT(dosen_id) FILTER (WHERE status_jad = 'BELUM ADA DATA')::BIGINT AS total_belum_ada_data,
        COUNT(dosen_id) FILTER (WHERE status_jad = 'TIDAK DITARGETKAN')::BIGINT AS total_tidak_ditargetkan,
        
        -- Rumus Persentase (hanya menghitung Tercapai / (Tercapai + Dalam Proses + Belum Tercapai))
        COALESCE(
            ROUND(
                (COUNT(dosen_id) FILTER (WHERE status_jad = 'TERCAPAI') * 100.0) / 
                NULLIF(COUNT(dosen_id) FILTER (WHERE status_jad IN ('TERCAPAI', 'DALAM PROSES', 'BELUM TERCAPAI')), 0)
            , 1), 
        0)::NUMERIC AS persentase_keberhasilan,
        
        -- Total anggaran berdasarkan status JAD (tanpa double counting karena sudah digrouping di awal)
        COALESCE(SUM(total_nominal) FILTER (WHERE status_jad = 'TERCAPAI'), 0)::BIGINT AS anggaran_tercapai,
        COALESCE(SUM(total_nominal) FILTER (WHERE status_jad = 'DALAM PROSES'), 0)::BIGINT AS anggaran_dalam_proses,
        COALESCE(SUM(total_nominal) FILTER (WHERE status_jad = 'BELUM TERCAPAI'), 0)::BIGINT AS anggaran_belum_tercapai,
        COALESCE(SUM(total_nominal) FILTER (WHERE status_jad = 'BELUM ADA DATA'), 0)::BIGINT AS anggaran_belum_ada_data,
        COALESCE(SUM(total_nominal) FILTER (WHERE status_jad = 'TIDAK DITARGETKAN'), 0)::BIGINT AS anggaran_tidak_ditargetkan
    FROM RekapJAD;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_public_jad_summary(SMALLINT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_jad_summary(SMALLINT, TEXT) TO anon, authenticated;

-- 5. RPC Admin Detail JAD (Optional but helpful for admin list avoiding N+1)
DROP FUNCTION IF EXISTS public.get_admin_jad_list(SMALLINT);

CREATE OR REPLACE FUNCTION public.get_admin_jad_list(p_tahun SMALLINT)
RETURNS TABLE (
    dosen_id UUID,
    nama TEXT,
    nip TEXT,
    fakultas TEXT,
    program_studi TEXT,
    nominal_anggaran BIGINT,
    nominal_terpakai BIGINT,
    jenis_anggaran TEXT,
    opex_nominal BIGINT,
    opex_terpakai BIGINT,
    capex_nominal BIGINT,
    capex_terpakai BIGINT,
    progress_jad_id UUID,
    jabatan_awal TEXT,
    jabatan_target TEXT,
    status TEXT,
    tanggal_sk DATE,
    nomor_sk TEXT,
    dokumen_path TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH AlokasiWithRealisasi AS (
        SELECT 
            a.id,
            a.dosen_id,
            a.nominal_anggaran,
            a.jenis_anggaran,
            COALESCE(SUM(real.nominal), 0) AS terpakai
        FROM public.alokasi_anggaran a
        LEFT JOIN public.realisasi_anggaran real ON real.alokasi_id = a.id
        WHERE a.tahun = p_tahun
        GROUP BY a.id
    ),
    RekapDosen AS (
        SELECT 
            AlokasiWithRealisasi.dosen_id AS rd_dosen_id, 
            SUM(AlokasiWithRealisasi.nominal_anggaran)::BIGINT AS rd_total_nominal,
            SUM(AlokasiWithRealisasi.terpakai)::BIGINT AS rd_nominal_terpakai,
            STRING_AGG(DISTINCT AlokasiWithRealisasi.jenis_anggaran, ', ') AS rd_jenis_anggaran,
            SUM(AlokasiWithRealisasi.nominal_anggaran) FILTER (WHERE AlokasiWithRealisasi.jenis_anggaran = 'OPEX')::BIGINT AS rd_opex_nominal,
            SUM(AlokasiWithRealisasi.terpakai) FILTER (WHERE AlokasiWithRealisasi.jenis_anggaran = 'OPEX')::BIGINT AS rd_opex_terpakai,
            SUM(AlokasiWithRealisasi.nominal_anggaran) FILTER (WHERE AlokasiWithRealisasi.jenis_anggaran = 'CAPEX')::BIGINT AS rd_capex_nominal,
            SUM(AlokasiWithRealisasi.terpakai) FILTER (WHERE AlokasiWithRealisasi.jenis_anggaran = 'CAPEX')::BIGINT AS rd_capex_terpakai
        FROM AlokasiWithRealisasi
        GROUP BY AlokasiWithRealisasi.dosen_id
    )
    SELECT 
        d.id AS dosen_id,
        d.nama,
        d.nip,
        d.fakultas,
        d.program_studi,
        r.rd_total_nominal AS nominal_anggaran,
        r.rd_nominal_terpakai AS nominal_terpakai,
        r.rd_jenis_anggaran AS jenis_anggaran,
        COALESCE(r.rd_opex_nominal, 0) AS opex_nominal,
        COALESCE(r.rd_opex_terpakai, 0) AS opex_terpakai,
        COALESCE(r.rd_capex_nominal, 0) AS capex_nominal,
        COALESCE(r.rd_capex_terpakai, 0) AS capex_terpakai,
        p.id AS progress_jad_id,
        COALESCE(p.jabatan_awal, d.jabatan_fungsional) AS jabatan_awal,
        p.jabatan_target AS jabatan_target,
        COALESCE(p.status, 'BELUM TERCAPAI') AS status,
        p.tanggal_sk,
        p.nomor_sk,
        p.dokumen_path
    FROM RekapDosen r
    JOIN public.dosen d ON d.id = r.rd_dosen_id
    LEFT JOIN public.progress_jad p ON p.dosen_id = d.id AND p.tahun = p_tahun
    ORDER BY d.nama ASC;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_admin_jad_list(SMALLINT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_jad_list(SMALLINT) TO authenticated;

-- 6. RPC Public Dosen Profile
DROP FUNCTION IF EXISTS public.get_public_dosen_profile(UUID);
CREATE OR REPLACE FUNCTION public.get_public_dosen_profile(p_dosen_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_dosen JSON;
    v_alokasi JSON;
    v_jad JSON;
BEGIN
    SELECT row_to_json(d) INTO v_dosen
    FROM (
        SELECT id, nama, nip, fakultas, program_studi, jabatan_fungsional
        FROM public.dosen
        WHERE id = p_dosen_id
    ) d;

    SELECT json_agg(row_to_json(a)) INTO v_alokasi
    FROM (
        SELECT tahun, jenis_anggaran, nominal_anggaran
        FROM public.alokasi_anggaran
        WHERE dosen_id = p_dosen_id
        ORDER BY tahun DESC
    ) a;

    SELECT json_agg(row_to_json(j)) INTO v_jad
    FROM (
        SELECT tahun, jabatan_awal, jabatan_target, status, tanggal_sk
        FROM public.progress_jad
        WHERE dosen_id = p_dosen_id
        ORDER BY tahun DESC
    ) j;

    RETURN json_build_object(
        'dosen', v_dosen,
        'alokasi', COALESCE(v_alokasi, '[]'::json),
        'jad', COALESCE(v_jad, '[]'::json)
    );
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_public_dosen_profile(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_dosen_profile(UUID) TO anon, authenticated;
