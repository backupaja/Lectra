-- 1. Bersihkan data sebelumnya
TRUNCATE TABLE realisasi_anggaran, alokasi_anggaran, dosen CASCADE;

-- 2. Pastikan kolom Target JAD ada
ALTER TABLE public.dosen ADD COLUMN IF NOT EXISTS target_jabatan_fungsional TEXT;

-- 3. Memasukkan Data Dosen beserta Alokasi Anggaran OPEX (Tahun 2026)
DO $$
DECLARE
    new_dosen_id UUID;
BEGIN
    -- 1. AHMAD SUGIANA
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('AHMAD SUGIANA', '14770010-1', 'Lektor', 'Lektor Kepala', 'FTE', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset dan penelitian"]', 15000000);

    -- 2. ASEP SUHENDI
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('ASEP SUHENDI', '15800021-1', 'Lektor', 'Lektor Kepala', 'FTE', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa proofreading", "Pembelian barang habis pakai untuk penelitian"]', 22900000);

    -- 3. DEDI KURNIA SYAH PUTRA
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('DEDI KURNIA SYAH PUTRA', '14880080-1', 'Lektor', 'Lektor Kepala', 'FKS', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset dan penelitian"]', 8982000);

    -- 4. DENNY DARLIS
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('DENNY DARLIS', '13770026-1', 'Lektor', 'Lektor Kepala', 'FIT', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa proofreading", "Jasa desain, editing, dan penerbitan buku"]', 12350000);

    -- 5. DWI FITRIZAL SALIM
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('DWI FITRIZAL SALIM', '22930023-1', 'Lektor', 'Lektor Kepala', 'FEB', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa pendukung tabulasi data"]', 16000000);

    -- 6. ERNA HIKMAWATI
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('ERNA HIKMAWATI', '26920004-1', 'Lektor', 'Lektor Kepala', 'FIT', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa desain, editing, dan penerbitan buku"]', 8150000);

    -- 7. LEANNA VIDYA YOVITA
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('LEANNA VIDYA YOVITA', '08830038-1', 'Lektor', 'Lektor Kepala', 'FTE', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa penyusunan administrasi dokumen JAD", "Jasa desain, editing, penerbitan buku"]', 18600000);

    -- 8. MEMORIA ROSI
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('MEMORIA ROSI', '14840065-1', 'Lektor', 'Lektor Kepala', 'FTE', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa proofreading"]', 6000000);

    -- 9. PUSPITA KENCANA SARI
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('PUSPITA KENCANA SARI', '13850022-1', 'Lektor', 'Lektor Kepala', 'FEB', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa paraphrase", "Jasa desain, editing, penerbitan buku", "Jasa penulisan buku ajar", "Langganan tools riset"]', 18900000);

    -- 10. PUTRI FARISKA SUGESTIE
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('PUTRI FARISKA SUGESTIE', '22840003-1', 'Lektor', 'Lektor Kepala', 'FEB', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa penyusunan administrasi dokumen JAD"]', 18500000);

    -- 11. RANTI RACHMAWANTI
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('RANTI RACHMAWANTI', '23840004-1', 'Lektor', 'Lektor Kepala', 'FIK', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa proofreading"]', 7040000);

    -- 12. RUSTAM
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('RUSTAM', '22870006-1', 'Lektor', 'Lektor Kepala', 'FTE', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa desain, editing, dan penerbitan buku"]', 13000000);

    -- 13. WILLY ANUGRAH CAHYADI
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('WILLY ANUGRAH CAHYADI', '22850009-1', 'Lektor', 'Lektor Kepala', 'FTE', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset dan penelitian"]', 4200000);

    -- 14. ARINI ARUMSARI
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('ARINI ARUMSARI', '14850026-1', 'Lektor Kepala', 'Guru Besar', 'FIK', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa proofreading"]', 10000000);

    -- 15. GIVA ANDRIANA MUTIARA
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('GIVA ANDRIANA MUTIARA', '14760020-1', 'Lektor Kepala', 'Guru Besar', 'FIT', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa penyusunan administrasi dokumen JAD", "Jasa desain, editing, penerbitan"]', 10500000);

    -- 16. GRISNA ANGGADWITA
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('GRISNA ANGGADWITA', '14860090-1', 'Lektor Kepala', 'Guru Besar', 'FEB', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools riset", "Pembelian buku referensi", "Jasa penyusunan JAD", "Jasa desain, editing, penerbitan"]', 28120000);

    -- 17. HILAL HUDAN NUHA
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('HILAL HUDAN NUHA', '13860093-1', 'Lektor Kepala', 'Guru Besar', 'FIF', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa formatting, proofreading, dan programmer"]', 12000000);

    -- 18. Z. K. ABDURAHMAN BAIZAL
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('Z. K. ABDURAHMAN BAIZAL', '99750047-1', 'Lektor Kepala', 'Guru Besar', 'FIF', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa penyusunan administrasi dokumen JAD"]', 10400000);

    -- 19. ARIQ CAHYA WARDHANA
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('ARIQ CAHYA WARDHANA', '22930007-1', 'Lektor', 'Lektor Kepala', 'TUP', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa penyusunan administrasi dokumen JAD", "Jasa desain, editing, penerbitan"]', 15900000);

    -- 20. EKO FAJAR CAHYADI
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('EKO FAJAR CAHYADI', '13870071-1', 'Lektor', 'Lektor Kepala', 'TUP', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa penyusunan administrasi dokumen JAD"]', 2808000);

    -- 21. GITA FADILA FITRIANA
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('GITA FADILA FITRIANA', '20930034-1', 'Lektor', 'Lektor Kepala', 'TUP', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa penyusunan administrasi dokumen JAD"]', 8900000);

    -- 22. ALFIN HIKMATUROKHMAN
    INSERT INTO public.dosen (nama, nip, jabatan_fungsional, target_jabatan_fungsional, fakultas, program_studi, status)
    VALUES ('ALFIN HIKMATUROKHMAN', '03780042-1', 'Lektor Kepala', 'Guru Besar', 'TUP', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Pembiayaan pengetikan, editing, dan penerbitan buku", "Jasa Proofreading"]', 13500000);

END $$;
