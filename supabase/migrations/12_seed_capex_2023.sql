-- Seed Data for CAPEX 2023
DO $$
DECLARE
  -- Dosen UUIDs
  v_d1 UUID := gen_random_uuid();
  v_d2 UUID := gen_random_uuid();
  v_d3 UUID := gen_random_uuid();

  -- Alokasi Anggaran UUIDs
  v_a1 UUID := gen_random_uuid();
  v_a2 UUID := gen_random_uuid();
  v_a3 UUID := gen_random_uuid();
BEGIN

  -- 1. Insert Master Dosen
  INSERT INTO public.dosen (id, nama, nip, fakultas, program_studi, jabatan_fungsional, status) VALUES
  (v_d1, 'Fiky Yosef Suratman', '23101', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d2, 'Abrar', '23102', 'Telkom Bandung', '-', 'Lektor', 'Aktif'),
  (v_d3, 'Mohammad Yanuar Hariyawan', '23103', 'TUS', '-', 'Lektor', 'Aktif');

  -- 2. Insert Alokasi Anggaran (CAPEX 2023)
  INSERT INTO public.alokasi_anggaran (id, dosen_id, tahun, jenis_anggaran, keperluan, kelompok_keahlian, nominal_anggaran, jabatan_awal, target_jabatan) VALUES
  (
    v_a1, v_d1, 2023, 'CAPEX', 
    '["Industrial radar dari texas instrument (TI) untuk implementasi human activity recognition (salah satunya untuk fall detection lansia)", "Automotive radar dari texas Instrument (TI) untuk implementasi object detection dan recognition, terutama untuk autonomous systems", "Modul evaluasi DCA1000 (EVM) menyediakan pengambilan dan streaming data waktu nyata untuk lalu lintas pensinyalan diferensial tegangan rendah (LVDS) tegangan rendah dua dan empat jalur dari EVM sensor radar TI AWR dan IWR (Modul untuk aplikasi multi-radar IWR dan AWR)", "Board untuk menyediakan pengembangan perangkat lunak tingkat lanjut, fitur debug seperti pelacakan dan satu langkah melalui debugger yang kompatibel dengan Code Composers TI (Modul untuk pengembangan aplikasi radar IWR dan AWR)", "Modeling sinyal echo radar aktivitas pergerakan manusia dengan Microsoft Kinnect", "Kinect adaptor untuk Xbox 360", "Kinect hard drive external HDD"]', 
    'Control Electronics and Intelligent Systems', 
    41800000, 'Lektor', 'Lektor Kepala'
  ),
  (
    v_a2, v_d2, 2023, 'CAPEX', 
    '["Tempat penyimpanan sample yang bisa disesuaikan suhu dan kelembaban untuk menghindari oksidasi", "Screen printed electrode untuk testing pendeteksian logam berat dan bakteri", "Electrochemical adaptor for screen printed electrode for electrochemical process", "Elektroda pasta silver Silver Conductive Paste, 735825-25G", "Platinum electrode for electrochemical process", "Ag/AgCl counter electrode for electrochemical process", "Electrochemical Impedance Spectroscopy (EIS) Potensiotat Cortest CS350M EIS Potentiostat /Galvanostat"]', 
    'Rekayasa Instrumen dan Energi', 
    212000000, 'Lektor', 'Lektor Kepala'
  ),
  (
    v_a3, v_d3, 2023, 'CAPEX', 
    '["TekBox TBLC08 50uH Line Impedance Stabilization Network LISN"]', 
    'Electronics and Intelligent System', 
    20000000, 'Lektor', 'Lektor Kepala'
  );

END $$;
