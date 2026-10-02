-- 05_seed.sql

-- ==========================================
-- SEED DATA (Based on frontend mockData.ts)
-- ==========================================

-- Dosen
INSERT INTO public.dosen (id, nama, nip, jabatan_fungsional, fakultas, program_studi, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Dr. Ahmad Fauzi, M.T.', '197805122005011002', 'Lektor Kepala', 'Teknik', 'Teknik Informatika', 'Aktif'),
('22222222-2222-2222-2222-222222222222', 'Prof. Dr. Siti Rahayu, M.Si.', '196903041994032001', 'Guru Besar', 'MIPA', 'Matematika', 'Aktif'),
('33333333-3333-3333-3333-333333333333', 'Dr. Budi Santoso, M.Kom.', '198001152008011003', 'Lektor', 'Teknik', 'Sistem Informasi', 'Aktif'),
('44444444-4444-4444-4444-444444444444', 'Dr. Rina Kusuma, M.Pd.', '197506302003122002', 'Lektor', 'Keguruan', 'Pendidikan Matematika', 'Aktif');

-- Alokasi Anggaran
INSERT INTO public.alokasi_anggaran (id, dosen_id, tahun, keperluan, jenis_anggaran, nominal_anggaran, keterangan) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 2026, 'Konferensi Internasional IEEE', 'OPEX', 15000000, 'Konferensi IEEE International di Singapura'),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 2026, 'Peralatan Penelitian Lab', 'CAPEX', 25000000, 'Pembelian server dan perangkat lab'),
('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 2026, 'Publikasi Jurnal Scopus', 'OPEX', 8000000, 'Biaya publikasi jurnal internasional'),
('a4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 2026, 'Seminar Nasional Matematika', 'OPEX', 5000000, 'Seminar nasional di Jakarta'),
('a5555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 2026, 'Perangkat Lunak Statistik', 'CAPEX', 18000000, 'Lisensi software SPSS dan Matlab'),
('a6666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 2026, 'Workshop AI & Machine Learning', 'OPEX', 12000000, 'Workshop internasional di Bali'),
('a7777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 2026, 'Penelitian Pendidikan Inklusif', 'OPEX', 10000000, 'Riset lapangan pendidikan inklusif');

-- Realisasi Anggaran
INSERT INTO public.realisasi_anggaran (alokasi_id, tanggal_realisasi, nominal, nomor_simkug, keterangan) VALUES
-- a1 - OPEX Dr. Ahmad Konferensi IEEE
('a1111111-1111-1111-1111-111111111111', '2026-01-15', 3000000, 'SIMKUG-2026-001', 'Pembayaran registrasi konferensi'),
('a1111111-1111-1111-1111-111111111111', '2026-02-20', 5000000, 'SIMKUG-2026-002', 'Pembelian tiket pesawat'),
('a1111111-1111-1111-1111-111111111111', '2026-03-10', 4000000, NULL, 'Biaya akomodasi hotel'),
-- a2 - CAPEX Peralatan (over budget)
('a2222222-2222-2222-2222-222222222222', '2026-01-20', 12000000, 'SIMKUG-2026-003', 'Pembelian server rack'),
('a2222222-2222-2222-2222-222222222222', '2026-02-15', 10000000, 'SIMKUG-2026-004', 'GPU workstation'),
('a2222222-2222-2222-2222-222222222222', '2026-03-05', 6000000, NULL, 'Switch dan kabel jaringan'),
-- a3 - OPEX Publikasi
('a3333333-3333-3333-3333-333333333333', '2026-02-01', 8000000, 'SIMKUG-2026-005', 'Biaya publikasi jurnal Q1'),
-- a4 - OPEX Seminar
('a4444444-4444-4444-4444-444444444444', '2026-01-10', 2000000, 'SIMKUG-2026-006', 'Registrasi seminar'),
('a4444444-4444-4444-4444-444444444444', '2026-01-25', 1500000, NULL, 'Transportasi'),
-- a6 - OPEX Workshop near limit
('a6666666-6666-6666-6666-666666666666', '2026-01-12', 5000000, 'SIMKUG-2026-007', 'Registrasi workshop'),
('a6666666-6666-6666-6666-666666666666', '2026-02-18', 4500000, 'SIMKUG-2026-008', 'Akomodasi'),
('a6666666-6666-6666-6666-666666666666', '2026-03-01', 2000000, NULL, 'Transportasi pulang');
