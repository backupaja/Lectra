-- Seed Data for CAPEX 2026
DO $$
DECLARE
  v_d1 UUID;
  v_a1 UUID := gen_random_uuid();
  v_d2 UUID;
  v_a2 UUID := gen_random_uuid();
  v_d3 UUID;
  v_a3 UUID := gen_random_uuid();
  v_d4 UUID;
  v_a4 UUID := gen_random_uuid();
  v_d5 UUID;
  v_a5 UUID := gen_random_uuid();
  v_d6 UUID;
  v_a6 UUID := gen_random_uuid();
  v_d7 UUID;
  v_a7 UUID := gen_random_uuid();
  v_d8 UUID;
  v_a8 UUID := gen_random_uuid();
  v_d9 UUID;
  v_a9 UUID := gen_random_uuid();
  v_d10 UUID;
  v_a10 UUID := gen_random_uuid();
BEGIN

  -- 1. DENNY DARLIS
  SELECT id INTO v_d1 FROM public.dosen WHERE nama ILIKE 'DENNY DARLIS' LIMIT 1;
  IF v_d1 IS NULL THEN
    v_d1 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d1, 'DENNY DARLIS', '13770026-1', 'FIT', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '13770026-1', fakultas = 'FIT', jabatan_fungsional = 'Lektor' WHERE id = v_d1;
  END IF;

  -- 2. ERNA HIKMAWATI
  SELECT id INTO v_d2 FROM public.dosen WHERE nama ILIKE 'ERNA HIKMAWATI' LIMIT 1;
  IF v_d2 IS NULL THEN
    v_d2 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d2, 'ERNA HIKMAWATI', '26920004-1', 'FIT', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '26920004-1', fakultas = 'FIT', jabatan_fungsional = 'Lektor' WHERE id = v_d2;
  END IF;

  -- 3. LEANNA VIDYA YOVITA
  SELECT id INTO v_d3 FROM public.dosen WHERE nama ILIKE 'LEANNA VIDYA YOVITA' LIMIT 1;
  IF v_d3 IS NULL THEN
    v_d3 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d3, 'LEANNA VIDYA YOVITA', '08830038-1', 'FTE', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '08830038-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor' WHERE id = v_d3;
  END IF;

  -- 4. WILLY ANUGRAH CAHYADI
  SELECT id INTO v_d4 FROM public.dosen WHERE nama ILIKE 'WILLY ANUGRAH CAHYADI' LIMIT 1;
  IF v_d4 IS NULL THEN
    v_d4 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d4, 'WILLY ANUGRAH CAHYADI', '22850009-1', 'FTE', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '22850009-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor' WHERE id = v_d4;
  END IF;

  -- 5. ARINI ARUMSARI
  SELECT id INTO v_d5 FROM public.dosen WHERE nama ILIKE 'ARINI ARUMSARI' LIMIT 1;
  IF v_d5 IS NULL THEN
    v_d5 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d5, 'ARINI ARUMSARI', '14850026-1', 'FIK', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '14850026-1', fakultas = 'FIK', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d5;
  END IF;

  -- 6. GIVA ANDRIANA MUTIARA
  SELECT id INTO v_d6 FROM public.dosen WHERE nama ILIKE 'GIVA ANDRIANA MUTIARA' LIMIT 1;
  IF v_d6 IS NULL THEN
    v_d6 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d6, 'GIVA ANDRIANA MUTIARA', '14760020-1', 'FIT', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '14760020-1', fakultas = 'FIT', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d6;
  END IF;

  -- 7. HILAL HUDAN NUHA
  SELECT id INTO v_d7 FROM public.dosen WHERE nama ILIKE 'HILAL HUDAN NUHA' LIMIT 1;
  IF v_d7 IS NULL THEN
    v_d7 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d7, 'HILAL HUDAN NUHA', '13860093-1', 'FIF', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '13860093-1', fakultas = 'FIF', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d7;
  END IF;

  -- 8. Z. K. ABDURAHMAN BAIZAL
  SELECT id INTO v_d8 FROM public.dosen WHERE nama ILIKE 'Z. K. ABDURAHMAN BAIZAL' LIMIT 1;
  IF v_d8 IS NULL THEN
    v_d8 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d8, 'Z. K. ABDURAHMAN BAIZAL', '99750047-1', 'FIF', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '99750047-1', fakultas = 'FIF', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d8;
  END IF;

  -- 9. ALFIN HIKMATUROKHMAN
  SELECT id INTO v_d9 FROM public.dosen WHERE nama ILIKE 'ALFIN HIKMATUROKHMAN' LIMIT 1;
  IF v_d9 IS NULL THEN
    v_d9 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d9, 'ALFIN HIKMATUROKHMAN', '03780042-1', 'TUP', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '03780042-1', fakultas = 'TUP', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d9;
  END IF;

  -- 10. KAMELIA
  SELECT id INTO v_d10 FROM public.dosen WHERE nama ILIKE 'KAMELIA' LIMIT 1;
  IF v_d10 IS NULL THEN
    v_d10 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d10, 'KAMELIA', '23850013-1', 'TUJ', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '23850013-1', fakultas = 'TUJ', jabatan_fungsional = 'Lektor' WHERE id = v_d10;
  END IF;

  -- Insert Alokasi Anggaran (CAPEX 2026)
  INSERT INTO public.alokasi_anggaran (id, dosen_id, tahun, jenis_anggaran, keperluan, kelompok_keahlian, nominal_anggaran, jabatan_awal, target_jabatan) VALUES
  (v_a1, v_d1, 2026, 'CAPEX', '["Zybo Z7 - Zynq-7000 ARM/FPGA SoC", "Development Board - Zybo Z7-10", "AMD Kria KV260 Vision AI Starter Kit", "Cyclone® V SoC with Dual-core ARM CortexA9 (HPS)"]', 'KK Applied Information Technology and Multimedia / Bengkel Telemektronika Laboratorium', 48940000, 'Lektor', 'Lektor Kepala'),
  (v_a2, v_d2, 2026, 'CAPEX', '["VGA MSI Geforce RTX 3060 Ventus 2X OC 12GB -12 GB DDR6"]', 'KK Applied Information Technology and Multimedia / Bengkel Telemektronika Laboratorium', 11798000, 'Lektor', 'Lektor Kepala'),
  (v_a3, v_d3, 2026, 'CAPEX', '["Leadtek NVIDIA DGX Spark Founders Edition"]', 'Intelligent Communications and Networks / Adaptive Network', 118220867, 'Lektor', 'Lektor Kepala'),
  (v_a4, v_d4, 2026, 'CAPEX', '["1mm Sq/ 10 Sq Divisons, Stage Micrometer", "125mm, English Micrometer Z-Stage", "HP1700 380n-1700nm Model Nir", "Spectrometer Portable Power Analyzer"]', 'Control, Electronics and Intelligent System / Advanced Biomedical Intelligent Engineering Laboratory', 32500000, 'Lektor', 'Lektor Kepala'),
  (v_a5, v_d5, 2026, 'CAPEX', '["Mini Shredder / Mesin Pencacah / Mesin", "Penghancur - Precious Plastic Machine Pisau"]', 'Environment, Sustainability and Community / 3D Printing', 11500000, 'Lektor Kepala', 'Guru Besar'),
  (v_a6, v_d6, 2026, 'CAPEX', '["Pull Force gauge with Manual Test Stand", "Tension - AST-S (0-500N) Push"]', 'Applied Information Technology and Multimedia / Bengkel Telemektronika ', 23000000, 'Lektor Kepala', 'Guru Besar'),
  (v_a7, v_d7, 2026, 'CAPEX', '["Lenovo PC ThinkCentre M70t Gen 3 Intel Raven", "Black"]', 'Communication and Information Technology Infrastructure ', 25600000, 'Lektor Kepala', 'Guru Besar'),
  (v_a8, v_d8, 2026, 'CAPEX', '["PC Gaming Core i7 13700F I 32GB I RTX 4070 Ti", "I NVME I Gaming Editing"]', 'Data Science and Intelligent Systems / Big Data ', 28000000, 'Lektor Kepala', 'Guru Besar'),
  (v_a9, v_d9, 2026, 'CAPEX', '["PC Intel Core 5 210H 8GB SSD 512GB"]', 'Electronics and Telecomunications Science / Riset Lab ', 15000000, 'Lektor Kepala', 'Guru Besar'),
  (v_a10, v_d10, 2026, 'CAPEX', '["Rogers RT Duroid 5880", "Anritsu MS2028C 20 GHz Handheld VNA"]', 'Integrated Systems, Intelligence, and Human-Oriented Technologies / Antena', 35441133, 'Lektor', 'Lektor Kepala');

END $$;
