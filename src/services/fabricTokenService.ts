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

export async function acquireFabricToken(userEmail?: string, scopes?: string[]): Promise<string> {
  try {
    const msal = getMsalInstance();
    const tokenScopes = scopes || ['https://api.fabric.microsoft.com/.default'];

    // Get accounts from MSAL cache
    const accounts = msal.getAllAccounts();
    
    // Try to find account by email if provided
    let targetAccount = accounts[0];
    if (userEmail && accounts.length > 0) {
      const matchedAccount = accounts.find(
        (acc) => acc.username?.toLowerCase() === userEmail.toLowerCase()
      );
      if (matchedAccount) {
        targetAccount = matchedAccount;
      }
    }

    // If no account found and we have user email, try interactive login
    if (!targetAccount && userEmail) {
      console.log(`No cached account found for ${userEmail}, attempting interactive login...`);
      const result = await msal.loginPopup({
        scopes: tokenScopes,
        loginHint: userEmail,
      });
      
      if (result?.accessToken) {
        return result.accessToken;
      }
      
      // If login succeeded but no token, try to acquire it
      targetAccount = result?.account || accounts[0];
    }

    if (!targetAccount) {
      throw new Error(
        'No user account found in MSAL cache. Please ensure you are signed in and try again.'
      );
    }

    // Try to get token silently (from cache or using refresh token)
    try {
      const result = await msal.acquireTokenSilent({
        scopes: tokenScopes,
        account: targetAccount,
      });
      return result.accessToken;
    } catch (silentErr) {
      // If silent token acquisition fails, trigger interactive login
      console.warn('Silent token acquisition failed, attempting interactive login:', silentErr);
      const result = await msal.acquireTokenPopup({
        scopes: tokenScopes,
        account: targetAccount,
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
