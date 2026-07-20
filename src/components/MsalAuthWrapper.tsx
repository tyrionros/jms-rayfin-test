import { useEffect, useState, ReactNode } from 'react';
import { MsalProvider } from '@azure/msal-react';

import { msalInstance } from '@/services/msalConfig';

interface MsalAuthWrapperProps {
  children: ReactNode;
}

/**
 * Wraps authenticated routes with MsalProvider.
 * Handles MSAL redirect promise on mount to complete auth flow.
 */
export function MsalAuthWrapper({ children }: MsalAuthWrapperProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Handle redirect from MSAL auth (after user signs in)
    msalInstance
      .handleRedirectPromise()
      .then(() => {
        console.log('[MSAL] Redirect promise handled, MSAL ready');
        setIsInitialized(true);
      })
      .catch((err) => {
        console.error('[MSAL] Error handling redirect:', err);
        setIsInitialized(true); // Continue anyway
      });
  }, []);

  // Wait for MSAL to initialize before rendering children
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAF8F2]">
        <div className="text-center">
          <div className="inline-block animate-spin w-12 h-12 border-4 border-[#021838] border-t-[#7C4D2F] rounded-full" />
          <p className="mt-4 text-gray-600">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
