import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { AuthService } from '../services/authService';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LoginPageProps {
  onLogin: () => void;
  onPublic: () => void;
}

export function LoginPage({ onLogin, onPublic }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email dan password tidak boleh kosong.');
      return;
    }
    setLoading(true);
    try {
      await AuthService.login(email, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Email atau password tidak sesuai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white transition-colors flex p-3 sm:p-6 lg:p-8">
      {/* Left — Lottie Animation Panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        
        {/* Center Lottie Animation */}
        <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center min-h-0">
          <DotLottieReact
            src="/employee-content.json"
            loop
            autoplay
            style={{ 
              width: '100%', 
              height: '100%', 
              maxHeight: '90vh',
              transform: 'scale(1.8) translateY(-5%)', 
              transformOrigin: 'center center'
            }}
          />
        </div>
      </div>

      {/* Right — Login form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 xl:px-24 py-8 relative">
        <div className="w-full max-w-[420px] mx-auto">
          {/* Logo & Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-[#8F2438] rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span className="font-bold text-[#1F2937] text-xl tracking-tight">LECTRA</span>
            </div>
            <h1 className="text-2xl font-bold text-[#8F2438] mb-1.5">Lecturer Budget System</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#344054]">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full px-3.5 py-2.5 text-[13px] bg-white transition-colors border rounded-lg outline-none transition-colors placeholder-[#98A2B3] text-[#1F2937] ${error && !email ? 'border-[#B42318] focus:ring-2 focus:ring-[#B42318]/20' : 'border-[#D0D5DD] focus:border-[#8F2438] focus:ring-2 focus:ring-[#8F2438]/15'}`}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#344054]">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 pr-10 text-[13px] bg-white transition-colors border rounded-lg outline-none transition-colors placeholder-[#98A2B3] text-[#1F2937] ${error && !password ? 'border-[#B42318] focus:ring-2 focus:ring-[#B42318]/20' : 'border-[#D0D5DD] focus:border-[#8F2438] focus:ring-2 focus:ring-[#8F2438]/15'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#667085]"
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 bg-[#FDECEC] rounded-[8px] border border-[#B42318]/20 mt-1">
                <svg className="w-4 h-4 text-[#B42318] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-xs text-[#B42318]">{error}</p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full py-2.5 text-[14px] mt-2 rounded-lg bg-[#B32A46] hover:bg-[#8F2438] text-white font-semibold transition-colors border-none shadow-sm">
              {loading ? 'Memproses...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8 text-center">
             <button type="button" onClick={onPublic} className="text-[13px] text-[#98A2B3] hover:text-[#8F2438] font-medium transition-colors">
               Lihat Dashboard Publik
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
