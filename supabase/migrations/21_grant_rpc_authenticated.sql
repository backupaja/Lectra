-- 21_grant_rpc_authenticated.sql
GRANT EXECUTE ON FUNCTION public.get_dosen_profile(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dosen_alokasi(TEXT, SMALLINT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dosen_realisasi(TEXT, SMALLINT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dosen_monthly_summary(TEXT, SMALLINT) TO authenticated;
