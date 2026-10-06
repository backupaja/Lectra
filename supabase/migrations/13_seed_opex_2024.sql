-- Seed Data for OPEX 2024
DO $$
DECLARE
  v_d1 UUID := gen_random_uuid(); v_d2 UUID := gen_random_uuid(); v_d3 UUID := gen_random_uuid();
  v_d4 UUID := gen_random_uuid(); v_d5 UUID := gen_random_uuid(); v_d6 UUID := gen_random_uuid();
  v_d7 UUID := gen_random_uuid(); v_d8 UUID; v_d9 UUID := gen_random_uuid();
  v_d10 UUID := gen_random_uuid(); v_d11 UUID := gen_random_uuid(); v_d12 UUID := gen_random_uuid();
  v_d13 UUID := gen_random_uuid(); v_d14 UUID := gen_random_uuid(); v_d15 UUID := gen_random_uuid();
  v_d16 UUID := gen_random_uuid(); v_d17 UUID := gen_random_uuid(); v_d18 UUID := gen_random_uuid();

  v_a1 UUID := gen_random_uuid(); v_a2 UUID := gen_random_uuid(); v_a3 UUID := gen_random_uuid();
  v_a4 UUID := gen_random_uuid(); v_a5 UUID := gen_random_uuid(); v_a6 UUID := gen_random_uuid();
  v_a7 UUID := gen_random_uuid(); v_a8 UUID := gen_random_uuid(); v_a9 UUID := gen_random_uuid();
  v_a10 UUID := gen_random_uuid(); v_a11 UUID := gen_random_uuid(); v_a12 UUID := gen_random_uuid();
  v_a13 UUID := gen_random_uuid(); v_a14 UUID := gen_random_uuid(); v_a15 UUID := gen_random_uuid();
  v_a16 UUID := gen_random_uuid(); v_a17 UUID := gen_random_uuid(); v_a18 UUID := gen_random_uuid();
BEGIN

  -- Arie Ardiyanti dari 2023 OPEX (cek ketersediaan di database agar tidak duplikat)
  SELECT id INTO v_d8 FROM public.dosen WHERE nama = 'Arie Ardiyanti S.' LIMIT 1;
  IF v_d8 IS NULL THEN
    v_d8 := gen_random_uuid();
    INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
    (v_d8, 'Arie Ardiyanti', '24008', 'Fakultas Informatika', '-', 'Lektor', 'Aktif');
  END IF;

  -- 1. Insert Master Dosen (Kecuali Arie Ardiyanti yang di-handle di atas)
  INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
  (v_d1, 'Indra Wahyudhin Fathona', '24001', 'Fakultas Teknik Elektro', '-', 'Lektor', 'Aktif'),
  (v_d2, 'Lukman Abdurrahman', '24002', 'Fakultas Rekayasa Industri', '-', 'Lektor', 'Aktif'),
  (v_d3, 'Ilma Mufidah', '24003', 'Fakultas Rekayasa Industri', '-', 'Lektor', 'Aktif'),
  (v_d4, 'Sri Widaningrum', '24004', 'Fakultas Rekayasa Industri', '-', 'Lektor', 'Aktif'),
  (v_d5, 'Ahmad Musnansyah', '24005', 'Fakultas Rekayasa Industri', '-', 'Lektor', 'Aktif'),
  (v_d6, 'Muhammad Iqbal', '24006', 'Fakultas Rekayasa Industri', '-', 'Lektor', 'Aktif'),
  (v_d7, 'Rimba', '24007', 'Fakultas Informatika', '-', 'Lektor', 'Aktif'),
  (v_d9, 'Mira Kania', '24009', 'Fakultas Informatika', '-', 'Lektor', 'Aktif'),
  (v_d10, 'Palti Marulitua Sitorus', '24010', 'Fakultas Ekonomi Bisnis', '-', 'Lektor', 'Aktif'),
  (v_d11, 'Nidya Dudija', '24011', 'Fakultas Ekonomi Bisnis', '-', 'Lektor', 'Aktif'),
  (v_d12, 'Martha Tri Lestari', '24012', 'Fakultas Komunikasi dan Ilmu Sosial', '-', 'Lektor', 'Aktif'),
  (v_d13, 'Syahputra', '24013', 'Fakultas Komunikasi dan Ilmu Sosial', '-', 'Lektor', 'Aktif'),
  (v_d14, 'Suryatiningsih', '24014', 'Fakultas Ilmu Terapan', '-', 'Lektor', 'Aktif'),
  (v_d15, 'Inne Gartina Husein', '24015', 'Fakultas Ilmu Terapan', '-', 'Lektor', 'Aktif'),
  (v_d16, 'Unang Sunarya', '24016', 'Fakultas Ilmu Terapan', '-', 'Lektor', 'Aktif'),
  (v_d17, 'Wahyu Adi Prabowo', '24017', 'Fakultas Teknik Informatika', '-', 'Lektor', 'Aktif'),
  (v_d18, 'Eka Wahyudi', '24018', 'Fakultas Teknik Telekomunikasi dan Elektro', '-', 'Lektor', 'Aktif');

  -- 2. Insert Alokasi Anggaran (OPEX 2024)
  INSERT INTO public.alokasi_anggaran (id, dosen_id, tahun, jenis_anggaran, keperluan, kelompok_keahlian, nominal_anggaran, jabatan_awal, target_jabatan) VALUES
  (v_a1, v_d1, 2024, 'OPEX', '["Proofreading Paper"]', 'Rekayasa Instrumentasi dan Energi', 8000000, 'Lektor', 'Lektor Kepala'),
  (v_a2, v_d2, 2024, 'OPEX', '["Proofreading"]', 'Enterprise and Industrial Systems', 2000000, 'Lektor', 'Lektor Kepala'),
  (v_a3, v_d3, 2024, 'OPEX', '["Kebutuhan Tenaga Magang"]', 'Product Development & Ergonomy', 5500000, 'Lektor', 'Lektor Kepala'),
  (v_a4, v_d4, 2024, 'OPEX', '["Kebutuhan Tenaga Magang", "Translate Paper (2 Paper)", "Proofread Paper (3 paper)"]', 'Quality & Maintenance Engineering', 16600000, 'Lektor', 'Lektor Kepala'),
  (v_a5, v_d5, 2024, 'OPEX', '["Native Proofreading", "Professional Android Programmer", "Article Processing Charge IEEE ACCESS"]', 'Enterprise Intelligent System', 47800400, 'Lektor', 'Lektor Kepala'),
  (v_a6, v_d6, 2024, 'OPEX', '["Proofreading", "Editing draft Artikel"]', 'Production and Manufacturing System', 30371959, 'Lektor', 'Lektor Kepala'),
  (v_a7, v_d7, 2024, 'OPEX', '["Transform code Matlab to Phyton", "Pembuatan Data Uji"]', 'Multimedia', 10800000, 'Lektor', 'Lektor Kepala'),
  (v_a8, v_d8, 2024, 'OPEX', '["Pembuatan program Neural Machine Translation", "Implementasi testing"]', 'Data Science', 10800000, 'Lektor', 'Lektor Kepala'),
  (v_a9, v_d9, 2024, 'OPEX', '["Biaya Penilaian dari Responden"]', 'Software Engineering', 7400000, 'Lektor', 'Lektor Kepala'),
  (v_a10, v_d10, 2024, 'OPEX', '["Conference", "Riset dan Proofreading"]', 'Finance and Accounting Studies', 34000000, 'Lektor', 'Lektor Kepala'),
  (v_a11, v_d11, 2024, 'OPEX', '["Riset", "Proofreading"]', 'Strategy, Human, Entrepreneurship & Economy', 25000000, 'Lektor', 'Lektor Kepala'),
  (v_a12, v_d12, 2024, 'OPEX', '["Proofreading Jurnal", "Translate", "Coaching Penulisan Publikasi Internasional"]', 'Public Relations & Marketing Communication', 13000000, 'Lektor', 'Lektor Kepala'),
  (v_a13, v_d13, 2024, 'OPEX', '["Coaching Penulisan Publikasi Internasional", "Proof Read & Plagrism"]', 'Business & Innovation Sustainaiblity', 8500000, 'Lektor', 'Lektor Kepala'),
  (v_a14, v_d14, 2024, 'OPEX', '["Berlangganan IEEE Xplore (1 Tahun)"]', 'Applied Information Systems', 1900000, 'Lektor', 'Lektor Kepala'),
  (v_a15, v_d15, 2024, 'OPEX', '["Berlangganan IEEE Access (1 Tahun)"]', 'Applied Information Systems', 1700000, 'Lektor', 'Lektor Kepala'),
  (v_a16, v_d16, 2024, 'OPEX', '["Berlangganan IEEE Access (1 Tahun)"]', 'Teknologi Telekomunikasi', 1700000, 'Lektor', 'Lektor Kepala'),
  (v_a17, v_d17, 2024, 'OPEX', '["Kebutuhan Tenaga Magang"]', 'Teknologi Informasi', 3000000, 'Lektor', 'Lektor Kepala'),
  (v_a18, v_d18, 2024, 'OPEX', '["Publikasi Jurnal Internasional", "Proffreading draft artikel"]', 'Network Communication', 12000000, 'Lektor', 'Lektor Kepala');

END $$;
