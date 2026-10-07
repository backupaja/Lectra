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
    <div className="h-screen w-full flex overflow-hidden bg-white font-sans">
      {/* Left side - Animation & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#FFF3F5] via-white to-[#FCE7F3] flex-col justify-center items-center overflow-hidden">
        {/* Massive Gradient Orbs for Mesh Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top left maroon glow */}
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#8F2438]/20 to-transparent blur-[100px] animate-pulse mix-blend-multiply" />
          
          {/* Bottom right soft rose glow */}
          <div className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-tl from-[#E47B8F]/30 to-transparent blur-[120px] mix-blend-multiply" />
          
          {/* Center-left subtle peach glow */}
          <div className="absolute top-[30%] -left-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-[#FFD3DA]/40 to-transparent blur-[90px] mix-blend-multiply" />
        </div>

        <div className="relative z-10 w-full max-w-xl aspect-square hover:scale-[1.03] transition-transform duration-700 cursor-default p-8">
          <DotLottieReact
            src="/employee-content.json"
            loop
            autoplay
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 xl:px-24 2xl:px-32 relative bg-white overflow-y-auto">
        <div className="w-full max-w-[400px] mx-auto py-8">
          
          <div className="mb-10 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start items-center mb-8">
              <img src="/logo-wide.png" alt="DigiLectra Logo" className="h-14 object-contain lg:-ml-3" />
            </div>
            <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Selamat Datang</h1>
            <p className="text-[#667085] text-sm">Masuk ke akun Anda untuk mengakses sistem.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#344054]">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@lectra.ac.id"
                className={`w-full px-4 py-3.5 text-sm bg-white border rounded-xl outline-none transition-all placeholder-[#98A2B3] text-[#1F2937] ${error && !email ? 'border-red-300 focus:ring-4 focus:ring-red-50' : 'border-[#E4E7EC] hover:border-[#D0D5DD] focus:border-[#8F2438] focus:ring-4 focus:ring-[#8F2438]/10'}`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#344054]">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3.5 pr-12 text-sm bg-white border rounded-xl outline-none transition-all placeholder-[#98A2B3] text-[#1F2937] ${error && !password ? 'border-red-300 focus:ring-4 focus:ring-red-50' : 'border-[#E4E7EC] hover:border-[#D0D5DD] focus:border-[#8F2438] focus:ring-4 focus:ring-[#8F2438]/10'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#667085] transition-colors focus:outline-none"
                >
                  {showPass ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-3.5 bg-red-50 rounded-xl border border-red-100 mt-1">
                <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-red-700 leading-snug">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              loading={loading} 
              className="w-full py-3.5 text-[15px] mt-4 rounded-xl bg-[#8F2438] hover:bg-[#7a1e2f] text-white font-semibold transition-all shadow-md shadow-[#8F2438]/20 hover:shadow-lg hover:shadow-[#8F2438]/30 hover:-translate-y-0.5"
            >
              {loading ? 'Memproses...' : 'Sign In'}
            </Button>
          </form>

          {/* Subtle text link for public dashboard */}
          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E4E7EC] to-transparent"></div>
            <p className="text-[13px] text-[#667085]">
              Ingin melihat transparansi data?{' '}
              <button 
                onClick={onPublic}
                className="font-semibold text-[#8F2438] hover:text-[#631826] transition-colors hover:underline focus:outline-none"
              >
                Dashboard Publik &rarr;
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
