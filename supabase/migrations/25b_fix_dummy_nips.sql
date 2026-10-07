-- 25b_fix_dummy_nips.sql
-- Update dummy NIPs (10001-10024) to real NIPs from DATABASE DOSEN LECTRA.xlsx
-- SAFE: only updates nip and nama columns, preserves UUID so all alokasi_anggaran stays linked

UPDATE public.dosen SET nip = '08600006-4', nama = 'ARI MOESRIAMI BARMAWI' WHERE nip = '10001';
UPDATE public.dosen SET nip = '93660012-1', nama = 'ACHMAD ALI MUAYYADI' WHERE nip = '10002';
UPDATE public.dosen SET nip = '00760012-1', nama = 'ISMUDIATI PURI HANDAYANI' WHERE nip = '10003';
UPDATE public.dosen SET nip = '20690006-1', nama = 'AGUS KUSNAYAT' WHERE nip = '10004';
UPDATE public.dosen SET nip = '94700007-1', nama = 'DIDA DIAH DAMAYANTI' WHERE nip = '10005';
UPDATE public.dosen SET nip = '00760016-1', nama = 'RD. ROHMAT SAEDUDIN' WHERE nip = '10006';
UPDATE public.dosen SET nip = '10780031-1', nama = 'JURRY HATAMMIMI' WHERE nip = '10007';
UPDATE public.dosen SET nip = '14720030-1', nama = 'ADITYA WARDHANA' WHERE nip = '10008';
UPDATE public.dosen SET nip = '11780029-1', nama = 'ARRY WIDODO' WHERE nip = '10009';
UPDATE public.dosen SET nip = '14900030-1', nama = 'CUT IRNA SETIAWATI' WHERE nip = '10010';
UPDATE public.dosen SET nip = '13810014-1', nama = 'MAYLANNY CHRISTIN' WHERE nip = '10011';
UPDATE public.dosen SET nip = '13780046-1', nama = 'RATIH HASANAH SUDRADJAT' WHERE nip = '10012';
UPDATE public.dosen SET nip = '14850026-1', nama = 'ARINI ARUMSARI' WHERE nip = '10013';
UPDATE public.dosen SET nip = '10840063-1', nama = 'DONNY TRIHANONDO' WHERE nip = '10014';
UPDATE public.dosen SET nip = '14860096-1', nama = 'FAJAR CIPTANDI' WHERE nip = '10015';
UPDATE public.dosen SET nip = '14810009-1', nama = 'IRA WIRASARI' WHERE nip = '10016';
UPDATE public.dosen SET nip = '15730057-1', nama = 'TITA CARDIAH' WHERE nip = '10017';
UPDATE public.dosen SET nip = '15730015-1', nama = 'TITIHAN SARIHATI' WHERE nip = '10018';
UPDATE public.dosen SET nip = '11820008-1', nama = 'ASTRI WULANDARI' WHERE nip = '10019';
UPDATE public.dosen SET nip = '02780016-1', nama = 'WAHYU PAMUNGKAS' WHERE nip = '10020';
UPDATE public.dosen SET nip = '07820045-1', nama = 'TENIA WAHYUNINGRUM' WHERE nip = '10021';
UPDATE public.dosen SET nip = '19790001-1', nama = 'HELMY WIDYANTARA' WHERE nip = '10022';
UPDATE public.dosen SET nip = '03790011-4', nama = 'ADE NURHAYATI' WHERE nip = '10023';
UPDATE public.dosen SET nip = '93660031-1', nama = 'AHMAD TRI HANURANTO' WHERE nip = '10024';

-- Verify: should return 0 rows if all dummy NIPs are fixed
SELECT nip, nama FROM public.dosen WHERE nip ~ '^[0-9]{5}$';