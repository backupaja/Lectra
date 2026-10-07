-- 25c_fix_more_dummy_nips.sql
-- Fix remaining dummy NIPs (23xxx, 24xxx)


-- Fix Basuki Rahmat
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '99630012-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23001');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '99630012-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23001');

DELETE FROM public.dosen WHERE nip = '23001';

-- Fix Nia Ambarsari
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14770014-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23002');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14770014-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23002');

DELETE FROM public.dosen WHERE nip = '23002';

-- Fix Heppy Millanyani
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10800002-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23003');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10800002-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23003');

DELETE FROM public.dosen WHERE nip = '23003';

-- Fix Fetty Poerwita S
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '08780003-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23004');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '08780003-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23004');

DELETE FROM public.dosen WHERE nip = '23004';

-- Fix Riski Taufik Hidayah
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '26850004-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23005');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '26850004-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23005');

DELETE FROM public.dosen WHERE nip = '23005';

-- Fix Ratna Komala Putri
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '23800008-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23006');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '23800008-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23006');

DELETE FROM public.dosen WHERE nip = '23006';

-- Fix Hani Gita Ayuningtias
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '25980016-3') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23007');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '25980016-3') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23007');

DELETE FROM public.dosen WHERE nip = '23007';

-- Fix Arie Ardiyanti S.
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '22860003-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23008');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '22860003-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23008');

DELETE FROM public.dosen WHERE nip = '23008';

-- Fix Danang Junaedi
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14780062-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23009');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14780062-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23009');

DELETE FROM public.dosen WHERE nip = '23009';

-- Fix Deni Saepudin
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '99750013-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23010');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '99750013-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23010');

DELETE FROM public.dosen WHERE nip = '23010';

-- Fix Diyas Puspandari
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '99730029-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23011');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '99730029-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23011');

DELETE FROM public.dosen WHERE nip = '23011';

-- Fix Fitriyani
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10830001-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23012');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10830001-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23012');

DELETE FROM public.dosen WHERE nip = '23012';

-- Fix Imelda Atastina
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '07770053-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23013');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '07770053-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23013');

DELETE FROM public.dosen WHERE nip = '23013';

-- Fix Indwiarti
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '98690022-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23014');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '98690022-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23014');

DELETE FROM public.dosen WHERE nip = '23014';

-- Fix Jondri
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '95700035-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23015');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '95700035-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23015');

DELETE FROM public.dosen WHERE nip = '23015';

-- Fix Kusuma Ayu Laksitowening
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '05840010-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23016');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '05840010-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23016');

DELETE FROM public.dosen WHERE nip = '23016';

-- Fix Mahmud Dwi Sulistiyo
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '13880017-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23017');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '13880017-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23017');

DELETE FROM public.dosen WHERE nip = '23017';

-- Fix Setyorini
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '08800015-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23018');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '08800015-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23018');

DELETE FROM public.dosen WHERE nip = '23018';

-- Fix Tjokorda Agung Budi Wirayuda
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '06830020-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23019');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '06830020-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23019');

DELETE FROM public.dosen WHERE nip = '23019';

-- Fix Wikky Fawwaz Al Maki
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '22820013-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23020');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '22820013-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23020');

DELETE FROM public.dosen WHERE nip = '23020';

-- Fix Yudi Priyadi
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '20710004-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23021');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '20710004-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23021');

DELETE FROM public.dosen WHERE nip = '23021';

-- Fix Mia Rosmiati
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14820012-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23022');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14820012-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23022');

DELETE FROM public.dosen WHERE nip = '23022';

-- Fix Rennyta Yusiana
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '08850034-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23023');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '08850034-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23023');

DELETE FROM public.dosen WHERE nip = '23023';

-- Fix Dudi Pratomo
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10770063-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23024');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10770063-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23024');

DELETE FROM public.dosen WHERE nip = '23024';

-- Fix Candiwan
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '19630008-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23025');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '19630008-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23025');

DELETE FROM public.dosen WHERE nip = '23025';

-- Fix Dedi Iskamto
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '26750001-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23026');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '26750001-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23026');

DELETE FROM public.dosen WHERE nip = '23026';

-- Fix Alfin Hikmaturokhman
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '03780042-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23027');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '03780042-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23027');

DELETE FROM public.dosen WHERE nip = '23027';

-- Fix Ridwan Pandiya
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '15820053-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23028');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '15820053-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23028');

DELETE FROM public.dosen WHERE nip = '23028';

-- Fix Abduh Sayid Albana
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '19900001-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23029');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '19900001-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23029');

DELETE FROM public.dosen WHERE nip = '23029';

-- Fix Fiky Yosef Suratman
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '07760017-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23101');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '07760017-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23101');

DELETE FROM public.dosen WHERE nip = '23101';

-- Fix Abrar
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14820003-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23102');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14820003-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23102');

DELETE FROM public.dosen WHERE nip = '23102';

-- Fix Mohammad Yanuar Hariyawan
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '25760006-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23103');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '25760006-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '23103');

DELETE FROM public.dosen WHERE nip = '23103';

-- Fix Arie Ardiyanti
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '02770027-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24008');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '02770027-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24008');

DELETE FROM public.dosen WHERE nip = '24008';

-- Fix Indra Wahyudhin Fathona
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14840062-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24001');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14840062-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24001');

DELETE FROM public.dosen WHERE nip = '24001';

-- Fix Lukman Abdurrahman
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '19630007-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24002');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '19630007-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24002');

DELETE FROM public.dosen WHERE nip = '24002';

-- Fix Ilma Mufidah
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '15890066-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24003');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '15890066-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24003');

DELETE FROM public.dosen WHERE nip = '24003';

-- Fix Sri Widaningrum
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '92680022-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24004');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '92680022-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24004');

DELETE FROM public.dosen WHERE nip = '24004';
-- NOT FOUND in Excel: Ahmad Musnansyah (dummy: 24005)

-- Fix Muhammad Iqbal
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10840012-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24006');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10840012-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24006');

DELETE FROM public.dosen WHERE nip = '24006';

-- Fix Rimba
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '04740062-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24007');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '04740062-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24007');

DELETE FROM public.dosen WHERE nip = '24007';

-- Fix Mira Kania
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14770011-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24009');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14770011-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24009');

DELETE FROM public.dosen WHERE nip = '24009';
-- NOT FOUND in Excel: Palti Marulitua Sitorus (dummy: 24010)

-- Fix Nidya Dudija
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10850035-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24011');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10850035-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24011');

DELETE FROM public.dosen WHERE nip = '24011';

-- Fix Martha Tri Lestari
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '08830009-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24012');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '08830009-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24012');

DELETE FROM public.dosen WHERE nip = '24012';

-- Fix Syahputra
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14790007-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24013');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14790007-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24013');

DELETE FROM public.dosen WHERE nip = '24013';

-- Fix Suryatiningsih
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '07800068-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24014');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '07800068-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24014');

DELETE FROM public.dosen WHERE nip = '24014';

-- Fix Inne Gartina Husein
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '12730018-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24015');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '12730018-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24015');

DELETE FROM public.dosen WHERE nip = '24015';

-- Fix Unang Sunarya
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10840019-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24016');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10840019-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24016');

DELETE FROM public.dosen WHERE nip = '24016';

-- Fix Wahyu Adi Prabowo
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '19850001-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24017');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '19850001-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24017');

DELETE FROM public.dosen WHERE nip = '24017';

-- Fix Eka Wahyudi
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '05760048-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24018');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '05760048-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24018');

DELETE FROM public.dosen WHERE nip = '24018';

-- Fix Husneni Mukhtar
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14810049-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24101');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14810049-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24101');

DELETE FROM public.dosen WHERE nip = '24101';

-- Fix Indra Wahyudhin Fathona
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14840062-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24102');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14840062-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24102');

DELETE FROM public.dosen WHERE nip = '24102';

-- Fix Umar Ali Ahmad
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '11850072-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24103');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '11850072-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24103');

DELETE FROM public.dosen WHERE nip = '24103';

-- Fix Muhsin
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '19940001-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24104');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '19940001-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24104');

DELETE FROM public.dosen WHERE nip = '24104';

-- Fix Lukman Abdurrahman
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '19630007-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24105');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '19630007-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24105');

DELETE FROM public.dosen WHERE nip = '24105';
-- NOT FOUND in Excel: Ahmad Musnansyah (dummy: 24106)

-- Fix Muhammad Iqbal
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10840012-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24107');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10840012-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24107');

DELETE FROM public.dosen WHERE nip = '24107';

-- Fix Agung Toto Wibowo
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14820035-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24108');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14820035-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24108');

DELETE FROM public.dosen WHERE nip = '24108';
-- NOT FOUND in Excel: Palti Marulitua Sitorus (dummy: 24109)

-- Fix Nidya Dudija
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10850035-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24110');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10850035-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24110');

DELETE FROM public.dosen WHERE nip = '24110';

-- Fix Martha Tri Lestari
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '08830009-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24111');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '08830009-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24111');

DELETE FROM public.dosen WHERE nip = '24111';

-- Fix Syahputra
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14790007-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24112');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '14790007-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24112');

DELETE FROM public.dosen WHERE nip = '24112';

-- Fix Unang Sunarya
UPDATE public.alokasi_anggaran 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10840019-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24113');

UPDATE public.alokasi_dosen_tambahan 
SET dosen_id = (SELECT id FROM public.dosen WHERE nip = '10840019-1') 
WHERE dosen_id = (SELECT id FROM public.dosen WHERE nip = '24113');

DELETE FROM public.dosen WHERE nip = '24113';
