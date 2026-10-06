-- Seed Data for OPEX 2023
DO $$
DECLARE
  -- Dosen UUIDs
  v_d1 UUID := gen_random_uuid(); v_d2 UUID := gen_random_uuid(); v_d3 UUID := gen_random_uuid();
  v_d4 UUID := gen_random_uuid(); v_d5 UUID := gen_random_uuid(); v_d6 UUID := gen_random_uuid();
  v_d7 UUID := gen_random_uuid(); v_d8 UUID := gen_random_uuid(); v_d9 UUID := gen_random_uuid();
  v_d10 UUID := gen_random_uuid(); v_d11 UUID := gen_random_uuid(); v_d12 UUID := gen_random_uuid();
  v_d13 UUID := gen_random_uuid(); v_d14 UUID := gen_random_uuid(); v_d15 UUID := gen_random_uuid();
  v_d16 UUID := gen_random_uuid(); v_d17 UUID := gen_random_uuid(); v_d18 UUID := gen_random_uuid();
  v_d19 UUID := gen_random_uuid(); v_d20 UUID := gen_random_uuid(); v_d21 UUID := gen_random_uuid();
  v_d22 UUID := gen_random_uuid(); v_d23 UUID := gen_random_uuid(); v_d24 UUID := gen_random_uuid();
  v_d25 UUID := gen_random_uuid(); v_d26 UUID := gen_random_uuid(); v_d27 UUID := gen_random_uuid();
  v_d28 UUID := gen_random_uuid(); v_d29 UUID := gen_random_uuid();

  -- Alokasi Anggaran UUIDs (28 Baris Unik)
  v_a1 UUID := gen_random_uuid(); v_a2 UUID := gen_random_uuid(); v_a3 UUID := gen_random_uuid();
  v_a4 UUID := gen_random_uuid(); v_a5 UUID := gen_random_uuid(); v_a6 UUID := gen_random_uuid();
  v_a7 UUID := gen_random_uuid(); v_a8 UUID := gen_random_uuid(); v_a9 UUID := gen_random_uuid();
  v_a10 UUID := gen_random_uuid(); v_a11 UUID := gen_random_uuid(); v_a12 UUID := gen_random_uuid();
  v_a13 UUID := gen_random_uuid(); v_a14 UUID := gen_random_uuid(); v_a15 UUID := gen_random_uuid();
  v_a16 UUID := gen_random_uuid(); v_a17 UUID := gen_random_uuid(); v_a18 UUID := gen_random_uuid();
  v_a19 UUID := gen_random_uuid(); v_a20 UUID := gen_random_uuid(); v_a21 UUID := gen_random_uuid();
  v_a22 UUID := gen_random_uuid(); v_a23 UUID := gen_random_uuid(); v_a24 UUID := gen_random_uuid();
  v_a25 UUID := gen_random_uuid(); v_a26 UUID := gen_random_uuid(); v_a27 UUID := gen_random_uuid();
  v_a28 UUID := gen_random_uuid();
BEGIN

  -- 1. Insert Master Dosen
  INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
  (v_d1, 'Basuki Rahmat', '23001', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d2, 'Nia Ambarsari', '23002', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d3, 'Heppy Millanyani', '23003', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d4, 'Fetty Poerwita S', '23004', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d5, 'Riski Taufik Hidayah', '23005', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d6, 'Ratna Komala Putri', '23006', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d7, 'Hani Gita Ayuningtias', '23007', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d8, 'Arie Ardiyanti S.', '23008', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d9, 'Danang Junaedi', '23009', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d10, 'Deni Saepudin', '23010', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d11, 'Diyas Puspandari', '23011', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d12, 'Fitriyani', '23012', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d13, 'Imelda Atastina', '23013', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d14, 'Indwiarti', '23014', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d15, 'Jondri', '23015', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d16, 'Kusuma Ayu Laksitowening', '23016', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d17, 'Mahmud Dwi Sulistiyo', '23017', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d18, 'Setyorini', '23018', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d19, 'Tjokorda Agung Budi Wirayuda', '23019', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d20, 'Wikky Fawwaz Al Maki', '23020', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d21, 'Yudi Priyadi', '23021', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d22, 'Mia Rosmiati', '23022', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d23, 'Rennyta Yusiana', '23023', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d24, 'Dudi Pratomo', '23024', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d25, 'Candiwan', '23025', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d26, 'Dedi Iskamto', '23026', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d27, 'Alfin Hikmaturokhman', '23027', 'TUP', '-', 'Lektor', 'Aktif'),
  (v_d28, 'Ridwan Pandiya', '23028', 'TUP', '-', 'Lektor', 'Aktif'),
  (v_d29, 'Abduh Sayid Albana', '23029', 'TUS', '-', 'Lektor', 'Aktif');

  -- 2. Insert Alokasi Anggaran
  INSERT INTO public.alokasi_anggaran (id, dosen_id, tahun, jenis_anggaran, keperluan, kelompok_keahlian, nominal_anggaran, jabatan_awal, target_jabatan) VALUES
  (v_a1, v_d1, 2023, 'OPEX', '["Mengedit draft jurnal/paper", "Mengedit draft buku ajar", "Proof reading Draft jurnal/paper", "Membantu pembuatan program Arduino/Matlab"]', 'Networking, Cybernetics, and Engineering Management', 20000000, 'Lektor', 'Lektor Kepala'),
  (v_a2, v_d2, 2023, 'OPEX', '["Tenaga bantuan (magang) untuk pengumpulan eviden, verifikasi dan penginputan daftar usulan (DUPAK) sebelum diajukan ke TPAK dan senat"]', 'Cybernetics', 3630000, 'Lektor', 'Lektor Kepala'),
  (v_a3, v_d3, 2023, 'OPEX', '["Proofreading"]', 'ICT Based Management (IBM)', 3000000, 'Lektor', 'Lektor Kepala'),
  (v_a4, v_d4, 2023, 'OPEX', '["Proofreading"]', 'Strategy, Human, Entrepreneurship and Economy', 8000000, 'Lektor', 'Lektor Kepala'),
  (v_a5, v_d5, 2023, 'OPEX', '["Proofreading"]', 'ICT Business Management', 3000000, 'Lektor', 'Lektor Kepala'),
  (v_a6, v_d6, 2023, 'OPEX', '["Proofreading"]', 'Strategy, Human, Entrepreneurship and Economy', 4000000, 'Lektor', 'Lektor Kepala'),
  (v_a7, v_d7, 2023, 'OPEX', '["Proofreading"]', 'Strategy, Human, Entrepreneurship and Economy', 2400000, 'Lektor', 'Lektor Kepala'),
  -- Group 8, 9, 10, 11
  (v_a8, v_d8, 2023, 'OPEX', '["Sewa programmer", "Proof reading", "Gramarly"]', 'Data Science', 10000000, 'Lektor', 'Lektor Kepala'),
  (v_a9, v_d12, 2023, 'OPEX', '["Langganan grammarly", "Langganan quillbot 1 tahun"]', 'Data Science', 3400000, 'Lektor', 'Lektor Kepala'),
  -- Group 13, 14, 15
  (v_a10, v_d13, 2023, 'OPEX', '["Pengumpulan data", "Programmer", "Proofreading"]', 'Data Science', 7500000, 'Lektor', 'Lektor Kepala'),
  (v_a11, v_d16, 2023, 'OPEX', '["Langganan quillbot", "Programmer", "VPS cloud hosting", "Bakomatex"]', 'Software Engineering', 10000000, 'Lektor', 'Lektor Kepala'),
  (v_a12, v_d17, 2023, 'OPEX', '["Pengumpulan data", "Programmer", "Langganan grammarly", "Langganan overleaf professional setahun", "Langganan quillbot paraphrase"]', 'Intelligent System', 10000000, 'Lektor', 'Lektor Kepala'),
  -- Group 18, 19
  (v_a13, v_d18, 2023, 'OPEX', '["Sewa programmer", "Proofreading"]', 'Cyber Physical System', 10000000, 'Lektor', 'Lektor Kepala'),
  (v_a14, v_d20, 2023, 'OPEX', '["Langganan grammarly", "Langganan quillbot", "1 paper di jurnal Q1", "2 paper di jurnal Q3", "Programmer"]', 'Intelligent System', 8500000, 'Lektor', 'Lektor Kepala'),
  (v_a15, v_d21, 2023, 'OPEX', '["Langganan grammarly", "Langganan quillbot"]', 'Software Engineering', 3400000, 'Lektor', 'Lektor Kepala'),
  (v_a16, v_d22, 2023, 'OPEX', '["Langganan grammarly business"]', 'Interactive Programming', 2700000, 'Lektor', 'Lektor Kepala'),
  (v_a17, v_d23, 2023, 'OPEX', '["Langganan Smart PLS", "Langganan quillbot", "Whitesmoke"]', 'BRMTS', 7367450, 'Lektor', 'Lektor Kepala'),
  (v_a18, v_d24, 2023, 'OPEX', '["Langganan smart PLS 4 Profesional", "Langganan STATA", "Langganan grammarly", "Langganan quillbot", "Langganan bibliometrix", "Langganan VOSViewer", "Langganan mandelay", "Langganan publish or perish"]', 'Finance and Accounting Studies', 8000000, 'Lektor', 'Lektor Kepala'),
  (v_a19, v_d3, 2023, 'OPEX', '["Nvivo (mac) & Transcription"]', 'ICT Business Management', 20000000, 'Lektor', 'Lektor Kepala'),
  (v_a20, v_d5, 2023, 'OPEX', '["Langganan smart PLS 4 Profesional", "Langganan STATA", "Langganan grammarly", "Langganan quillbot", "Langganan bibliometrix", "Langganan VOSViewer", "Langganan mandelay", "Langganan publish or perish"]', 'ICT Business Management', 8000000, 'Lektor', 'Lektor Kepala'),
  (v_a21, v_d25, 2023, 'OPEX', '["Langganan smart PLS 4 Profesional", "Langganan STATA", "Langganan grammarly", "Langganan quillbot", "Langganan bibliometrix", "Langganan VOSViewer", "Langganan mandelay", "Langganan publish or perish", "Nvivo (mac) & Transcription"]', 'ICT Business Management', 20000000, 'Lektor', 'Lektor Kepala'),
  (v_a22, v_d6, 2023, 'OPEX', '["SEM Amos, EQS, Lisrel"]', 'Strategy, Human, Entrepreneurship and Economy', 10000000, 'Lektor', 'Lektor Kepala'),
  (v_a23, v_d26, 2023, 'OPEX', '["Langganan smart PLS 4 Profesional", "Langganan grammarly", "Langganan quillbot", "Langganan turnitin"]', 'ICT Business Management', 8000000, 'Lektor', 'Lektor Kepala'),
  (v_a24, v_d7, 2023, 'OPEX', '["Langganan smart PLS 4 Profesional", "Langganan NVIVO", "Langganan grammarly", "Langganan IBM SPSS 29", "Langganan atlasti", "Langganan quilbolt premium"]', 'Strategy, Human, Entrepreneurship and Economy', 20000000, 'Lektor', 'Lektor Kepala'),
  (v_a25, v_d9, 2023, 'OPEX', '["Langganan sofware license: https://maze.co/pricing/ dan https://www.figma.com/pricing/"]', 'Software Engineering', 8000000, 'Lektor', 'Lektor Kepala'),
  (v_a26, v_d27, 2023, 'OPEX', '["Mengikutkan dosen eligible LK dalam Bootcamp/Workshop penulisan artikel ilmiah di jurnal internasional bereputasi", "Memberikan bantuan penyediaan 1 staff yang fokus membantu dosen terkait selaku asisten administrasi"]', 'Wireless & Signal Processing', 10000000, 'Lektor', 'Lektor Kepala'),
  (v_a27, v_d28, 2023, 'OPEX', '["Mendukung kegiatan dosen dalam persiapan publikasi 2 artikel ilmiah (proofreading) dan submit publikasi jurnal internasional", "Memberikan bantuan penyediaan 1 staff yang fokus membantu dosen terkait selaku asisten administrasi"]', 'Rekayasa Data', 10000000, 'Lektor', 'Lektor Kepala'),
  (v_a28, v_d29, 2023, 'OPEX', '["Bantuan publikasi", "Proofreading naskah publikasi ilmiah"]', 'Industrial Logistic System', 20000000, 'Lektor', 'Lektor Kepala');

  -- 3. Insert Anggota Kelompok
  INSERT INTO public.alokasi_dosen_tambahan (alokasi_id, dosen_id, jabatan_awal, target_jabatan) VALUES
  -- Anggota dari Arie Ardiyanti S. (Grup 8, 9, 10, 11)
  (v_a8, v_d9, 'Lektor', 'Lektor Kepala'),
  (v_a8, v_d10, 'Lektor', 'Lektor Kepala'),
  (v_a8, v_d11, 'Lektor', 'Lektor Kepala'),

  -- Anggota dari Imelda Atastina (Grup 13, 14, 15)
  (v_a10, v_d14, 'Lektor', 'Lektor Kepala'),
  (v_a10, v_d15, 'Lektor', 'Lektor Kepala'),

  -- Anggota dari Setyorini (Grup 18, 19)
  (v_a13, v_d19, 'Lektor', 'Lektor Kepala');

END $$;
