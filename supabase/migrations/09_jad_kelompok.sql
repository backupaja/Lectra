-- 09_jad_kelompok.sql

-- 1. Tambah kolom jabatan di tabel alokasi_dosen_tambahan
ALTER TABLE public.alokasi_dosen_tambahan
ADD COLUMN IF NOT EXISTS jabatan_awal VARCHAR,
ADD COLUMN IF NOT EXISTS target_jabatan VARCHAR;

-- 1b. Tambah kolom tambahan di tabel alokasi_anggaran
ALTER TABLE public.alokasi_anggaran
ADD COLUMN IF NOT EXISTS kelompok_keahlian TEXT,
ADD COLUMN IF NOT EXISTS jabatan_awal TEXT,
ADD COLUMN IF NOT EXISTS target_jabatan TEXT,
ADD COLUMN IF NOT EXISTS pertanggungan TEXT;

-- 2. Update RPC get_public_penerima_anggaran
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
    WITH GabunganAlokasi AS (
        SELECT a.dosen_id, a.jenis_anggaran, a.nominal_anggaran
        FROM public.alokasi_anggaran a
        WHERE a.tahun = p_tahun AND a.jenis_anggaran = p_jenis
        UNION ALL
        SELECT adt.dosen_id, a.jenis_anggaran, a.nominal_anggaran
        FROM public.alokasi_dosen_tambahan adt
        JOIN public.alokasi_anggaran a ON a.id = adt.alokasi_id
        WHERE a.tahun = p_tahun AND a.jenis_anggaran = p_jenis
    )
    SELECT 
        d.id AS dosen_id,
        d.nip,
        d.nama,
        d.fakultas,
        d.program_studi,
        ga.jenis_anggaran,
        ga.nominal_anggaran
    FROM GabunganAlokasi ga
    JOIN public.dosen d ON ga.dosen_id = d.id
    ORDER BY d.nama ASC;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_penerima_anggaran(SMALLINT, TEXT) TO anon, authenticated;

-- 3. Update RPC get_public_jad_summary
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
    WITH GabunganAlokasi AS (
        SELECT a.dosen_id, a.jenis_anggaran, a.nominal_anggaran
        FROM public.alokasi_anggaran a
        WHERE a.tahun = p_tahun AND (p_jenis = 'all' OR a.jenis_anggaran = p_jenis)
        UNION ALL
        SELECT adt.dosen_id, a.jenis_anggaran, a.nominal_anggaran
        FROM public.alokasi_dosen_tambahan adt
        JOIN public.alokasi_anggaran a ON a.id = adt.alokasi_id
        WHERE a.tahun = p_tahun AND (p_jenis = 'all' OR a.jenis_anggaran = p_jenis)
    ),
    RekapDosen AS (
        SELECT 
            dosen_id, 
            SUM(nominal_anggaran)::BIGINT AS total_nominal
        FROM GabunganAlokasi
        GROUP BY dosen_id
    ),
    RekapJAD AS (
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
        COALESCE(
            ROUND(
                (COUNT(dosen_id) FILTER (WHERE status_jad = 'TERCAPAI') * 100.0) / 
                NULLIF(COUNT(dosen_id) FILTER (WHERE status_jad IN ('TERCAPAI', 'DALAM PROSES', 'BELUM TERCAPAI')), 0)
            , 1), 
        0)::NUMERIC AS persentase_keberhasilan,
        COALESCE(SUM(total_nominal) FILTER (WHERE status_jad = 'TERCAPAI'), 0)::BIGINT AS anggaran_tercapai,
        COALESCE(SUM(total_nominal) FILTER (WHERE status_jad = 'DALAM PROSES'), 0)::BIGINT AS anggaran_dalam_proses,
        COALESCE(SUM(total_nominal) FILTER (WHERE status_jad = 'BELUM TERCAPAI'), 0)::BIGINT AS anggaran_belum_tercapai,
        COALESCE(SUM(total_nominal) FILTER (WHERE status_jad = 'BELUM ADA DATA'), 0)::BIGINT AS anggaran_belum_ada_data,
        COALESCE(SUM(total_nominal) FILTER (WHERE status_jad = 'TIDAK DITARGETKAN'), 0)::BIGINT AS anggaran_tidak_ditargetkan
    FROM RekapJAD;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_jad_summary(SMALLINT, TEXT) TO anon, authenticated;

-- 4. Update RPC get_admin_jad_list
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
            a.jabatan_awal,
            a.target_jabatan,
            a.nominal_anggaran,
            a.jenis_anggaran,
            COALESCE(SUM(real.nominal), 0) AS terpakai
        FROM public.alokasi_anggaran a
        LEFT JOIN public.realisasi_anggaran real ON real.alokasi_id = a.id
        WHERE a.tahun = p_tahun
        GROUP BY a.id
        
        UNION ALL
        
        SELECT 
            a.id,
            adt.dosen_id,
            COALESCE(adt.jabatan_awal, a.jabatan_awal) AS jabatan_awal,
            COALESCE(adt.target_jabatan, a.target_jabatan) AS target_jabatan,
            a.nominal_anggaran,
            a.jenis_anggaran,
            COALESCE(SUM(real.nominal), 0) AS terpakai
        FROM public.alokasi_dosen_tambahan adt
        JOIN public.alokasi_anggaran a ON a.id = adt.alokasi_id
        LEFT JOIN public.realisasi_anggaran real ON real.alokasi_id = a.id
        WHERE a.tahun = p_tahun
        GROUP BY a.id, adt.dosen_id, adt.jabatan_awal, adt.target_jabatan
    ),
    RekapDosen AS (
        SELECT 
            AlokasiWithRealisasi.dosen_id AS rd_dosen_id, 
            MAX(AlokasiWithRealisasi.jabatan_awal) AS rd_jabatan_awal,
            MAX(AlokasiWithRealisasi.target_jabatan) AS rd_target_jabatan,
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
        COALESCE(p.jabatan_awal, r.rd_jabatan_awal, d.jabatan_fungsional) AS jabatan_awal,
        COALESCE(p.jabatan_target, r.rd_target_jabatan) AS jabatan_target,
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
GRANT EXECUTE ON FUNCTION public.get_admin_jad_list(SMALLINT) TO authenticated;

-- 5. Update RPC get_public_dosen_profile
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
        SELECT a.tahun, a.jenis_anggaran, a.nominal_anggaran
        FROM public.alokasi_anggaran a
        WHERE a.dosen_id = p_dosen_id
        
        UNION ALL
        
        SELECT a.tahun, a.jenis_anggaran, a.nominal_anggaran
        FROM public.alokasi_dosen_tambahan adt
        JOIN public.alokasi_anggaran a ON a.id = adt.alokasi_id
        WHERE adt.dosen_id = p_dosen_id
        
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
GRANT EXECUTE ON FUNCTION public.get_public_dosen_profile(UUID) TO anon, authenticated;
