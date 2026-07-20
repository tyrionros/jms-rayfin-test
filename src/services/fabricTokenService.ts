import { PublicClientApplication, type Configuration } from '@azure/msal-browser';

// MSAL configuration for Fabric Embed SDK
const msalConfig: Configuration = {
  auth: {
    clientId: 'b803e462-b15d-4173-b74e-eea251f95179', // Hemy 360 - Rayfin Portal
    authority: 'https://login.microsoftonline.com/ead65215-ebfd-4a8d-9e73-b403a85a7e04',
    redirectUri: 'https://kind-whirl-780273fc10-norwayeast.webapp.fabricapps.net/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
};

let msalInstance: PublicClientApplication | null = null;

export function getMsalInstance(): PublicClientApplication {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
  }
  return msalInstance;
}

export async function acquireFabricToken(scopes?: string[]): Promise<string> {
  try {
    const msal = getMsalInstance();
    const tokenScopes = scopes || ['https://api.fabric.microsoft.com/.default'];

    // Get active account
    const accounts = msal.getAllAccounts();
    if (accounts.length === 0) {
      throw new Error('No user account found. Please sign in first.');
    }

    // Try to get token silently (from cache or using refresh token)
    try {
      const result = await msal.acquireTokenSilent({
        scopes: tokenScopes,
        account: accounts[0],
      });
      return result.accessToken;
    } catch (silentErr) {
      // If silent token acquisition fails, trigger interactive login
      console.warn('Silent token acquisition failed, attempting interactive login:', silentErr);
      const result = await msal.acquireTokenPopup({
        scopes: tokenScopes,
        account: accounts[0],
      });
      return result.accessToken;
    }
  } catch (err) {
    console.error('Fabric token acquisition error:', err);
    throw new Error(
      `Failed to acquire Fabric API token: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
