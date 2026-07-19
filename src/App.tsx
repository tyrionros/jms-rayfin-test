import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthPage } from '@/components/AuthPage';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/hooks/AuthContext';
import { HomePage } from '@/pages/HomePage';
import { HemyXPage } from '@/pages/HemyXPage';
import { MyActionPage } from '@/pages/MyActionPage';
import { WebRTCStreamPage } from '@/pages/WebRTCStreamPage';

function AuthGuard({
  children,
  requireAuth,
}: {
  children: React.ReactNode;
  requireAuth: boolean;
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F2]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#DDD4C0] border-t-[#1B2A4A]" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) return <Navigate to="/auth" replace />;
  if (!requireAuth && isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
}

function App() {
  const { signOut, user } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('home');

  const handleLogout = () => {
    void signOut();
  };

  const handleNavigate = (pageId: string) => {
    setCurrentPage(pageId);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthGuard requireAuth={false}>
              <AuthPage />
            </AuthGuard>
          }
        />
        <Route
          path="/"
          element={
            <AuthGuard requireAuth={true}>
              <div className="flex">
                <Sidebar onLogout={handleLogout} onNavigate={handleNavigate} user={user} />
                <div className="flex-1 ml-20">
                  {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
                  {currentPage === 'stream' && <WebRTCStreamPage />}
                  {currentPage === 'hemyx' && <HemyXPage />}
                  {currentPage === 'myaction' && <MyActionPage />}
                </div>
              </div>
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
