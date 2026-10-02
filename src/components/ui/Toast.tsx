import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

const styles: Record<ToastType, { bg: string; icon: string; text: string }> = {
  success: { bg: 'bg-[#E8F5EF] border-[#16805B]/20', icon: '✓', text: 'text-[#16805B]' },
  error: { bg: 'bg-[#FDECEC] border-[#B42318]/20', icon: '✕', text: 'text-[#B42318]' },
  warning: { bg: 'bg-[#FFF4D6] border-[#C88719]/20', icon: '⚠', text: 'text-[#C88719]' },
  info: { bg: 'bg-[#F8E9ED] border-[#8F2438]/20', icon: 'i', text: 'text-[#8F2438]' },
};

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const s = styles[type];
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-[12px] border shadow-lg ${s.bg} ${s.text} max-w-sm animate-[slideUp_0.3s_ease]`}>
      <span className="w-5 h-5 rounded-full bg-current/15 flex items-center justify-center text-xs font-bold shrink-0">{s.icon}</span>
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-auto text-current/60 hover:text-current text-lg leading-none">×</button>
    </div>
  );
}
