import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';

import { msalInstance } from '@/services/msalConfig';
import { AuthPage } from '@/components/AuthPage';
import { FloatingFeedbackButton } from '@/components/FloatingFeedbackButton';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/hooks/AuthContext';
import { HomePage } from '@/pages/HomePage';
import { HemyXPage } from '@/pages/HemyXPage';
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
    <MsalProvider instance={msalInstance}>
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
                    {currentPage === 'omniverse' && <WebRTCStreamPage />}
                    {currentPage === 'hemlivedata' && <HemyLiveDataPage />}
                    {currentPage === 'hemyx' && <HemyXPage />}
                    {currentPage === 'hemyprojects' && <HemyProjectsPage />}
                    {currentPage === 'hemyreports' && <HemyReportsPage />}
                    {currentPage === 'hemydata' && <HemyDataPage />}
                    {currentPage === 'myaction' && <MyActionPage />}
                  </div>
                </div>
                <FloatingFeedbackButton user={user} currentPageName="Hemy 360 - test by JMS" />
              </AuthGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MsalProvider>
  );
}

export default App;
