-- Update nama fakultas yang panjang menjadi singkatan (FTE, FRI, dll)
UPDATE public.dosen
SET fakultas = CASE
    WHEN fakultas ILIKE '%Fakultas Rekayasa Industri%' THEN 'FRI'
    WHEN fakultas ILIKE '%Fakultas Teknik Telekomunikasi dan Elektro%' THEN 'FTE'
    WHEN fakultas ILIKE '%Fakultas Teknik Elektro%' THEN 'FTE'
    WHEN fakultas ILIKE '%Fakultas Ilmu Terapan%' THEN 'FIT'
    WHEN fakultas ILIKE '%Fakultas Komunikasi dan Ilmu Sosial%' THEN 'FKS'
    WHEN fakultas ILIKE '%Fakultas Komunikasi dan Bisnis%' THEN 'FKB'
    WHEN fakultas ILIKE '%Fakultas Informatika%' OR fakultas ILIKE '%Fakultas Teknik Informatika%' THEN 'FIF'
    WHEN fakultas ILIKE '%Fakultas Ekonomi dan Bisnis%' OR fakultas ILIKE '%Fakultas Ekonomi Bisnis%' THEN 'FEB'
    WHEN fakultas ILIKE '%Fakultas Industri Kreatif%' THEN 'FIK'
    WHEN fakultas ILIKE '%Telkom Bandung%' THEN 'TUP'
    WHEN fakultas ILIKE '%Telkom University Purwokerto%' THEN 'TUP'
    WHEN fakultas ILIKE '%Telkom University Surabaya%' THEN 'TUS'
    WHEN fakultas ILIKE '%Telkom University Jakarta%' THEN 'TUJ'
    ELSE fakultas
END
WHERE length(fakultas) > 3 AND fakultas NOT IN ('FRI', 'FTE', 'FIT', 'FKS', 'FKB', 'FIF', 'FEB', 'FIK', 'TUP', 'TUS', 'TUJ');
