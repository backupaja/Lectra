-- 04_triggers.sql

-- ==========================================
-- TRIGGER: ENFORCE OPEX BUDGET LIMIT
-- ==========================================

CREATE OR REPLACE FUNCTION public.check_opex_budget_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_jenis_anggaran TEXT;
  v_nominal_anggaran BIGINT;
  v_total_realisasi_existing BIGINT;
BEGIN
  -- Dapatkan informasi alokasi
  SELECT jenis_anggaran, nominal_anggaran 
  INTO v_jenis_anggaran, v_nominal_anggaran
  FROM public.alokasi_anggaran
  WHERE id = NEW.alokasi_id
  FOR UPDATE;

  -- Hanya validasi untuk OPEX
  IF v_jenis_anggaran = 'OPEX' THEN
    SELECT COALESCE(SUM(nominal), 0)
    INTO v_total_realisasi_existing
    FROM public.realisasi_anggaran
    WHERE alokasi_id = NEW.alokasi_id
      AND (TG_OP = 'INSERT' OR id != NEW.id);

    IF (v_total_realisasi_existing + NEW.nominal) > v_nominal_anggaran THEN
      RAISE EXCEPTION 'OPEX budget limit exceeded. Allocated: %, Total with new request: %', 
        v_nominal_anggaran, (v_total_realisasi_existing + NEW.nominal);
    END IF;
  END IF;

  -- CAPEX dibiarkan over budget sesuai business rule
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_opex_budget_limit
BEFORE INSERT OR UPDATE ON public.realisasi_anggaran
FOR EACH ROW
EXECUTE FUNCTION public.check_opex_budget_limit();

-- ==========================================
-- TRIGGER: PREVENT INVALID ALOKASI STATE
-- ==========================================

CREATE OR REPLACE FUNCTION public.check_alokasi_update_validity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_realisasi_existing BIGINT;
BEGIN
  -- Only OPEX is restricted. If it's changing to OPEX or staying OPEX, validate.
  IF NEW.jenis_anggaran = 'OPEX' THEN
    -- Get current total realisasi for this alokasi
    SELECT COALESCE(SUM(nominal), 0)
    INTO v_total_realisasi_existing
    FROM public.realisasi_anggaran
    WHERE alokasi_id = NEW.id;

    -- If the new nominal is less than existing realisasi, or if converting from CAPEX to OPEX 
    -- makes it instantly over-budget, block the update.
    IF v_total_realisasi_existing > NEW.nominal_anggaran THEN
      RAISE EXCEPTION 'Cannot update allocation: new OPEX budget % is lower than existing realizations %', 
        NEW.nominal_anggaran, v_total_realisasi_existing;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_alokasi_validity
BEFORE UPDATE ON public.alokasi_anggaran
FOR EACH ROW
EXECUTE FUNCTION public.check_alokasi_update_validity();

-- ==========================================
-- FUNCTION EXECUTE PRIVILEGE HARDENING
-- ==========================================

REVOKE EXECUTE ON FUNCTION public.check_opex_budget_limit() FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.check_alokasi_update_validity() FROM PUBLIC;
