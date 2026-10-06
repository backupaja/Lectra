import React, { useState } from 'react';
import type { Page } from '../../types';

interface TopNavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const navItems: { label: string; page: Page; icon: React.ReactNode }[] = [
  {
    label: 'Dashboard',
    page: 'dashboard',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
  },
  {
    label: 'Penetapan Anggaran',
    page: 'penetapan',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
    label: 'Realisasi Anggaran',
    page: 'realisasi',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
  },
  {
    label: 'Progress JAD',
    page: 'progress-jad',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
  }
];

export function TopNavigation({ currentPage, onNavigate, onLogout }: TopNavigationProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#E4E7EC] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-[#8F2438] rounded-[8px] flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-[#1F2937] leading-none">LECTRA</div>
            <div className="text-[10px] text-[#98A2B3] leading-none mt-0.5">Lecturer Budget System</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center gap-2 flex-1">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-sm font-medium transition-colors cursor-pointer ${currentPage === item.page
                  ? 'bg-[#F8E9ED] text-[#8F2438]'
                  : 'text-[#667085] hover:text-[#1F2937] hover:bg-[#F7F7F8]'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="ml-auto flex items-center gap-3">

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded-[8px] hover:bg-[#F7F7F8] transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 bg-[#8F2438] rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
              <span className="hidden sm:block text-sm font-medium text-[#344054]">Admin</span>
              <svg className="w-4 h-4 text-[#98A2B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-[12px] border border-[#E4E7EC] shadow-lg z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E4E7EC]">
                    <p className="text-sm font-medium text-[#1F2937]">Admin LECTRA</p>
                    <p className="text-xs text-[#98A2B3]">admin@univ.ac.id</p>
                  </div>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-[#667085] hover:bg-[#F7F7F8] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    Profil
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); onLogout(); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#B42318] hover:bg-[#FDECEC] flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-[8px] text-[#667085] hover:bg-[#F7F7F8]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E4E7EC] bg-white px-4 py-3 flex flex-col gap-1">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => { onNavigate(item.page); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-[8px] text-sm font-medium ${currentPage === item.page ? 'bg-[#F8E9ED] text-[#8F2438]' : 'text-[#667085]'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
