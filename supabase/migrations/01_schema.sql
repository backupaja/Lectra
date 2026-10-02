-- 01_schema.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Dosen
CREATE TABLE public.dosen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    nip TEXT UNIQUE,
    jabatan_fungsional TEXT NOT NULL,
    fakultas TEXT NOT NULL,
    program_studi TEXT NOT NULL,
    status TEXT NOT NULL,
    share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex') CHECK (share_token ~ '^[0-9a-f]{64}$'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alokasi Anggaran
CREATE TABLE public.alokasi_anggaran (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dosen_id UUID NOT NULL REFERENCES public.dosen(id) ON DELETE CASCADE,
    tahun SMALLINT NOT NULL,
    jenis_anggaran TEXT NOT NULL CHECK (jenis_anggaran IN ('OPEX', 'CAPEX')),
    keperluan TEXT NOT NULL,
    nominal_anggaran BIGINT NOT NULL CHECK (nominal_anggaran >= 0),
    keterangan TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Realisasi Anggaran
CREATE TABLE public.realisasi_anggaran (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alokasi_id UUID NOT NULL REFERENCES public.alokasi_anggaran(id) ON DELETE CASCADE,
    tanggal_realisasi DATE NOT NULL,
    nominal BIGINT NOT NULL CHECK (nominal >= 0),
    nomor_simkug TEXT,
    keterangan TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_dosen_share_token ON public.dosen(share_token);
CREATE INDEX idx_alokasi_dosen_tahun ON public.alokasi_anggaran(dosen_id, tahun);
CREATE INDEX idx_realisasi_alokasi ON public.realisasi_anggaran(alokasi_id);
CREATE INDEX idx_realisasi_tanggal ON public.realisasi_anggaran(tanggal_realisasi);

-- RLS
ALTER TABLE public.dosen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alokasi_anggaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realisasi_anggaran ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.dosen FORCE ROW LEVEL SECURITY;
ALTER TABLE public.alokasi_anggaran FORCE ROW LEVEL SECURITY;
ALTER TABLE public.realisasi_anggaran FORCE ROW LEVEL SECURITY;

-- Security Hardening
REVOKE ALL ON TABLE public.dosen FROM anon, authenticated;
REVOKE ALL ON TABLE public.alokasi_anggaran FROM anon, authenticated;
REVOKE ALL ON TABLE public.realisasi_anggaran FROM anon, authenticated;
