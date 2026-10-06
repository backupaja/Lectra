import React, { useState, useEffect } from 'react';
import type { Page } from './types';
import { TopNavigation } from './components/layout/TopNavigation';
import { LoginPage } from './pages/LoginPage';
import { PublicDashboard } from './pages/PublicDashboard';
import { DashboardPage } from './pages/DashboardPage';
import { PenetapanAnggaranPage } from './pages/PenetapanAnggaranPage';
import { RealisasiAnggaranPage } from './pages/RealisasiAnggaranPage';
import { ProgressJADPage } from './pages/ProgressJADPage';
import { DosenDashboard } from './pages/DosenDashboard';
import { AuthService } from './services/authService';
import { ChatBot } from './components/ui/ChatBot';

function parseDosenToken(): string | null {
  const hash = window.location.hash;
  const match = hash.match(/^#\/dosen\/([a-fA-F0-9]{64})/);
  return match ? match[1] : null;
}

export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [dosenToken, setDosenToken] = useState<string | null>(parseDosenToken);

  // Listen to hash changes so shared links work
  useEffect(() => {
    const onHash = () => {
      const token = parseDosenToken();
      setDosenToken(token);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await AuthService.getSession();
        if (session && session.user.app_metadata?.role === 'admin') {
          setIsAuthed(true);
          if (page === 'login') {
            setPage('dashboard');
          }
        }
      } catch (err) {
        console.error('Error checking auth:', err);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // If URL has a dosen token, show dosen dashboard regardless of auth
  if (dosenToken) {
    return (
      <DosenDashboard
        token={dosenToken}
        onBack={() => {
          window.location.hash = '';
          setDosenToken(null);
        }}
      />
    );
  }

  const handleLogin = () => {
    setIsAuthed(true);
    setPage('dashboard');
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setIsAuthed(false);
    setPage('login');
  };

  if (isAuthLoading && !dosenToken) {
    return <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">Memuat...</div>;
  }

  if (page === 'login') {
    return <LoginPage onLogin={handleLogin} onPublic={() => setPage('public')} />;
  }

  if (page === 'public') {
    return <PublicDashboard onLogin={() => setPage('login')} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      <TopNavigation currentPage={page} onNavigate={setPage} onLogout={handleLogout} />
      {page === 'dashboard' && <DashboardPage onNavigate={setPage} />}
      {page === 'penetapan' && <PenetapanAnggaranPage />}
      {page === 'realisasi' && <RealisasiAnggaranPage />}
      {page === 'progress-jad' && <ProgressJADPage />}
      {isAuthed && <ChatBot />}
    </div>
  );
}
