-- Seed Data for CAPEX 2026
DO $$
DECLARE
  v_d1 UUID; v_d2 UUID; v_d3 UUID;
  v_d4 UUID; v_d5 UUID; v_d6 UUID;

  v_a1 UUID := gen_random_uuid(); v_a2 UUID := gen_random_uuid(); v_a3 UUID := gen_random_uuid();
  v_a4 UUID := gen_random_uuid(); v_a5 UUID := gen_random_uuid(); v_a6 UUID := gen_random_uuid();
BEGIN

  -- 1. INDRA CHANDRA
  SELECT id INTO v_d1 FROM public.dosen WHERE nama ILIKE 'INDRA CHANDRA';
  IF v_d1 IS NULL THEN
    v_d1 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d1, 'INDRA CHANDRA', '08810031-1', 'FTE', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '08810031-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor' WHERE id = v_d1;
  END IF;

  -- 2. BUDI PRASETYA
  SELECT id INTO v_d2 FROM public.dosen WHERE nama ILIKE 'BUDI PRASETYA';
  IF v_d2 IS NULL THEN
    v_d2 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d2, 'BUDI PRASETYA', '01750049-1', 'FTE', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '01750049-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d2;
  END IF;

  -- 3. ISTIKMAL
  SELECT id INTO v_d3 FROM public.dosen WHERE nama ILIKE 'ISTIKMAL';
  IF v_d3 IS NULL THEN
    v_d3 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d3, 'ISTIKMAL', '08790051-1', 'FTE', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '08790051-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d3;
  END IF;

  -- 4. YUDHA PURWANTO
  SELECT id INTO v_d4 FROM public.dosen WHERE nama ILIKE 'YUDHA PURWANTO';
  IF v_d4 IS NULL THEN
    v_d4 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d4, 'YUDHA PURWANTO', '02770066-1', 'FTE', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '02770066-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d4;
  END IF;

  -- 5. BAYU ERFIANTO
  SELECT id INTO v_d5 FROM public.dosen WHERE nama ILIKE 'BAYU ERFIANTO';
  IF v_d5 IS NULL THEN
    v_d5 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d5, 'BAYU ERFIANTO', '05730058-1', 'FIF', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '05730058-1', fakultas = 'FIF', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d5;
  END IF;

  -- 6. ANGGUN FITRIAN ISNAWATI
  SELECT id INTO v_d6 FROM public.dosen WHERE nama ILIKE 'ANGGUN FITRIAN ISNAWATI';
  IF v_d6 IS NULL THEN
    v_d6 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d6, 'ANGGUN FITRIAN ISNAWATI', '02780045-1', 'TUP', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '02780045-1', fakultas = 'TUP', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d6;
  END IF;

  -- Insert Alokasi Anggaran (CAPEX 2026)
  INSERT INTO public.alokasi_anggaran (id, dosen_id, tahun, jenis_anggaran, keperluan, kelompok_keahlian, nominal_anggaran, jabatan_awal, target_jabatan) VALUES
  (v_a1, v_d1, 2026, 'CAPEX', '["Kanomax, Inc. remote particle sensor model 3718 / 3719 / 3720-06 / 3715- 06 / 3715-06D"]', 'Lab Insight', 196000000, 'Lektor', 'Lektor Kepala'),
  (v_a2, v_d2, 2026, 'CAPEX', '["Komponen channel transceiver USRP B210 SDR Kit - dua"]', 'Lab Elektronika RF', 35000000, 'Lektor Kepala', 'Guru Besar'),
  (v_a3, v_d3, 2026, 'CAPEX', '["PC server Intel Core i9 14900K - RAM 64GB DDR5 - SSD 500GB NVMe PCIe 4.0 Monitor server 27 inch"]', 'Lab Adaptive Network', 24000000, 'Lektor Kepala', 'Guru Besar'),
  (v_a4, v_d4, 2026, 'CAPEX', '["Upgrade simulator - Motherboard asus chosshair x670e am5 - ryzen 9 9950x - RAM 32GB"]', 'Seculab', 25000000, 'Lektor Kepala', 'Guru Besar'),
  (v_a5, v_d5, 2026, 'CAPEX', '["Multispectral Camera untuk Spectral Gas Emission Mapping Riset"]', 'Lab IoT', 10000000, 'Lektor Kepala', 'Guru Besar'),
  (v_a6, v_d6, 2026, 'CAPEX', '["1. NAS Server - BeeStation 4TB personal cloud backup y synology", "2. Adam Pluto - Tuner RF SDR ADALM-PLUTO plutosdr AD9363 original from analog devices"]', 'Lab Pengolahan Sinyal Digital', 10000000, 'Lektor Kepala', 'Guru Besar');

END $$;
