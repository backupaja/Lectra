-- 03_rls.sql

-- ==========================================
-- RLS POLICIES FOR ADMIN
-- ==========================================

-- Dosen
CREATE POLICY "dosen_admin_all"
  ON public.dosen FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Alokasi Anggaran
CREATE POLICY "alokasi_admin_all"
  ON public.alokasi_anggaran FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Realisasi Anggaran
CREATE POLICY "realisasi_admin_all"
  ON public.realisasi_anggaran FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==========================================
-- RLS POLICIES FOR PUBLIC (READ-ONLY)
-- ==========================================

-- Dosen (Public read)
CREATE POLICY "dosen_public_read"
  ON public.dosen FOR SELECT
  USING (true);

-- Alokasi Anggaran (Public read)
CREATE POLICY "alokasi_public_read"
  ON public.alokasi_anggaran FOR SELECT
  USING (true);

-- Realisasi Anggaran (Public read)
CREATE POLICY "realisasi_public_read"
  ON public.realisasi_anggaran FOR SELECT
  USING (true);

-- ==========================================
-- TABLE PRIVILEGES FOR AUTHENTICATED
-- RLS tetap membatasi akses hanya untuk admin
-- ==========================================

GRANT SELECT ON public.dosen TO anon;
GRANT SELECT ON public.alokasi_anggaran TO anon;
GRANT SELECT ON public.realisasi_anggaran TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.dosen
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.alokasi_anggaran
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.realisasi_anggaran
TO authenticated;
