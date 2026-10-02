-- 1. Bersihkan data sebelumnya (Hati-hati, ini akan mengosongkan tabel)
TRUNCATE TABLE realisasi_anggaran, alokasi_anggaran, dosen CASCADE;

-- 2. Pindahkan kolom JAD dari Dosen ke Alokasi Anggaran
ALTER TABLE public.dosen DROP COLUMN IF EXISTS target_jabatan_fungsional;
ALTER TABLE public.dosen DROP COLUMN IF EXISTS jabatan_fungsional;

ALTER TABLE public.alokasi_anggaran ADD COLUMN IF NOT EXISTS jabatan_awal TEXT;
ALTER TABLE public.alokasi_anggaran ADD COLUMN IF NOT EXISTS target_jabatan TEXT;

-- 3. Memasukkan Data 22 Dosen beserta Alokasi Anggaran OPEX (Tahun 2026) dengan format JSON
DO $$
DECLARE
    new_dosen_id UUID;
BEGIN
    -- 1. AHMAD SUGIANA
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('AHMAD SUGIANA', '14770010-1', 'FTE', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset dan penelitian"]', 15000000, 'Lektor', 'Lektor Kepala');

    -- 2. ASEP SUHENDI
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('ASEP SUHENDI', '15800021-1', 'FTE', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa proofreading", "Pembelian barang habis pakai untuk penelitian"]', 22900000, 'Lektor', 'Lektor Kepala');

    -- 3. DEDI KURNIA SYAH PUTRA
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('DEDI KURNIA SYAH PUTRA', '14880080-1', 'FKS', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset dan penelitian"]', 8982000, 'Lektor', 'Lektor Kepala');

    -- 4. DENNY DARLIS
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('DENNY DARLIS', '13770026-1', 'FIT', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa proofreading", "Jasa desain, editing, dan penerbitan buku"]', 12350000, 'Lektor', 'Lektor Kepala');

    -- 5. DWI FITRIZAL SALIM
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('DWI FITRIZAL SALIM', '22930023-1', 'FEB', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa pendukung tabulasi data"]', 16000000, 'Lektor', 'Lektor Kepala');

    -- 6. ERNA HIKMAWATI
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('ERNA HIKMAWATI', '26920004-1', 'FIT', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa desain, editing, dan penerbitan buku"]', 8150000, 'Lektor', 'Lektor Kepala');

    -- 7. LEANNA VIDYA YOVITA
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('LEANNA VIDYA YOVITA', '08830038-1', 'FTE', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa penyusunan administrasi dokumen JAD", "Jasa desain, editing, penerbitan buku"]', 18600000, 'Lektor', 'Lektor Kepala');

    -- 8. MEMORIA ROSI
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('MEMORIA ROSI', '14840065-1', 'FTE', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa proofreading"]', 6000000, 'Lektor', 'Lektor Kepala');

    -- 9. PUSPITA KENCANA SARI
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('PUSPITA KENCANA SARI', '13850022-1', 'FEB', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa paraphrase", "Jasa desain, editing, penerbitan buku", "Jasa penulisan buku ajar", "Langganan tools riset"]', 18900000, 'Lektor', 'Lektor Kepala');

    -- 10. PUTRI FARISKA SUGESTIE
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('PUTRI FARISKA SUGESTIE', '22840003-1', 'FEB', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa penyusunan administrasi dokumen JAD"]', 18500000, 'Lektor', 'Lektor Kepala');

    -- 11. RANTI RACHMAWANTI
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('RANTI RACHMAWANTI', '23840004-1', 'FIK', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa proofreading"]', 7040000, 'Lektor', 'Lektor Kepala');

    -- 12. RUSTAM
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('RUSTAM', '22870006-1', 'FTE', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa desain, editing, dan penerbitan buku"]', 13000000, 'Lektor', 'Lektor Kepala');

    -- 13. WILLY ANUGRAH CAHYADI
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('WILLY ANUGRAH CAHYADI', '22850009-1', 'FTE', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset dan penelitian"]', 4200000, 'Lektor', 'Lektor Kepala');

    -- 14. ARINI ARUMSARI
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('ARINI ARUMSARI', '14850026-1', 'FIK', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa proofreading"]', 10000000, 'Lektor Kepala', 'Guru Besar');

    -- 15. GIVA ANDRIANA MUTIARA
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('GIVA ANDRIANA MUTIARA', '14760020-1', 'FIT', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa penyusunan administrasi dokumen JAD", "Jasa desain, editing, penerbitan"]', 10500000, 'Lektor Kepala', 'Guru Besar');

    -- 16. GRISNA ANGGADWITA
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('GRISNA ANGGADWITA', '14860090-1', 'FEB', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools riset", "Pembelian buku referensi", "Jasa penyusunan JAD", "Jasa desain, editing, penerbitan"]', 28120000, 'Lektor Kepala', 'Guru Besar');

    -- 17. HILAL HUDAN NUHA
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('HILAL HUDAN NUHA', '13860093-1', 'FIF', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa formatting, proofreading, dan programmer"]', 12000000, 'Lektor Kepala', 'Guru Besar');

    -- 18. Z. K. ABDURAHMAN BAIZAL
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('Z. K. ABDURAHMAN BAIZAL', '99750047-1', 'FIF', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa penyusunan administrasi dokumen JAD"]', 10400000, 'Lektor Kepala', 'Guru Besar');

    -- 19. ARIQ CAHYA WARDHANA
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('ARIQ CAHYA WARDHANA', '22930007-1', 'TUP', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Langganan tools pendukung riset", "Jasa penyusunan administrasi dokumen JAD", "Jasa desain, editing, penerbitan"]', 15900000, 'Lektor', 'Lektor Kepala');

    -- 20. EKO FAJAR CAHYADI
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('EKO FAJAR CAHYADI', '13870071-1', 'TUP', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa penyusunan administrasi dokumen JAD"]', 2808000, 'Lektor', 'Lektor Kepala');

    -- 21. GITA FADILA FITRIANA
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('GITA FADILA FITRIANA', '20930034-1', 'TUP', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Jasa penyusunan administrasi dokumen JAD"]', 8900000, 'Lektor', 'Lektor Kepala');

    -- 22. ALFIN HIKMATUROKHMAN
    INSERT INTO public.dosen (nama, nip, fakultas, program_studi, status)
    VALUES ('ALFIN HIKMATUROKHMAN', '03780042-1', 'TUP', 'Umum', 'Aktif') RETURNING id INTO new_dosen_id;
    INSERT INTO public.alokasi_anggaran (dosen_id, tahun, jenis_anggaran, keperluan, nominal_anggaran, jabatan_awal, target_jabatan)
    VALUES (new_dosen_id, 2026, 'OPEX', '["Pembiayaan pengetikan, editing, dan penerbitan buku", "Jasa Proofreading"]', 13500000, 'Lektor Kepala', 'Guru Besar');

END $$;
