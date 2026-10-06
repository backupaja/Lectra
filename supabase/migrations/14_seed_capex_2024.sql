-- Seed Data for CAPEX 2024
DO $$
DECLARE
  -- Variables for Dosen UUIDs
  v_d1 UUID; v_d2 UUID; v_d3 UUID;
  v_d4 UUID; v_d5 UUID; v_d6 UUID;
  v_d7 UUID; v_d8 UUID; v_d9 UUID;
  v_d10 UUID; v_d11 UUID; v_d12 UUID;
  v_d13 UUID;

  -- Variables for Alokasi UUIDs
  v_a1 UUID := gen_random_uuid(); v_a2 UUID := gen_random_uuid(); v_a3 UUID := gen_random_uuid();
  v_a4 UUID := gen_random_uuid(); v_a5 UUID := gen_random_uuid(); v_a6 UUID := gen_random_uuid();
  v_a7 UUID := gen_random_uuid(); v_a8 UUID := gen_random_uuid(); v_a9 UUID := gen_random_uuid();
  v_a10 UUID := gen_random_uuid(); v_a11 UUID := gen_random_uuid(); v_a12 UUID := gen_random_uuid();
  v_a13 UUID := gen_random_uuid();

BEGIN

  -- Lookup or Create Dosen
  -- 1. Husneni Mukhtar
  SELECT id INTO v_d1 FROM public.dosen WHERE nama = 'Husneni Mukhtar' LIMIT 1;
  IF v_d1 IS NULL THEN
    v_d1 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d1, 'Husneni Mukhtar', '24101', 'Fakultas Teknik Elektro', '-', 'Lektor', 'Aktif');
  END IF;

  -- 2. Indra Wahyudhin Fathona
  SELECT id INTO v_d2 FROM public.dosen WHERE nama = 'Indra Wahyudhin Fathona' LIMIT 1;
  IF v_d2 IS NULL THEN
    v_d2 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d2, 'Indra Wahyudhin Fathona', '24102', 'Fakultas Teknik Elektro', '-', 'Lektor', 'Aktif');
  END IF;

  -- 3. Umar Ali Ahmad
  SELECT id INTO v_d3 FROM public.dosen WHERE nama = 'Umar Ali Ahmad' LIMIT 1;
  IF v_d3 IS NULL THEN
    v_d3 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d3, 'Umar Ali Ahmad', '24103', 'Fakultas Teknik Elektro', '-', 'Lektor', 'Aktif');
  END IF;

  -- 4. Muhsin
  SELECT id INTO v_d4 FROM public.dosen WHERE nama = 'Muhsin' LIMIT 1;
  IF v_d4 IS NULL THEN
    v_d4 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d4, 'Muhsin', '24104', 'Fakultas Teknik Elektro', '-', 'Lektor', 'Aktif');
  END IF;

  -- 5. Lukman Abdurrahman
  SELECT id INTO v_d5 FROM public.dosen WHERE nama = 'Lukman Abdurrahman' LIMIT 1;
  IF v_d5 IS NULL THEN
    v_d5 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d5, 'Lukman Abdurrahman', '24105', 'Fakultas Rekayasa Industri', '-', 'Lektor', 'Aktif');
  END IF;

  -- 6. Ahmad Musnansyah
  SELECT id INTO v_d6 FROM public.dosen WHERE nama = 'Ahmad Musnansyah' LIMIT 1;
  IF v_d6 IS NULL THEN
    v_d6 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d6, 'Ahmad Musnansyah', '24106', 'Fakultas Rekayasa Industri', '-', 'Lektor', 'Aktif');
  END IF;

  -- 7. Muhammad Iqbal
  SELECT id INTO v_d7 FROM public.dosen WHERE nama = 'Muhammad Iqbal' LIMIT 1;
  IF v_d7 IS NULL THEN
    v_d7 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d7, 'Muhammad Iqbal', '24107', 'Fakultas Rekayasa Industri', '-', 'Lektor', 'Aktif');
  END IF;

  -- 8. Agung Toto Wibowo
  SELECT id INTO v_d8 FROM public.dosen WHERE nama = 'Agung Toto Wibowo' LIMIT 1;
  IF v_d8 IS NULL THEN
    v_d8 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d8, 'Agung Toto Wibowo', '24108', 'Fakultas Informatika', '-', 'Lektor', 'Aktif');
  END IF;

  -- 9. Palti Marulitua Sitorus
  SELECT id INTO v_d9 FROM public.dosen WHERE nama = 'Palti Marulitua Sitorus' LIMIT 1;
  IF v_d9 IS NULL THEN
    v_d9 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d9, 'Palti Marulitua Sitorus', '24109', 'Fakultas Ekonomi Bisnis', '-', 'Lektor', 'Aktif');
  END IF;

  -- 10. Nidya Dudija
  SELECT id INTO v_d10 FROM public.dosen WHERE nama = 'Nidya Dudija' LIMIT 1;
  IF v_d10 IS NULL THEN
    v_d10 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d10, 'Nidya Dudija', '24110', 'Fakultas Ekonomi Bisnis', '-', 'Lektor', 'Aktif');
  END IF;

  -- 11. Martha Tri Lestari
  SELECT id INTO v_d11 FROM public.dosen WHERE nama = 'Martha Tri Lestari' LIMIT 1;
  IF v_d11 IS NULL THEN
    v_d11 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d11, 'Martha Tri Lestari', '24111', 'Fakultas Komunikasi dan Ilmu Sosial', '-', 'Lektor', 'Aktif');
  END IF;

  -- 12. Syahputra
  SELECT id INTO v_d12 FROM public.dosen WHERE nama = 'Syahputra' LIMIT 1;
  IF v_d12 IS NULL THEN
    v_d12 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d12, 'Syahputra', '24112', 'Fakultas Komunikasi dan Ilmu Sosial', '-', 'Lektor', 'Aktif');
  END IF;

  -- 13. Unang Sunarya
  SELECT id INTO v_d13 FROM public.dosen WHERE nama = 'Unang Sunarya' LIMIT 1;
  IF v_d13 IS NULL THEN
    v_d13 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d13, 'Unang Sunarya', '24113', 'Fakultas Ilmu Terapan', '-', 'Lektor', 'Aktif');
  END IF;

  -- Insert Alokasi Anggaran (CAPEX 2024)
  INSERT INTO public.alokasi_anggaran (id, dosen_id, tahun, jenis_anggaran, keperluan, kelompok_keahlian, nominal_anggaran, jabatan_awal, target_jabatan) VALUES
  (v_a1, v_d1, 2024, 'CAPEX', '["Nikon CF IC Epi Plan DI Mirau", "Interferometry Objective", "Yihua 853Aaa", "Sanwa LCR700", "Digital Multi Tester Fluke 17B+", "AS803 Luxmeter", "Fluke 971 Temperature", "PC-180B0 Portable", "Raspberry Pi 5 8GB", "Raspberry Pi HQ Camera", "Refractometer 0-20% Brix Sugar", "Meter Glucose Sweetness", "Sinocare iCan i3", "Alat Cek Gula Darah Elvasense"]', 'Control Electronics and Intelligent Systems', 25000000, 'Lektor', 'Lektor Kepala'),
  (v_a2, v_d2, 2024, 'CAPEX', '["Komputer Desktop untuk Pengamatan"]', 'Rekayasa Instrumentasi dan Energi', 6590000, 'Lektor', 'Lektor Kepala'),
  (v_a3, v_d3, 2024, 'CAPEX', '["Linear Actuator", "Mikroskop Digital", "Gear Robotik", "Motor DC", "Single-Board Computing", "Modul Kamera SBC", "Modul GPS", "Modul Komunikasi RF", "Drone", "Single-Board Computing", "Jetbot AI For Jetson Nano"]', 'Intelligent Communications and Networks', 23050000, 'Lektor', 'Lektor Kepala'),
  (v_a4, v_d4, 2024, 'CAPEX', '["Komputer Simulator Elektromagnetik"]', 'Intelligent Communications and Networks', 30000000, 'Lektor', 'Lektor Kepala'),
  (v_a5, v_d5, 2024, 'CAPEX', '["Grammarly Business online"]', 'Enterprise and Industrial Systems', 2869209, 'Lektor', 'Lektor Kepala'),
  (v_a6, v_d6, 2024, 'CAPEX', '["GPU untuk riset object recognition assistive technology for the blind, etc."]', 'Cybernetics', 11670000, 'Lektor', 'Lektor Kepala'),
  (v_a7, v_d7, 2024, 'CAPEX', '["Scholarcy", "Jenny AI"]', 'Production and Manufacturing System', 9140076, 'Lektor', 'Lektor Kepala'),
  (v_a8, v_d8, 2024, 'CAPEX', '["MicroServer"]', 'Data Science and Intelligent System', 20600000, 'Lektor', 'Lektor Kepala'),
  (v_a9, v_d9, 2024, 'CAPEX', '["Software Smart PLS Licenced"]', 'Finance & Accounting Studie', 10000000, 'Lektor', 'Lektor Kepala'),
  (v_a10, v_d10, 2024, 'CAPEX', '["Publish Or Perish", "Scite Ai", "Software Smart PLS Licenced", "MAXQDA"]', 'Strategy, Human, Entrepreneurship, Economics', 17500000, 'Lektor', 'Lektor Kepala'),
  (v_a11, v_d11, 2024, 'CAPEX', '["Tools Analytics"]', 'Public Relations & Marketing Communication', 4900000, 'Lektor', 'Lektor Kepala'),
  (v_a12, v_d12, 2024, 'CAPEX', '["AI Tools"]', 'Business & Innovation Sustainaiblity', 10350000, 'Lektor', 'Lektor Kepala'),
  (v_a13, v_d13, 2024, 'CAPEX', '["Monitor 24\""]', 'Teknologi Telekomunikasi', 1400000, 'Lektor', 'Lektor Kepala');

END $$;
