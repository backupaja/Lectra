-- Seed Data for OPEX 2026
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
  v_d11 UUID;
  v_a11 UUID := gen_random_uuid();
  v_d12 UUID;
  v_a12 UUID := gen_random_uuid();
  v_d13 UUID;
  v_a13 UUID := gen_random_uuid();
  v_d14 UUID;
  v_a14 UUID := gen_random_uuid();
  v_d15 UUID;
  v_a15 UUID := gen_random_uuid();
  v_d16 UUID;
  v_a16 UUID := gen_random_uuid();
  v_d17 UUID;
  v_a17 UUID := gen_random_uuid();
  v_d18 UUID;
  v_a18 UUID := gen_random_uuid();
  v_d19 UUID;
  v_a19 UUID := gen_random_uuid();
  v_d20 UUID;
  v_a20 UUID := gen_random_uuid();
  v_d21 UUID;
  v_a21 UUID := gen_random_uuid();
  v_d22 UUID;
  v_a22 UUID := gen_random_uuid();
  v_d23 UUID;
  v_a23 UUID := gen_random_uuid();
BEGIN

  -- 1. AHMAD SUGIANA
  SELECT id INTO v_d1 FROM public.dosen WHERE nama ILIKE 'AHMAD SUGIANA' LIMIT 1;
  IF v_d1 IS NULL THEN
    v_d1 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d1, 'AHMAD SUGIANA', '14770010-1', 'FTE', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '14770010-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor' WHERE id = v_d1;
  END IF;

  -- 2. ASEP SUHENDI
  SELECT id INTO v_d2 FROM public.dosen WHERE nama ILIKE 'ASEP SUHENDI' LIMIT 1;
  IF v_d2 IS NULL THEN
    v_d2 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d2, 'ASEP SUHENDI', '15800021-1', 'FTE', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '15800021-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor' WHERE id = v_d2;
  END IF;

  -- 3. DEDI KURNIA SYAH PUTRA
  SELECT id INTO v_d3 FROM public.dosen WHERE nama ILIKE 'DEDI KURNIA SYAH PUTRA' LIMIT 1;
  IF v_d3 IS NULL THEN
    v_d3 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d3, 'DEDI KURNIA SYAH PUTRA', '14880080-1', 'FKS', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '14880080-1', fakultas = 'FKS', jabatan_fungsional = 'Lektor' WHERE id = v_d3;
  END IF;

  -- 4. DENNY DARLIS
  SELECT id INTO v_d4 FROM public.dosen WHERE nama ILIKE 'DENNY DARLIS' LIMIT 1;
  IF v_d4 IS NULL THEN
    v_d4 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d4, 'DENNY DARLIS', '13770026-1', 'FIT', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '13770026-1', fakultas = 'FIT', jabatan_fungsional = 'Lektor' WHERE id = v_d4;
  END IF;

  -- 5. DWI FITRIZAL SALIM
  SELECT id INTO v_d5 FROM public.dosen WHERE nama ILIKE 'DWI FITRIZAL SALIM' LIMIT 1;
  IF v_d5 IS NULL THEN
    v_d5 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d5, 'DWI FITRIZAL SALIM', '22930023-1', 'FEB', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '22930023-1', fakultas = 'FEB', jabatan_fungsional = 'Lektor' WHERE id = v_d5;
  END IF;

  -- 6. ERNA HIKMAWATI
  SELECT id INTO v_d6 FROM public.dosen WHERE nama ILIKE 'ERNA HIKMAWATI' LIMIT 1;
  IF v_d6 IS NULL THEN
    v_d6 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d6, 'ERNA HIKMAWATI', '26920004-1', 'FIT', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '26920004-1', fakultas = 'FIT', jabatan_fungsional = 'Lektor' WHERE id = v_d6;
  END IF;

  -- 7. LEANNA VIDYA YOVITA
  SELECT id INTO v_d7 FROM public.dosen WHERE nama ILIKE 'LEANNA VIDYA YOVITA' LIMIT 1;
  IF v_d7 IS NULL THEN
    v_d7 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d7, 'LEANNA VIDYA YOVITA', '08830038-1', 'FTE', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '08830038-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor' WHERE id = v_d7;
  END IF;

  -- 8. MEMORIA ROSI
  SELECT id INTO v_d8 FROM public.dosen WHERE nama ILIKE 'MEMORIA ROSI' LIMIT 1;
  IF v_d8 IS NULL THEN
    v_d8 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d8, 'MEMORIA ROSI', '14840065-1', 'FTE', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '14840065-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor' WHERE id = v_d8;
  END IF;

  -- 9. PUSPITA KENCANA SARI
  SELECT id INTO v_d9 FROM public.dosen WHERE nama ILIKE 'PUSPITA KENCANA SARI' LIMIT 1;
  IF v_d9 IS NULL THEN
    v_d9 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d9, 'PUSPITA KENCANA SARI', '13850022-1', 'FEB', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '13850022-1', fakultas = 'FEB', jabatan_fungsional = 'Lektor' WHERE id = v_d9;
  END IF;

  -- 10. PUTRI FARISKA SUGESTIE
  SELECT id INTO v_d10 FROM public.dosen WHERE nama ILIKE 'PUTRI FARISKA SUGESTIE' LIMIT 1;
  IF v_d10 IS NULL THEN
    v_d10 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d10, 'PUTRI FARISKA SUGESTIE', '22840003-1', 'FEB', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '22840003-1', fakultas = 'FEB', jabatan_fungsional = 'Lektor' WHERE id = v_d10;
  END IF;

  -- 11. RANTI RACHMAWANTI
  SELECT id INTO v_d11 FROM public.dosen WHERE nama ILIKE 'RANTI RACHMAWANTI' LIMIT 1;
  IF v_d11 IS NULL THEN
    v_d11 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d11, 'RANTI RACHMAWANTI', '23840004-1', 'FIK', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '23840004-1', fakultas = 'FIK', jabatan_fungsional = 'Lektor' WHERE id = v_d11;
  END IF;

  -- 12. RUSTAM
  SELECT id INTO v_d12 FROM public.dosen WHERE nama ILIKE 'RUSTAM' LIMIT 1;
  IF v_d12 IS NULL THEN
    v_d12 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d12, 'RUSTAM', '22870006-1', 'FTE', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '22870006-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor' WHERE id = v_d12;
  END IF;

  -- 13. WILLY ANUGRAH CAHYADI
  SELECT id INTO v_d13 FROM public.dosen WHERE nama ILIKE 'WILLY ANUGRAH CAHYADI' LIMIT 1;
  IF v_d13 IS NULL THEN
    v_d13 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d13, 'WILLY ANUGRAH CAHYADI', '22850009-1', 'FTE', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '22850009-1', fakultas = 'FTE', jabatan_fungsional = 'Lektor' WHERE id = v_d13;
  END IF;

  -- 14. ARINI ARUMSARI
  SELECT id INTO v_d14 FROM public.dosen WHERE nama ILIKE 'ARINI ARUMSARI' LIMIT 1;
  IF v_d14 IS NULL THEN
    v_d14 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d14, 'ARINI ARUMSARI', '14850026-1', 'FIK', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '14850026-1', fakultas = 'FIK', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d14;
  END IF;

  -- 15. GIVA ANDRIANA MUTIARA
  SELECT id INTO v_d15 FROM public.dosen WHERE nama ILIKE 'GIVA ANDRIANA MUTIARA' LIMIT 1;
  IF v_d15 IS NULL THEN
    v_d15 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d15, 'GIVA ANDRIANA MUTIARA', '14760020-1', 'FIT', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '14760020-1', fakultas = 'FIT', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d15;
  END IF;

  -- 16. GRISNA ANGGADWITA
  SELECT id INTO v_d16 FROM public.dosen WHERE nama ILIKE 'GRISNA ANGGADWITA' LIMIT 1;
  IF v_d16 IS NULL THEN
    v_d16 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d16, 'GRISNA ANGGADWITA', '14860090-1', 'FEB', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '14860090-1', fakultas = 'FEB', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d16;
  END IF;

  -- 17. HILAL HUDAN NUHA
  SELECT id INTO v_d17 FROM public.dosen WHERE nama ILIKE 'HILAL HUDAN NUHA' LIMIT 1;
  IF v_d17 IS NULL THEN
    v_d17 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d17, 'HILAL HUDAN NUHA', '13860093-1', 'FIF', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '13860093-1', fakultas = 'FIF', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d17;
  END IF;

  -- 18. Z. K. ABDURAHMAN BAIZAL
  SELECT id INTO v_d18 FROM public.dosen WHERE nama ILIKE 'Z. K. ABDURAHMAN BAIZAL' LIMIT 1;
  IF v_d18 IS NULL THEN
    v_d18 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d18, 'Z. K. ABDURAHMAN BAIZAL', '99750047-1', 'FIF', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '99750047-1', fakultas = 'FIF', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d18;
  END IF;

  -- 19. ARIQ CAHYA WARDHANA
  SELECT id INTO v_d19 FROM public.dosen WHERE nama ILIKE 'ARIQ CAHYA WARDHANA' LIMIT 1;
  IF v_d19 IS NULL THEN
    v_d19 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d19, 'ARIQ CAHYA WARDHANA', '22930007-1', 'TUP', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '22930007-1', fakultas = 'TUP', jabatan_fungsional = 'Lektor' WHERE id = v_d19;
  END IF;

  -- 20. EKO FAJAR CAHYADI
  SELECT id INTO v_d20 FROM public.dosen WHERE nama ILIKE 'EKO FAJAR CAHYADI' LIMIT 1;
  IF v_d20 IS NULL THEN
    v_d20 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d20, 'EKO FAJAR CAHYADI', '13870071-1', 'TUP', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '13870071-1', fakultas = 'TUP', jabatan_fungsional = 'Lektor' WHERE id = v_d20;
  END IF;

  -- 21. GITA FADILA FITRIANA
  SELECT id INTO v_d21 FROM public.dosen WHERE nama ILIKE 'GITA FADILA FITRIANA' LIMIT 1;
  IF v_d21 IS NULL THEN
    v_d21 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d21, 'GITA FADILA FITRIANA', '20930034-1', 'TUP', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '20930034-1', fakultas = 'TUP', jabatan_fungsional = 'Lektor' WHERE id = v_d21;
  END IF;

  -- 22. ALFIN HIKMATUROKHMAN
  SELECT id INTO v_d22 FROM public.dosen WHERE nama ILIKE 'ALFIN HIKMATUROKHMAN' LIMIT 1;
  IF v_d22 IS NULL THEN
    v_d22 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d22, 'ALFIN HIKMATUROKHMAN', '03780042-1', 'TUP', '-', 'Lektor Kepala', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '03780042-1', fakultas = 'TUP', jabatan_fungsional = 'Lektor Kepala' WHERE id = v_d22;
  END IF;

  -- 23. KAMELIA
  SELECT id INTO v_d23 FROM public.dosen WHERE nama ILIKE 'KAMELIA' LIMIT 1;
  IF v_d23 IS NULL THEN
    v_d23 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) 
    VALUES (v_d23, 'KAMELIA', '23850013-1', 'TUJ', '-', 'Lektor', 'Aktif');
  ELSE
    UPDATE public.dosen SET nip = '23850013-1', fakultas = 'TUJ', jabatan_fungsional = 'Lektor' WHERE id = v_d23;
  END IF;

  -- Insert Alokasi Anggaran (OPEX 2026)
  INSERT INTO public.alokasi_anggaran (id, dosen_id, tahun, jenis_anggaran, keperluan, kelompok_keahlian, nominal_anggaran, jabatan_awal, target_jabatan) VALUES
  (v_a1, v_d1, 2026, 'OPEX', '["Langganan tools pendukung riset dan penelitian"]', '-', 15000000, 'Lektor', 'Lektor Kepala'),
  (v_a2, v_d2, 2026, 'OPEX', '["Jasa proofreading", "Pembelian barang habis pakai untuk penelitian"]', '-', 22900000, 'Lektor', 'Lektor Kepala'),
  (v_a3, v_d3, 2026, 'OPEX', '["Langganan tools pendukung riset dan penelitian"]', '-', 8982000, 'Lektor', 'Lektor Kepala'),
  (v_a4, v_d4, 2026, 'OPEX', '["Langganan tools pendukung riset dan", "penelitian", "Jasa proofreading", "Jasa desain, editing, dan penerbitan buku"]', '-', 12350000, 'Lektor', 'Lektor Kepala'),
  (v_a5, v_d5, 2026, 'OPEX', '["Jasa pendukung tabulasi data"]', '-', 16000000, 'Lektor', 'Lektor Kepala'),
  (v_a6, v_d6, 2026, 'OPEX', '["Jasa desain, editing, dan penerbitan buku"]', '-', 8150000, 'Lektor', 'Lektor Kepala'),
  (v_a7, v_d7, 2026, 'OPEX', '["Langganan tools pendukung riset dan", "penelitian", "Jasa penyusunan administrasi dokumen JAD", "Jasa desain, editing, dan penerbitan buku"]', '-', 18600000, 'Lektor', 'Lektor Kepala'),
  (v_a8, v_d8, 2026, 'OPEX', '["Jasa proofreading"]', '-', 6000000, 'Lektor', 'Lektor Kepala'),
  (v_a9, v_d9, 2026, 'OPEX', '["Jasa paraphrase", "Jasa desain, editing, dan penerbitan buku", "Jasa penulisan buku ajar", "Langganan tools pendukung riset dan penelitian"]', '-', 18900000, 'Lektor', 'Lektor Kepala'),
  (v_a10, v_d10, 2026, 'OPEX', '["Langganan tools pendukung riset dan penelitian", "Jasa penyusunan administrasi dokumen JAD"]', '-', 18500000, 'Lektor', 'Lektor Kepala'),
  (v_a11, v_d11, 2026, 'OPEX', '["Langganan tools pendukung riset dan", "penelitian", "Jasa proofreading"]', '-', 7040000, 'Lektor', 'Lektor Kepala'),
  (v_a12, v_d12, 2026, 'OPEX', '["Langganan tools pendukung riset dan", "penelitian", "Jasa desain, editing, dan penerbitan buku"]', '-', 13000000, 'Lektor', 'Lektor Kepala'),
  (v_a13, v_d13, 2026, 'OPEX', '["Langganan tools pendukung riset dan penelitian"]', '-', 4200000, 'Lektor', 'Lektor Kepala'),
  (v_a14, v_d14, 2026, 'OPEX', '["Jasa proofreading"]', '-', 10000000, 'Lektor Kepala', 'Guru Besar'),
  (v_a15, v_d15, 2026, 'OPEX', '["Langganan tools pendukung riset dan", "penelitian", "Jasa penyusunan administrasi dokumen JAD", "Jasa desain, editing, dan penerbitan buku"]', '-', 10500000, 'Lektor Kepala', 'Guru Besar'),
  (v_a16, v_d16, 2026, 'OPEX', '["Langganan tools pendukung riset dan", "penelitian", "Pembelian buku referensi riset", "Jasa penyusunan administrasi dokumen JAD", "Jasa desain, editing, dan penerbitan buku"]', '-', 28120000, 'Lektor Kepala', 'Guru Besar'),
  (v_a17, v_d17, 2026, 'OPEX', '["Jasa formatting, proofreading, dan programmer"]', '-', 12000000, 'Lektor Kepala', 'Guru Besar'),
  (v_a18, v_d18, 2026, 'OPEX', '["Langganan tools pendukung riset dan", "penelitian", "Jasa penyusunan administrasi dokumen JAD"]', '-', 10400000, 'Lektor Kepala', 'Guru Besar'),
  (v_a19, v_d19, 2026, 'OPEX', '["Langganan tools pendukung riset dan", "penelitian", "Jasa penyusunan administrasi dokumen JAD", "Jasa desain, editing, dan penerbitan buku"]', '-', 15900000, 'Lektor', 'Lektor Kepala'),
  (v_a20, v_d20, 2026, 'OPEX', '["Jasa penyusunan administrasi dokumen JAD"]', '-', 2808000, 'Lektor', 'Lektor Kepala'),
  (v_a21, v_d21, 2026, 'OPEX', '["Jasa penyusunan administrasi dokumen JAD"]', '-', 8900000, 'Lektor', 'Lektor Kepala'),
  (v_a22, v_d22, 2026, 'OPEX', '["Pembiayaan pengetikan, editing, dan penerbitan buku", "Jasa Proofreading"]', '-', 13500000, 'Lektor Kepala', 'Guru Besar'),
  (v_a23, v_d23, 2026, 'OPEX', '["Jasa fabrikasi, edit buku, dan proofreading", "Jasa penyususnan adminsiatrasi dokumen JAD"]', '-', 18250000, 'Lektor', 'Lektor Kepala');

END $$;
