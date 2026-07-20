import { getRayfinClient } from './rayfinClient';

/**
 * Acquires an access token for Fabric APIs using Rayfin's existing
 * Fabric authentication provider (not a separate MSAL instance).
 * 
 * This leverages the brokered auth that Rayfin already established,
 * so the user doesn't need to authenticate separately.
 */
export async function acquireFabricToken(scopes?: string[]): Promise<string> {
  try {
    const rayfinClient = getRayfinClient();
    
    // Get the underlying auth provider from Rayfin's client
    const authProvider = (rayfinClient.auth as any)._provider || 
                         (rayfinClient.auth as any).provider ||
                         rayfinClient.auth;

    // Try multiple ways to access the token acquisition method
    if (typeof (authProvider as any).acquireToken === 'function') {
      const tokenScopes = scopes || ['https://api.fabric.microsoft.com/.default'];
      const token = await (authProvider as any).acquireToken(tokenScopes);
      if (token) {
        return token;
      }
    }

    // Alternative: Try to get token through getAccessToken
    if (typeof (authProvider as any).getAccessToken === 'function') {
      const token = await (authProvider as any).getAccessToken({
        scopes: scopes || ['https://api.fabric.microsoft.com/.default'],
      });
      if (token) {
        return token;
      }
    }

    // Last resort: Check if there's a token in the session's internal store
    const session = rayfinClient.auth.getSession();
    if (session && (session as any).accessToken) {
      return (session as any).accessToken;
    }

    // If all else fails, check for cached token in window or sessionStorage
    const cachedToken = sessionStorage.getItem('fabric_access_token');
    if (cachedToken) {
      return cachedToken;
    }

    throw new Error(
      'Could not acquire access token from Rayfin auth provider. ' +
      'Ensure you are properly authenticated through Rayfin.'
    );
  } catch (err) {
    console.error('Fabric token acquisition error:', err);
    throw new Error(
      `Failed to acquire Fabric API token from Rayfin auth: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
