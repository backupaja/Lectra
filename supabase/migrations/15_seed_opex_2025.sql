-- Seed Data for OPEX 2025
DO $$
DECLARE
  v_d1 UUID; v_d2 UUID; v_d3 UUID;
  v_d4 UUID; v_d5 UUID; v_d6 UUID;
  v_d7 UUID; v_d8 UUID; v_d9 UUID;
  v_d10 UUID; v_d11 UUID; v_d12 UUID;
  v_d13 UUID; v_d14 UUID; v_d15 UUID;
  v_d16 UUID;

  v_a1 UUID := gen_random_uuid(); v_a2 UUID := gen_random_uuid(); v_a3 UUID := gen_random_uuid();
  v_a4 UUID := gen_random_uuid(); v_a5 UUID := gen_random_uuid(); v_a6 UUID := gen_random_uuid();
  v_a7 UUID := gen_random_uuid(); v_a8 UUID := gen_random_uuid(); v_a9 UUID := gen_random_uuid();
  v_a10 UUID := gen_random_uuid(); v_a11 UUID := gen_random_uuid(); v_a12 UUID := gen_random_uuid();
  v_a13 UUID := gen_random_uuid(); v_a14 UUID := gen_random_uuid(); v_a15 UUID := gen_random_uuid();
  v_a16 UUID := gen_random_uuid();
BEGIN

  -- 1. AGUS MAOLANA HIDAYAT
  SELECT id INTO v_d1 FROM public.dosen WHERE nama ILIKE 'AGUS MAOLANA HIDAYAT';
  IF v_d1 IS NULL THEN
    v_d1 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d1, 'AGUS MAOLANA HIDAYAT', '14680034-1', 'FEB', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '14680034-1', fakultas = 'FEB', jabatan_fungsional = 'Lektor' WHERE id = v_d1;
  END IF;

  -- 2. BAMBANG SUMAJUDIN
  SELECT id INTO v_d2 FROM public.dosen WHERE nama ILIKE 'BAMBANG SUMAJUDIN';
  IF v_d2 IS NULL THEN
    v_d2 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d2, 'BAMBANG SUMAJUDIN', '91640043-1', 'FTE', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '91640043-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor' WHERE id = v_d2;
  END IF;

  -- 3. DAMAYANTI OCTAVIA
  SELECT id INTO v_d3 FROM public.dosen WHERE nama ILIKE 'DAMAYANTI OCTAVIA';
  IF v_d3 IS NULL THEN
    v_d3 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d3, 'DAMAYANTI OCTAVIA', '10780055-1', 'FEB', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '10780055-1', fakultas = 'FEB', jabatan_fungsional = 'Lektor' WHERE id = v_d3;
  END IF;

  -- 4. ERWIN SUSANTO
  SELECT id INTO v_d4 FROM public.dosen WHERE nama ILIKE 'ERWIN SUSANTO';
  IF v_d4 IS NULL THEN
    v_d4 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d4, 'ERWIN SUSANTO', '07740045-1', 'FTE', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '07740045-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d4;
  END IF;

  -- 5. FAJAR CIPTANDI (Exists in 2022)
  SELECT id INTO v_d5 FROM public.dosen WHERE nama ILIKE 'FAJAR CIPTANDI';
  IF v_d5 IS NULL THEN
    v_d5 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d5, 'FAJAR CIPTANDI', '14860096-1', 'FIK', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '14860096-1', fakultas = 'FIK', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d5;
  END IF;

  -- 6. LEVY OLIVIA NUR
  SELECT id INTO v_d6 FROM public.dosen WHERE nama ILIKE 'LEVY OLIVIA NUR';
  IF v_d6 IS NULL THEN
    v_d6 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d6, 'LEVY OLIVIA NUR', '14780033-1', 'FTE', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '14780033-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d6;
  END IF;

  -- 7. MAYA ARIYANTI
  SELECT id INTO v_d7 FROM public.dosen WHERE nama ILIKE 'MAYA ARIYANTI';
  IF v_d7 IS NULL THEN
    v_d7 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d7, 'MAYA ARIYANTI', '08730016-1', 'FEB', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '08730016-1', fakultas = 'FEB', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d7;
  END IF;

  -- 8. MOHAMAD TOHIR
  SELECT id INTO v_d8 FROM public.dosen WHERE nama ILIKE 'MOHAMAD TOHIR';
  IF v_d8 IS NULL THEN
    v_d8 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d8, 'MOHAMAD TOHIR', '14650011-1', 'FIK', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '14650011-1', fakultas = 'FIK', jabatan_fungsional = 'Lektor' WHERE id = v_d8;
  END IF;

  -- 9. NOFHA RINA
  SELECT id INTO v_d9 FROM public.dosen WHERE nama ILIKE 'NOFHA RINA';
  IF v_d9 IS NULL THEN
    v_d9 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d9, 'NOFHA RINA', '19800003-1', 'FKS', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '19800003-1', fakultas = 'FKS', jabatan_fungsional = 'Lektor' WHERE id = v_d9;
  END IF;

  -- 10. PIKIR WISNU WIJAYANTO
  SELECT id INTO v_d10 FROM public.dosen WHERE nama ILIKE 'PIKIR WISNU WIJAYANTO';
  IF v_d10 IS NULL THEN
    v_d10 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d10, 'PIKIR WISNU WIJAYANTO', '10800029-1', 'FIT', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '10800029-1', fakultas = 'FIT', jabatan_fungsional = 'Lektor' WHERE id = v_d10;
  END IF;

  -- 11. PUSPITA WULANSARI
  SELECT id INTO v_d11 FROM public.dosen WHERE nama ILIKE 'PUSPITA WULANSARI';
  IF v_d11 IS NULL THEN
    v_d11 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d11, 'PUSPITA WULANSARI', '01770028-1', 'FEB', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '01770028-1', fakultas = 'FEB', jabatan_fungsional = 'Lektor' WHERE id = v_d11;
  END IF;

  -- 12. R. NURAFNI RUBIYANTI
  SELECT id INTO v_d12 FROM public.dosen WHERE nama ILIKE 'R. NURAFNI RUBIYANTI';
  IF v_d12 IS NULL THEN
    v_d12 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d12, 'R. NURAFNI RUBIYANTI', '13860020-1', 'FEB', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '13860020-1', fakultas = 'FEB', jabatan_fungsional = 'Lektor' WHERE id = v_d12;
  END IF;

  -- 13. SUPRAYOGI
  SELECT id INTO v_d13 FROM public.dosen WHERE nama ILIKE 'SUPRAYOGI';
  IF v_d13 IS NULL THEN
    v_d13 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d13, 'SUPRAYOGI', '93640025-1', 'FTE', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '93640025-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor' WHERE id = v_d13;
  END IF;

  -- 14. ANGGUN FITRIAN ISNAWATI
  SELECT id INTO v_d14 FROM public.dosen WHERE nama ILIKE 'ANGGUN FITRIAN ISNAWATI';
  IF v_d14 IS NULL THEN
    v_d14 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d14, 'ANGGUN FITRIAN ISNAWATI', '02780045-1', 'TUP', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '02780045-1', fakultas = 'TUP', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d14;
  END IF;

  -- 15. KHOIRUN NIAMAH
  SELECT id INTO v_d15 FROM public.dosen WHERE nama ILIKE 'KHOIRUN NIAMAH';
  IF v_d15 IS NULL THEN
    v_d15 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d15, 'KHOIRUN NIAMAH', '24930006-1', 'TUP', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '24930006-1', fakultas = 'TUP', jabatan_fungsional = 'Lektor' WHERE id = v_d15;
  END IF;

  -- 16. SOLICHAH LARASATI
  SELECT id INTO v_d16 FROM public.dosen WHERE nama ILIKE 'SOLICHAH LARASATI';
  IF v_d16 IS NULL THEN
    v_d16 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d16, 'SOLICHAH LARASATI', '20930037-1', 'TUP', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '20930037-1', fakultas = 'TUP', jabatan_fungsional = 'Lektor' WHERE id = v_d16;
  END IF;

  -- 2. Insert Alokasi Anggaran (OPEX 2025)
  INSERT INTO public.alokasi_anggaran (id, dosen_id, tahun, jenis_anggaran, keperluan, kelompok_keahlian, nominal_anggaran, jabatan_awal, target_jabatan) VALUES
  (v_a1, v_d1, 2025, 'OPEX', '["Proofreading", "Pengetikan Paper"]', 'Financial Economics', 5000000, 'Lektor', 'Lektor Kepala'),
  (v_a2, v_d2, 2025, 'OPEX', '["Pembelian alat-alat riset habis pakai dan fabrikasi peralatan pendukung penelitian"]', 'Alokasi Sumber Daya Radio dan Teknik Modulasi', 16000000, 'Lektor', 'Lektor Kepala'),
  (v_a3, v_d3, 2025, 'OPEX', '["Proofreading", "Biaya pengumpulan data", "Insentif pengisian kuesioner"]', 'Marketing Management', 12000000, 'Lektor', 'Lektor Kepala'),
  (v_a4, v_d4, 2025, 'OPEX', '["Penerbitan buku", "Pembuatan modul integrasi PV dan BESS"]', 'Model-based Control', 35000000, 'Lektor Kepala', 'Guru Besar'),
  (v_a5, v_d5, 2025, 'OPEX', '["Proofreading", "Pembelian alat eksperimen khamran portable", "Honorarium asisten penelitian"]', 'Tradition based Product', 24000000, 'Lektor Kepala', 'Guru Besar'),
  (v_a6, v_d6, 2025, 'OPEX', '["Editing buku ajar", "Proofreading"]', 'Wearable Antenna and RF Device', 7700000, 'Lektor Kepala', 'Guru Besar'),
  (v_a7, v_d7, 2025, 'OPEX', '["Proofreading"]', 'Marketing Management', 4000000, 'Lektor Kepala', 'Guru Besar'),
  (v_a8, v_d8, 2025, 'OPEX', '["Proofreading"]', 'Cultural Studies in Art & Design', 6250000, 'Lektor', 'Lektor Kepala'),
  (v_a9, v_d9, 2025, 'OPEX', '["Langganan software SmartPLS 4 profesional seat (1 Tahun)"]', 'Media and Cultural Studies', 12000000, 'Lektor', 'Lektor Kepala'),
  (v_a10, v_d10, 2025, 'OPEX', '["Workshop penulisan artikel bereputasi", "Biaya pengumpulan data dan analisis penyusunan buku"]', 'Applied Digital Transformation in Education and Skills', 22500000, 'Lektor', 'Lektor Kepala'),
  (v_a11, v_d11, 2025, 'OPEX', '["Penyusunan paper scopus", "Honorarium asisten penelitian"]', 'Human Capital Development', 17000000, 'Lektor', 'Lektor Kepala'),
  (v_a12, v_d12, 2025, 'OPEX', '["Proofreading", "Langganan software SmartPLS 4 profesional seat (1 Tahun)", "Honorarium asisten penelitian"]', 'Marketing Management', 20000000, 'Lektor', 'Lektor Kepala'),
  (v_a13, v_d13, 2025, 'OPEX', '["Penerbitan buku"]', 'Pemodelan Fisika dan Aplikasi Material', 5000000, 'Lektor', 'Lektor Kepala'),
  (v_a14, v_d14, 2025, 'OPEX', '["Proofreading", "Honorarium asisten penelitian"]', 'Interference Management', 4950000, 'Lektor Kepala', 'Guru Besar'),
  (v_a15, v_d15, 2025, 'OPEX', '["Honorarium asisten penelitian"]', 'Cellular Communication', 1050000, 'Lektor', 'Lektor Kepala'),
  (v_a16, v_d16, 2025, 'OPEX', '["Pengetikan, editing, dan penerbitan buku ISBN", "Honorarium asisten penelitian"]', 'Cellular Communication', 7550000, 'Lektor', 'Lektor Kepala');

END $$;
