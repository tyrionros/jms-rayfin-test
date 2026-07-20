import { useEffect, useState, useRef } from 'react';
import { ActionMenu } from '@/components/ActionMenu';
import {
  EmbedManager,
  KQLDashboardEmbedClient,
  type KQLDashboardEmbedConfiguration,
} from '@microsoft/fabric-embed';
import { useMsal } from '@azure/msal-react';
import { useAuth } from '@/hooks/AuthContext';
import { msalInstance } from '@/services/msalConfig';

export function HemyLiveDataPage({ onNavigate }: { onNavigate?: (pageId: string) => void }) {
  const { user } = useAuth();
  const { instance } = useMsal();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msalNeedsAuth, setMsalNeedsAuth] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const embedManagerRef = useRef<EmbedManager | null>(null);

  const workspaceId = '0f49bb62-6832-40a7-825d-b730e9874a50';
  const dashboardId = '504c0b42-48e2-48e4-84c2-127b69c7dac6';

  const handleReloadWithNewToken = async () => {
    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await msalInstance.logoutPopup({ account: accounts[0] });
      }
      window.location.reload();
    } catch (err) {
      console.error('[HemyLiveDataPage] Error during token refresh:', err);
      window.location.reload();
    }
  };

  // Explicit user-triggered login action for MSAL environment context
  const handleMsalLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await msalInstance.initialize();
      
      // Using redirect instead of popup to support iframe environments cleanly
      await msalInstance.loginRedirect({
        scopes: ['https://api.fabric.microsoft.com/.default'],
        loginHint: msalInstance.getAllAccounts()[0]?.username || undefined
      });
    } catch (err) {
      console.error('[HemyLiveDataPage] Redirect login failed:', err);
      setError('Failed to initiate login redirect.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const embedDashboard = async () => {
      try {
        if (!user || !containerRef.current) {
          setError('User must be authenticated to view this dashboard.');
          setIsLoading(false);
          return;
        }

        setIsLoading(true);

        await msalInstance.initialize();
        console.log('[HemyLiveDataPage] MSAL initialized');

        // This resolves the token extraction after a redirect landing completes
        const redirectResult = await msalInstance.handleRedirectPromise();
        console.log('[HemyLiveDataPage] MSAL redirect promise handled');

        if (redirectResult && redirectResult.account) {
          msalInstance.setActiveAccount(redirectResult.account);
        }

        let currentAccounts = msalInstance.getAllAccounts();
        console.log(`[HemyLiveDataPage] Found ${currentAccounts.length} accounts in MSAL`);
        
        // If no cached session exists, halt automatic execution and display the connection CTA
        if (currentAccounts.length === 0) {
          console.log('[HemyLiveDataPage] No MSAL session found. Requiring explicit user action.');
          setMsalNeedsAuth(true);
          setIsLoading(false);
          return;
        }

        setMsalNeedsAuth(false);

        const embedManager = new EmbedManager({
          embedClientClasses: [KQLDashboardEmbedClient],
        });
        embedManagerRef.current = embedManager;

        // Token provider function relying entirely on safe, non-blocking calls
        const acquireToken = async (scopes?: string[]): Promise<string> => {
          const tokenScopes = scopes || ['https://api.fabric.microsoft.com/.default'];
          const accounts = msalInstance.getAllAccounts();
          const targetAccount = msalInstance.getActiveAccount() || accounts[0];

          const tokenRequest = {
            scopes: tokenScopes,
            account: targetAccount,
          };

          try {
            const response = await msalInstance.acquireTokenSilent(tokenRequest);
            console.log('[HemyLiveDataPage] Silent token acquired successfully');
            return response.accessToken;
          } catch (silentErr) {
            console.warn('[HemyLiveDataPage] Silent token failed. Falling back to redirect token acquisition.', silentErr);
            // Fall back to redirect if token is entirely expired or missing
            await msalInstance.acquireTokenRedirect(tokenRequest);
            throw new Error('Token acquisition requires redirect authentication. Page will refresh.');
          }
        };

        let initialToken = await acquireToken();
        if (!initialToken) {
          setError('Failed to acquire authentication token. Please try again.');
          setIsLoading(false);
          return;
        }

        const config: KQLDashboardEmbedConfiguration = {
          itemType: 'KQLDashboard',
          workspaceId: workspaceId,
          itemId: dashboardId,
          accessToken: { token: initialToken },
          eventHooks: {
            accessTokenProvider: {
              callback: async ({ scopes }) => {
                const token = await acquireToken(scopes);
                return { token };
              },
            },
            rendered: {
              callback: async () => {
                console.log('[HemyLiveDataPage] Dashboard rendered successfully');
                setIsLoading(false);
              },
            },
            error: {
              callback: async (event: any) => {
                console.error('[HemyLiveDataPage] Embed error:', event);
                setError(`Dashboard Error: ${event?.message || 'Unknown error'}`);
                setIsLoading(false);
              },
            },
          },
        };

        console.log('[HemyLiveDataPage] Embedding dashboard...');
        await embedManager.embed(containerRef.current, config);
      } catch (err) {
        console.error('[HemyLiveDataPage] Error embedding Fabric dashboard:', err);
        setError(`Error: ${err instanceof Error ? err.message : 'Failed to embed dashboard'}`);
        setIsLoading(false);
      }
    };

    if (user) {
      embedDashboard();
    }

    return () => {
      if (embedManagerRef.current) {
        try {
          (embedManagerRef.current as any).dispose?.();
        } catch (e) {
          console.warn('Error disposing embed manager:', e);
        }
      }
    };
  }, [user, instance]);

  return (
    <div className="flex flex-col h-screen bg-[#FAF8F2]">
      <header className="sticky top-0 z-40 border-b border-[#DDD4C0] bg-[#021838] shadow-md">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C4D2F] text-[#FAF8F2]">
              <Hemy360Icon className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight text-[#FAF8F2]" title="Hemy 360 - Hemy Live Data & BMS">
              Hemy Live Data & BMS
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReloadWithNewToken}
              className="p-2 rounded-lg hover:bg-[#FAF8F2]/20 transition duration-200"
              title="Clear token cache and reload"
            >
              <svg
                className="w-5 h-5 text-[#FAF8F2]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <ActionMenu
              title="My Action"
              items={[
                { label: 'My Action', onClick: () => onNavigate?.('myaction') },
                { label: 'My Activity', onClick: () => console.log('Activity') },
                { label: 'Oh My My', onClick: () => console.log('Oh My') },
              ]}
            />
          </div>
        </div>
      </header>
      {/* Content */}
      <div className="flex-1 overflow-hidden p-4 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F2] z-10">
            <div className="text-center">
              <div className="inline-block animate-spin w-12 h-12 border-4 border-[#021838] border-t-[#7C4D2F] rounded-full" />
              <p className="mt-4 text-gray-600 font-medium">Loading live capacity feed...</p>
            </div>
          </div>
        )}

        {msalNeedsAuth && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F2] z-10">
            <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-sm border border-gray-200">
              <p className="text-lg font-bold text-[#021838] mb-2">Connect to Hemy 360 Ecosystem</p>
              <p className="text-sm text-gray-600 mb-6">A secure sub-session needs to be established to query the backend capacity metrics.</p>
              <button
                onClick={handleMsalLogin}
                className="w-full bg-[#7C4D2F] hover:bg-[#633d25] text-white font-medium py-2 px-4 rounded transition duration-200"
              >
                Authorize Live Connection
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F2] z-10">
            <div className="text-center text-red-600 max-w-md p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-lg font-bold mb-2">Embedding Initialization Halted</p>
              <p className="text-sm whitespace-pre-line">{error}</p>
            </div>
          </div>
        )}

        {/* Container for Fabric Embed SDK */}
        <div
          ref={containerRef}
          id="fabric-embed"
          className="w-full h-full border-0 rounded-lg shadow-sm overflow-hidden bg-white"
          style={{ visibility: isLoading || error || msalNeedsAuth ? 'hidden' : 'visible' }}
        />
      </div>
    </div>
  );
}
function Hemy360Icon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      {/* Letter H */}
      <text
        x="12"
        y="16"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="sans-serif"
      >
        H
      </text>
      {/* Circular arrow 360 degrees - arc with arrowhead */}
      <path
        d="M 12 3 A 9 9 0 0 1 21 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <path d="M 21 12 L 19.5 10.5 L 20.5 11.5" fill="currentColor" />
    </svg>
  );
}
