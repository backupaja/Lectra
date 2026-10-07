import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Sabar yaa, lagi diabsen satu-satu... 🏃‍♂️💨' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-16 animate-fade-in w-full">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-[#F8E9ED] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#8F2438] rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">👩‍🏫</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <p className="text-[#8F2438] font-semibold text-sm tracking-wide">
          Mengumpulkan 1.600+ dosen
        </p>
        <div className="flex gap-1 mt-1">
          <span className="w-1.5 h-1.5 bg-[#8F2438] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-1.5 h-1.5 bg-[#8F2438] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-1.5 h-1.5 bg-[#8F2438] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
      <p className="text-xs text-[#98A2B3] mt-2 font-medium">{message}</p>
    </div>
  );
};
