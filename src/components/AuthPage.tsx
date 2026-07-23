import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { useAuth } from '@/hooks/AuthContext';

const msLogo = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 21 21"
    className="mr-2"
  >
    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
  </svg>
);

export function AuthPage() {
  const { signIn, fabricAuthEnabled } = useAuth();
  const { instance: msalInstance } = useMsal(); // Use MSAL from context (initialized in main.tsx)
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // MSAL is already initialized in main.tsx, just attempt silent token acquisition
      const loginRequest = {
        scopes: ['https://api.fabric.microsoft.com/.default'],
      };
      try {
        // MSAL is already initialized, just acquire token
        const redirectResult = await msalInstance.handleRedirectPromise();
        if (redirectResult?.accessToken) {
          console.log('[AuthPage] Token acquired from redirect');
        } else {
          await msalInstance.acquireTokenSilent(loginRequest);
        }
        console.log('[AuthPage] MSAL token acquisition successful');
      } catch (msalErr) {
        console.warn('[AuthPage] MSAL silent token failed, continuing with Rayfin auth:', msalErr);
        // Continue even if MSAL fails - Rayfin auth is primary
      }

      // Then sign in with Rayfin/Fabric
      await signIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const buttonLabel = isLoading
    ? fabricAuthEnabled
      ? 'Opening Fabric...'
      : 'Signing in...'
    : 'Sign in with Microsoft';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F2] p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#021838] text-[#FAF8F2] shadow-lg">
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#021838]">
            Hemy 360 (prototype)
          </h1>
          <p className="mt-1.5 text-sm text-[#7C4D2F]">
            Sign in to manage your property operations.
          </p>
        </div>

        <div className="rounded-2xl border border-[#DDD4C0] bg-white/70 p-6 shadow-sm backdrop-blur-sm">
          <button
            type="button"
            onClick={handleSignIn}
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-xl bg-[#021838] px-4 py-3 text-sm font-semibold text-[#FAF8F2] shadow-sm transition-colors hover:bg-[#0D2E5C] disabled:opacity-50"
          >
            {msLogo}
            {buttonLabel}
          </button>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#C4956A]">
          Powered by Rayfin on Microsoft Fabric. Built by Hemy AS.
        </p>
      </div>
    </div>
  );
}
