import React from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  danger?: boolean;
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Hapus', danger = true }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-[#181B25] transition-colors rounded-[16px] shadow-xl w-full max-w-sm p-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${danger ? 'bg-[#FDECEC]' : 'bg-[#F8E9ED]'}`}>
          <svg className={`w-6 h-6 ${danger ? 'text-[#B42318]' : 'text-[#8F2438]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-[#1F2937] mb-1">{title}</h3>
        <p className="text-sm text-[#667085] mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel} className="flex-1">Batal</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} className="flex-1">{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
