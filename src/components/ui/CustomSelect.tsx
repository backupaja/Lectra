import React, { useState, useRef, useEffect } from 'react';

export interface Option {
  label: string;
  value: string | number | null;
}

interface CustomSelectProps {
  value: string | number | null;
  onChange: (value: any) => void;
  options: Option[];
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
}

export function CustomSelect({ value, onChange, options, className, buttonClassName, dropdownClassName }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className || ''}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full outline-none transition-all ${buttonClassName || 'bg-white transition-colors border border-[#E4E7EC] rounded-md px-2.5 py-1 text-[11px] font-medium text-[#1F2937] shadow-sm hover:bg-gray-50 focus:border-[#8F2438] focus:ring-1 focus:ring-[#8F2438]/20'}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : 'Pilih...'}</span>
        <svg className={`w-3 h-3 text-[#98A2B3] transition-transform shrink-0 ml-1.5 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute z-50 mt-1 bg-white transition-colors border border-[#E4E7EC] rounded-lg shadow-xl max-h-[160px] overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100 ${dropdownClassName || 'w-full min-w-[100px] left-0'}`}>
          {options.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 text-[11px] transition-colors ${
                opt.value === value 
                  ? 'bg-[#FDF5F6] text-[#8F2438] font-bold' 
                  : 'text-[#344054] hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
