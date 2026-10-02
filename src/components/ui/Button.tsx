import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-[#8F2438] text-white hover:bg-[#761D2E] active:bg-[#5E1726] disabled:bg-[#D9DDE3] disabled:text-[#98A2B3] disabled:cursor-not-allowed',
  secondary: 'bg-white text-[#344054] border border-[#E4E7EC] hover:bg-[#F7F7F8] disabled:opacity-50 disabled:cursor-not-allowed',
  danger: 'bg-[#FDECEC] text-[#B42318] border border-[#B42318]/20 hover:bg-[#B42318] hover:text-white disabled:opacity-50',
  ghost: 'text-[#667085] hover:bg-[#F7F7F8] hover:text-[#1F2937]',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export function Button({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-[10px] transition-colors duration-150 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
