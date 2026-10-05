import React, { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClasses = { md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-3xl', '2xl': 'max-w-4xl' };

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'lg' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-[16px] shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}>
        {/* Header - fixed */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#E4E7EC] shrink-0">
          <div>
            <h2 className="text-base font-semibold text-[#1F2937]">{title}</h2>
            {subtitle && <p className="text-xs text-[#667085] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#98A2B3] hover:text-[#1F2937] hover:bg-[#F7F7F8] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Body - scrollable */}
        <div className="overflow-y-auto flex-1 p-5">{children}</div>
        {/* Footer - always pinned at bottom */}
        {footer && (
          <div className="shrink-0 px-5 py-4 border-t border-[#E4E7EC] bg-white rounded-b-[16px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
