import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { Dosen } from '../../types';

interface ShareLinkModalProps {
  open: boolean;
  onClose: () => void;
  dosen: Dosen | null;
}

export function ShareLinkModal({ open, onClose, dosen }: ShareLinkModalProps) {
  const [copied, setCopied] = useState(false);

  if (!dosen) return null;

  const shareUrl = `${window.location.origin}${window.location.pathname}#/dosen/${dosen.shareToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Bagikan Dashboard Dosen" subtitle="Kirimkan tautan ini kepada dosen agar dapat melihat anggaran mereka sendiri." size="md">
      <div className="flex flex-col gap-5">
        {/* Dosen info */}
        <div className="flex items-center gap-3 p-4 bg-[#F8E9ED] rounded-[12px]">
          <div className="w-10 h-10 bg-[#8F2438] rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
            {dosen.nama.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1F2937]">{dosen.nama}</p>
            <p className="text-xs text-[#667085]">{dosen.jabatanAkademik} · {dosen.fakultas}</p>
          </div>
        </div>

        {/* Link preview */}
        <div>
          <p className="text-xs font-medium text-[#344054] mb-2">Tautan Dashboard</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-[#F7F7F8] border border-[#E4E7EC] rounded-[10px] overflow-hidden">
              <svg className="w-4 h-4 text-[#98A2B3] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <span className="text-xs text-[#667085] truncate font-mono">{shareUrl}</span>
            </div>
            <button
              onClick={handleCopy}
              className={`shrink-0 px-3 py-2.5 rounded-[10px] text-xs font-medium transition-colors cursor-pointer ${
                copied
                  ? 'bg-[#E8F5EF] text-[#16805B] border border-[#16805B]/20'
                  : 'bg-[#8F2438] text-white hover:bg-[#761D2E]'
              }`}
            >
              {copied ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Tersalin!
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                  </svg>
                  Salin Tautan
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          {[
            { icon: '👁', text: 'Dosen hanya dapat melihat data milik mereka sendiri' },
            { icon: '🔒', text: 'Tidak dapat mengedit, menambah, atau menghapus data' },
            { icon: '📊', text: 'Menampilkan OPEX, CAPEX, riwayat realisasi, dan grafik' },
          ].map(item => (
            <div key={item.text} className="flex items-start gap-2.5 text-xs text-[#667085]">
              <span className="shrink-0">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2 border-t border-[#E4E7EC]">
          <Button variant="secondary" onClick={onClose} className="flex-1">Tutup</Button>
          <Button onClick={handleCopy} className="flex-1">
            {copied ? '✓ Tersalin' : 'Salin Tautan'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
