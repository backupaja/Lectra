-- 10_seed_data.sql
-- Seed data from JAD spreadsheet images

DO $$
DECLARE
  -- Variables for Dosen UUIDs
  v_d1 UUID := gen_random_uuid();
  v_d2 UUID := gen_random_uuid();
  v_d3 UUID := gen_random_uuid();
  v_d4 UUID := gen_random_uuid();
  v_d5 UUID := gen_random_uuid();
  v_d6 UUID := gen_random_uuid();
  v_d7 UUID := gen_random_uuid();
  v_d8 UUID := gen_random_uuid();
  v_d9 UUID := gen_random_uuid();
  v_d10 UUID := gen_random_uuid();
  v_d11 UUID := gen_random_uuid();
  v_d12 UUID := gen_random_uuid();
  v_d13 UUID := gen_random_uuid();
  v_d14 UUID := gen_random_uuid();
  v_d15 UUID := gen_random_uuid();
  v_d16 UUID := gen_random_uuid();
  v_d17 UUID := gen_random_uuid();
  v_d18 UUID := gen_random_uuid();
  v_d19 UUID := gen_random_uuid();
  v_d20 UUID := gen_random_uuid();
  v_d21 UUID := gen_random_uuid();
  v_d22 UUID := gen_random_uuid();
  v_d23 UUID := gen_random_uuid();
  v_d24 UUID := gen_random_uuid();

  -- Variables for Alokasi UUIDs
  v_a1 UUID := gen_random_uuid();
  v_a2 UUID := gen_random_uuid();
  v_a3 UUID := gen_random_uuid();
  v_a24 UUID := gen_random_uuid();
  v_a4 UUID := gen_random_uuid(); -- Group for 4,5,6
  v_a7 UUID := gen_random_uuid();
  v_a8 UUID := gen_random_uuid();
  v_a9 UUID := gen_random_uuid();
  v_a10 UUID := gen_random_uuid();
  v_a11 UUID := gen_random_uuid();
  v_a12 UUID := gen_random_uuid();
  v_a13 UUID := gen_random_uuid(); -- Group for 13,14,15,16,17,18
  v_a19 UUID := gen_random_uuid();
  v_a20 UUID := gen_random_uuid();
  v_a21 UUID := gen_random_uuid();
  v_a22 UUID := gen_random_uuid();
  v_a23 UUID := gen_random_uuid();

BEGIN
  -- 1. Insert Dosen
  INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
  (v_d1, 'Ari Moesriami Barmawi', '10001', 'FIF', 'Intelligent System', 'Lektor Kepala', 'Aktif'),
  (v_d2, 'Achmad Ali Muayyadi', '10002', 'FTE', 'Transmisi Telekomunikasi', 'Lektor', 'Aktif'),
  (v_d3, 'Ismudiati Puri H.', '10003', 'FTE', 'Rekayasa Instrumentasi dan Energi', 'Lektor', 'Aktif'),
  (v_d4, 'Agus Kusnayat', '10004', 'FRI', 'Production and Manufacturing System', 'Lektor', 'Aktif'),
  (v_d5, 'Dida Diah Damayanti', '10005', 'FRI', 'Production and Manufacturing System', 'Lektor', 'Aktif'),
  (v_d6, 'Rd. Rohmat Saedudin', '10006', 'FRI', 'Enterprise and Industrial Systems', 'Lektor', 'Aktif'),
  (v_d7, 'Jurry Hatammimi', '10007', 'FEB', 'Startup and Small Business Development', 'Lektor', 'Aktif'),
  (v_d8, 'Aditya Wardhana', '10008', 'FKB', 'Entrepreneurship', 'Lektor', 'Aktif'),
  (v_d9, 'Arry Widodo', '10009', 'FKB', 'Business Policy and Strategy', 'Lektor', 'Aktif'),
  (v_d10, 'Cut Irna Setiawati', '10010', 'FKB', 'Entrepreneurship', 'Lektor', 'Aktif'),
  (v_d11, 'Maylanny Christin', '10011', 'FKB', 'Public Relation and Marketing Communication', 'Lektor', 'Aktif'),
  (v_d12, 'Ratih Hasanah', '10012', 'FKB', 'Public Relation and Marketing Communication', 'Lektor', 'Aktif'),
  (v_d13, 'Arini Arumsari', '10013', 'FIK', 'Innovative Lifestyle & Designed Environment', 'Lektor', 'Aktif'),
  (v_d14, 'Donny Trihanondo', '10014', 'FIK', 'Innovative Lifestyle & Designed Environment', 'Lektor', 'Aktif'),
  (v_d15, 'Fajar Ciptandi', '10015', 'FIK', 'Design Concept & Strategy', 'Lektor', 'Aktif'),
  (v_d16, 'Ira Wirasari', '10016', 'FIK', 'Aesthetics, Culture & Humanities', 'Lektor', 'Aktif'),
  (v_d17, 'Tita Cardiah', '10017', 'FIK', 'Aesthetics, Culture & Humanities', 'Lektor', 'Aktif'),
  (v_d18, 'Titihan Sarihati', '10018', 'FIK', 'Aesthetics, Culture & Humanities', 'Lektor', 'Aktif'),
  (v_d19, 'Astri Wulandari', '10019', 'FIT', 'Business Resources, Marketing and Tourism Strategy', 'Lektor', 'Aktif'),
  (v_d20, 'Wahyu Pamungkas', '10020', 'FTTE', 'Rekayasa Perangkat Lunak dan Multimedia', 'Lektor', 'Aktif'),
  (v_d21, 'Tenia Wahyuningrum', '10021', 'FIF', 'Rekayasa Perangkat Lunak dan Multimedia', 'Lektor', 'Aktif'),
  (v_d22, 'Helmy Widyantara', '10022', 'FTIB', 'Smart System and Integrated Technology', 'Lektor', 'Aktif'),
  (v_d23, 'Ade Nurhayati', '10023', 'FT', 'Umum', 'Lektor', 'Aktif'),
  (v_d24, 'Ahmad Tri Hanuranto', '10024', 'FTE', 'Networking, Cybernetics, and Engineering Management', 'Lektor', 'Aktif');

  -- 2. Insert Alokasi Anggaran
  INSERT INTO public.alokasi_anggaran (id, dosen_id, tahun, jenis_anggaran, keperluan, kelompok_keahlian, nominal_anggaran, jabatan_awal, target_jabatan) VALUES
  (v_a1, v_d1, 2022, 'OPEX', '1. Tenaga Bantu DUPAK, 2. International Reviewers (Fast Reviewer Jurnal Internasional)', 'Intelligent System', 5600000, 'Lektor Kepala', 'Guru Besar'),
  (v_a2, v_d2, 2022, 'OPEX', '1. Programmer, 2. Tenaga bantu Peneliti', 'Transmisi Telekomunikasi', 15000000, 'Lektor', 'Lektor Kepala'),
  (v_a24, v_d24, 2022, 'OPEX', '1. Programmer, 2. Tenaga bantu simulasi/eksperimen, 3. Coaching proof reading', 'Networking, Cybernetics, and Engineering Management', 15000000, 'Lektor', 'Lektor Kepala'),
  (v_a3, v_d3, 2022, 'OPEX', '1. Simulasi Bilayer MoS2, 2. Proofread jurnal ilmiah, 3. Pengujian SEM...', 'Rekayasa Instrumentasi dan Energi', 15000000, 'Lektor', 'Lektor Kepala'),
  -- Group 4,5,6 (Ketua: Agus Kusnayat)
  (v_a4, v_d4, 2022, 'OPEX', 'Workshop Pendampingan JAD', 'Production and Manufacturing System', 18000000, 'Lektor', 'Lektor Kepala'),
  (v_a7, v_d7, 2022, 'OPEX', 'Proofreading', 'Startup and Small Business Development', 4500000, 'Lektor', 'Lektor Kepala'),
  (v_a8, v_d8, 2022, 'OPEX', '1. Pelatihan Systematic, 2. Literature Review', 'Entrepreneurship', 6250000, 'Lektor', 'Lektor Kepala'),
  (v_a9, v_d9, 2022, 'OPEX', 'Proofreading', 'Business Policy and Strategy', 12500000, 'Lektor', 'Lektor Kepala'),
  (v_a10, v_d10, 2022, 'OPEX', 'Proofreading', 'Entrepreneurship', 7500000, 'Lektor', 'Lektor Kepala'),
  (v_a11, v_d11, 2022, 'OPEX', '1. Proofreading, 2. Translatter', 'Public Relation and Marketing Communication', 12500000, 'Lektor', 'Lektor Kepala'),
  (v_a12, v_d12, 2022, 'OPEX', '1. Proofreading, 2. Translatter', 'Public Relation and Marketing Communication', 12500000, 'Lektor', 'Lektor Kepala'),
  -- Group 13,14,15,16,17,18 (Ketua: Arini Arumsari)
  (v_a13, v_d13, 2022, 'OPEX', '1. Pendampingan Pembuatan Jurnal, 2. Translator Reviewer sebelum submit jurnal, 3. Workshop pendampingan penulisan buku', 'Innovative Lifestyle & Designed Environment', 20000000, 'Lektor', 'Lektor Kepala'),
  (v_a19, v_d19, 2022, 'OPEX', 'Berlangganan Grammarly', 'Business Resources, Marketing and Tourism Strategy', 2650000, 'Lektor', 'Lektor Kepala'),
  (v_a20, v_d20, 2022, 'OPEX', '1. Bootcamp/Workshop Penulisan Artikel Ilmiah, 2. Tenaga Bantu DUPAK', 'Rekayasa Perangkat Lunak dan Multimedia', 12000000, 'Lektor', 'Lektor Kepala'),
  (v_a21, v_d21, 2022, 'OPEX', '1. Bootcamp/Workshop Penulisan Artikel Ilmiah, 2. Tenaga Bantu DUPAK', 'Rekayasa Perangkat Lunak dan Multimedia', 12000000, 'Lektor', 'Lektor Kepala'),
  (v_a22, v_d22, 2022, 'OPEX', 'Proofreading', 'Smart System and Integrated Technology', 15000000, 'Lektor', 'Lektor Kepala'),
  (v_a23, v_d23, 2022, 'OPEX', 'Academic Writing Jurnal Q3 atau Q4', 'Umum', 11000000, 'Lektor', 'Lektor Kepala');

  -- 3. Insert Alokasi Dosen Tambahan (Kelompok)
  -- Anggota untuk v_a4 (Agus Kusnayat)
  INSERT INTO public.alokasi_dosen_tambahan (alokasi_id, dosen_id, jabatan_awal, target_jabatan) VALUES
  (v_a4, v_d5, 'Lektor', 'Lektor Kepala'), -- Dida
  (v_a4, v_d6, 'Lektor', 'Lektor Kepala'); -- Rd. Rohmat

  -- Anggota untuk v_a13 (Arini Arumsari)
  INSERT INTO public.alokasi_dosen_tambahan (alokasi_id, dosen_id, jabatan_awal, target_jabatan) VALUES
  (v_a13, v_d14, 'Lektor', 'Lektor Kepala'), -- Donny
  (v_a13, v_d15, 'Lektor', 'Lektor Kepala'), -- Fajar
  (v_a13, v_d16, 'Lektor', 'Lektor Kepala'), -- Ira
  (v_a13, v_d17, 'Lektor', 'Lektor Kepala'), -- Tita
  (v_a13, v_d18, 'Lektor', 'Lektor Kepala'); -- Titihan

END $$;
