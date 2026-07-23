import React from 'react';
import { createRoot } from 'react-dom/client';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import App from '@/App';
import { AuthProvider } from '@/hooks/AuthContext';
import { bootstrapAuth } from '@/services/bootstrap';
import { msalConfig } from '@/services/msalConfig';

import './main.css';

async function main() {
  // 1. Create and initialize MSAL instance before rendering
  const msalInstance = new PublicClientApplication(msalConfig);
  await msalInstance.initialize();

  // 2. Handle redirect if returning from login
  await msalInstance.handleRedirectPromise();

  // 3. Set active account if returning user exists
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
    console.log('[MSAL Bootstrap] Active account set:', accounts[0].username);
  }

  // 4. Bootstrap Rayfin auth service (uses same MSAL instance)
  const authService = bootstrapAuth();

  // 5. Render React app once MSAL is fully initialized
  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <AuthProvider authService={authService}>
          <App />
        </AuthProvider>
      </MsalProvider>
    </React.StrictMode>
  );
}

main().catch(console.error);
