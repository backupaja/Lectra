import React from 'react';

interface FormFieldProps {
  label: React.ReactNode;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, optional, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#344054]">
        {label}
        {optional && <span className="text-[#98A2B3] font-normal ml-1">(Opsional)</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[#B42318]">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#181B25] transition-colors border rounded-[8px] outline-none transition-colors placeholder-[#98A2B3] text-[#1F2937]
        ${error ? 'border-[#B42318] focus:ring-2 focus:ring-[#B42318]/20' : 'border-[#E4E7EC] focus:border-[#8F2438] focus:ring-2 focus:ring-[#8F2438]/15'}
        ${className}`}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className = '', children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#181B25] transition-colors border rounded-[8px] outline-none transition-colors text-[#1F2937] cursor-pointer
        ${error ? 'border-[#B42318] focus:ring-2 focus:ring-[#B42318]/20' : 'border-[#E4E7EC] focus:border-[#8F2438] focus:ring-2 focus:ring-[#8F2438]/15'}
        ${className}`}
    >
      {children}
    </select>
  );
}

export function Textarea({ error, className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      {...props}
      className={`w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#181B25] transition-colors border rounded-[8px] outline-none transition-colors resize-none placeholder-[#98A2B3] text-[#1F2937]
        ${error ? 'border-[#B42318] focus:ring-2 focus:ring-[#B42318]/20' : 'border-[#E4E7EC] focus:border-[#8F2438] focus:ring-2 focus:ring-[#8F2438]/15'}
        ${className}`}
    />
  );
}
