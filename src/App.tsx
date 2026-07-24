import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthPage } from '@/components/AuthPage';
import { FloatingFeedbackButton } from '@/components/FloatingFeedbackButton';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/hooks/AuthContext';
import { HomePage } from '@/pages/HomePage';
import { HemyAIPage } from '@/pages/HemyAIPage';
import { HemyXPage } from '@/pages/HemyXPage';
import { HemySalePage } from '@/pages/HemySalePage';
import { HemyFinancePage } from '@/pages/HemyFinancePage';
import { HemyOrgSystemArchPage } from '@/pages/HemyOrgSystemArchPage';
import { HemyProjectsPage } from '@/pages/HemyProjectsPage';
import { HemyReportsPage } from '@/pages/HemyReportsPage';
import { HemyDataPage } from '@/pages/HemyDataPage';
import { HemyLiveDataPage } from '@/pages/HemyLiveDataPage';
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
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#DDD4C0] border-t-[#021838]" />
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
                  <div style={{ display: currentPage === 'home' ? 'block' : 'none' }}>
                   <HomePage onNavigate={handleNavigate} />
                  </div>
                  <div style={{ display: currentPage === 'hemyai' ? 'block' : 'none' }}>
                   <HemyAIPage />
                  </div>
                  <div style={{ display: currentPage === 'omniverse' ? 'block' : 'none' }}>
                   <WebRTCStreamPage />
                  </div>
                  <div style={{ display: currentPage === 'hemlivedata' ? 'block' : 'none' }}>
                   <HemyLiveDataPage />
                  </div>
                  <div style={{ display: currentPage === 'hemyx' ? 'block' : 'none' }}>
                   <HemyXPage />
                  </div>
                  <div style={{ display: currentPage === 'hemysale' ? 'block' : 'none' }}>
                   <HemySalePage />
                  </div>
                  <div style={{ display: currentPage === 'hemyfinance' ? 'block' : 'none' }}>
                   <HemyFinancePage />
                  </div>
                  <div style={{ display: currentPage === 'hemyosarch' ? 'block' : 'none' }}>
                   <HemyOrgSystemArchPage />
                  </div>
                  <div style={{ display: currentPage === 'hemyprojects' ? 'block' : 'none' }}>
                   <HemyProjectsPage />
                  </div>
                  <div style={{ display: currentPage === 'hemyreports' ? 'block' : 'none' }}>
                   <HemyReportsPage />
                  </div>
                  <div style={{ display: currentPage === 'hemydata' ? 'block' : 'none' }}>
                   <HemyDataPage />
                  </div>
                  <div style={{ display: currentPage === 'myaction' ? 'block' : 'none' }}>
                   <MyActionPage />
                  </div>
                </div>
              </div>
              <FloatingFeedbackButton user={user} currentPageName="Hemy 360 - test by JMS" />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
