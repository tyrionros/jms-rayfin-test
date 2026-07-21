# fabricTokenService Service

## Overview
The **fabricTokenService** acquires access tokens for Microsoft Fabric API operations. It leverages Rayfin's built-in Fabric authentication provider to obtain tokens without requiring a separate MSAL instance, providing a unified authentication flow.

## Location
`src/services/fabricTokenService.ts`

## Purpose
- **Token Acquisition**: Get valid Fabric API tokens
- **Brokered Auth**: Use Rayfin's existing auth provider
- **Unified Flow**: Single authentication mechanism for entire app
- **Scope Management**: Support custom token scopes

## Exports

### `acquireFabricToken(scopes?: string[])`
Acquires an access token for Fabric APIs using Rayfin's authentication.

**Parameters:**
- `scopes` (optional): Array of OAuth scopes (default: `['https://api.fabric.microsoft.com/.default']`)

**Returns:**
- `Promise<string>` - Valid access token for Fabric API

**Errors:**
- Throws `Error` if token acquisition fails
- Includes detailed error message with reason

**Usage:**
```typescript
// Default scope
const token = await acquireFabricToken();

// Custom scopes
const token = await acquireFabricToken([
  'https://api.fabric.microsoft.com/.default',
  'https://graph.microsoft.com/.default',
]);
```

## Token Acquisition Strategy

The service attempts multiple fallback strategies to acquire tokens:

### 1. Direct acquireToken Method
```typescript
if (typeof authProvider.acquireToken === 'function') {
  const token = await authProvider.acquireToken(scopes);
  if (token) return token;
}
```

### 2. getAccessToken Method
```typescript
if (typeof authProvider.getAccessToken === 'function') {
  const token = await authProvider.getAccessToken({ scopes });
  if (token) return token;
}
```

### 3. Session Token
```typescript
const session = rayfinClient.auth.getSession();
if (session && session.accessToken) {
  return session.accessToken;
}
```

### 4. Cached Token
```typescript
const cachedToken = sessionStorage.getItem('fabric_access_token');
if (cachedToken) {
  return cachedToken;
}
```

## Default Scopes

### Primary Scope
```
https://api.fabric.microsoft.com/.default
```

Provides access to:
- Fabric Dashboards
- Fabric Reports
- Fabric Datasets
- Fabric Capacity operations
- Other Fabric APIs

## Usage Examples

### Acquiring Token for Fabric Dashboard
```typescript
import { acquireFabricToken } from '@/services/fabricTokenService';

export async function initializeFabricDashboard() {
  try {
    const token = await acquireFabricToken();
    
    // Use token with Fabric SDK
    const accessTokenProvider = async () => token;
    
    // Initialize dashboard with token provider
    const dashboard = await fabric.report.embedDashboard({
      accessTokenProvider,
      // ... other options
    });
  } catch (error) {
    console.error('Failed to get Fabric token:', error);
  }
}
```

### In Component
```typescript
import { acquireFabricToken } from '@/services/fabricTokenService';

function HemyLiveDataPage() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    acquireFabricToken()
      .then(setToken)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!token) return <div>Loading token...</div>;

  return <FabricDashboard token={token} />;
}
```

### With Custom Scopes
```typescript
import { acquireFabricToken } from '@/services/fabricTokenService';

const token = await acquireFabricToken([
  'https://api.fabric.microsoft.com/Capacity.Read.All',
  'https://graph.microsoft.com/User.Read',
]);
```

## Integration with Rayfin

### Rayfin Auth Provider
The service accesses Rayfin's internal auth provider via:
```typescript
const rayfinClient = getRayfinClient();
const authProvider = (rayfinClient.auth as any)._provider || 
                     (rayfinClient.auth as any).provider ||
                     rayfinClient.auth;
```

### Brokered Authentication
- Uses Rayfin's established authentication
- Reuses existing session
- No additional user login required
- Unified token management

### Benefits
- Single sign-on (SSO)
- Shared authentication context
- Simplified token management
- Reduced complexity

## Error Handling

### Comprehensive Error Messages

```typescript
try {
  const token = await acquireFabricToken();
} catch (error) {
  // Error message includes:
  // 1. What failed: "Failed to acquire Fabric API token from Rayfin auth"
  // 2. Why it failed: Original error message
  // 3. Suggested action: "Ensure you are properly authenticated"
  
  console.error('Token error:', error.message);
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Could not acquire access token" | Auth provider unavailable | Ensure Rayfin auth initialized |
| "User not authenticated" | No active session | User needs to sign in |
| "Token acquisition timeout" | Network issue | Check connection |
| "Permission denied" | Insufficient permissions | Check user roles |

## Token Storage

### Session Storage
Cached token stored in sessionStorage:
```typescript
const cachedToken = sessionStorage.getItem('fabric_access_token');
```

**Advantages:**
- Survives page refresh
- Clears on browser close
- Secure in same-origin context

**Limitations:**
- Not persistent across sessions
- Vulnerable to XSS attacks
- Browser-specific

## Security Considerations

### HTTPS Required
- All token transmission must use HTTPS
- Never send tokens over HTTP
- Production environment required

### Token Expiration
- Tokens expire (typically 1 hour)
- Service doesn't handle expiration
- Caller should refresh as needed

### Scope Security
- Use minimal scopes required
- Default scope provides broad access
- Customize for least privilege

### XSS Protection
- Store token in sessionStorage only
- Don't log tokens
- Don't send to analytics
- Use Content Security Policy

## Performance Optimization

### Token Caching
Implement client-side token caching:
```typescript
const tokenCache = new Map<string, { token: string; expiry: number }>();

export async function acquireFabricTokenCached(scopes?: string[]) {
  const cacheKey = (scopes || []).join('|');
  const cached = tokenCache.get(cacheKey);
  
  if (cached && cached.expiry > Date.now()) {
    return cached.token;
  }

  const token = await acquireFabricToken(scopes);
  const expiry = Date.now() + (55 * 60 * 1000); // 55 minutes
  
  tokenCache.set(cacheKey, { token, expiry });
  return token;
}
```

### Batch Requests
Reuse token for multiple requests:
```typescript
const token = await acquireFabricToken();

// Use token for multiple API calls
const dashboard1 = await fetchDashboard(dashboard1Id, token);
const dashboard2 = await fetchDashboard(dashboard2Id, token);
const dashboard3 = await fetchDashboard(dashboard3Id, token);
```

## Testing

### Mocking the Service
```typescript
jest.mock('@/services/fabricTokenService', () => ({
  acquireFabricToken: jest.fn().mockResolvedValue('mock-token'),
}));
```

### Testing Token Usage
```typescript
import { acquireFabricToken } from '@/services/fabricTokenService';

test('acquires token successfully', async () => {
  const token = await acquireFabricToken();
  expect(token).toBeDefined();
  expect(typeof token).toBe('string');
});

test('handles acquisition error', async () => {
  jest.spyOn(getRayfinClient().auth, 'getSession')
    .mockReturnValue({ isAuthenticated: false });

  await expect(acquireFabricToken()).rejects.toThrow();
});

test('supports custom scopes', async () => {
  const scopes = ['custom-scope'];
  // Should not throw
  const token = await acquireFabricToken(scopes);
  expect(token).toBeDefined();
});
```

## Related Services

- [rayfinClient](./rayfinClient.md) - Rayfin client singleton
- [RayfinAuthService](./RayfinAuthService.md) - Authentication service

## Related Documentation

- See also: [HemyLiveDataPage](../pages/HemyLiveDataPage.md) - Uses this service
- See also: README.md - Authentication flow

## Troubleshooting

### Token Acquisition Fails
1. Check Rayfin is initialized
2. Verify user is authenticated
3. Check browser console for errors
4. Verify Fabric API scope is correct

### 401 Unauthorized Errors
1. Token may be expired
2. User permissions insufficient
3. Token not passed correctly to Fabric SDK
4. Verify acquireFabricToken is called before use

### Mixed Content Errors
1. Ensure production uses HTTPS
2. Check all API URLs are HTTPS
3. Verify certificate is valid

## Best Practices

1. **Acquire Early**: Get token when page loads, not on-demand
2. **Handle Errors**: Always wrap in try-catch
3. **Verify Auth**: Check user authenticated before acquiring
4. **Implement Caching**: Cache token to reduce repeated calls
5. **Monitor Expiry**: Refresh before expiration
6. **Log Errors**: Log failures for debugging
7. **Secure Storage**: Never expose tokens in logs/console
8. **Use HTTPS**: Always for production

## Future Enhancements

- [ ] Automatic token refresh before expiration
- [ ] Token caching with TTL
- [ ] Multiple scope handling
- [ ] Fallback auth mechanism
- [ ] Analytics for token acquisition
- [ ] Circuit breaker for auth failures
- [ ] Rate limiting for token requests
