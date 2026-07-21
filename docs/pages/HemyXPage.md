# HemyXPage

## Overview
The **HemyXPage** is the main Dynamics CRM application page, providing full access to the entire Hemy system within the Hemy 360 application. It's a comprehensive dashboard that serves as the entry point to CRM functionality with enhanced error handling.

## Location
`src/pages/HemyXPage.tsx`

## Features

### 1. **Dynamics CRM Main App**
- Embeds the primary Hemy CRM application
- Provides access to all CRM modules and entities
- Full functionality integration within React app

### 2. **Robust Error Handling**
- Connection error detection
- User-friendly error messages
- Visual error state display
- Animated status indicator (red on error, yellow loading, green connected)

### 3. **Loading States**
- Animated spinner with loading text
- Center-aligned loading UI
- Smooth transition to loaded state

### 4. **Connection Status Monitoring**
- Real-time connection status in header
- Visual feedback through color-coded indicator
- Status text display for troubleshooting

## Props
No props. This is a route-level page component.

## Component Structure

### Header Section
- Title: "Hemy X" with lightning bolt icon
- Connection status indicator:
  - 🟢 Green: Connected
  - 🟡 Yellow: Loading
  - 🔴 Red: Error

### Content Area
- Loading State: Spinner with "Loading Hemy X..." text
- Error State: Error dialog with icon and message
- Connected State: Full-width CRM iframe

## State Management

```typescript
const [isLoading, setIsLoading] = useState(true);                    // Loading state
const [error, setError] = useState<string | null>(null);            // Error message
```

## Iframe Configuration

```typescript
const hemyXUrl = 'https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3';

<iframe
  src={hemyXUrl}
  title="Hemy X - Dynamics CRM"
  style={{
    width: '100%',
    height: '100%',
    border: 'none',
    display: isLoading || error ? 'none' : 'block',
  }}
  onLoad={handleIframeLoad}
  onError={handleIframeError}
  allow="geolocation; microphone; camera"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
/>
```

### URL Configuration
| Parameter | Value | Purpose |
|-----------|-------|---------|
| `appid` | `b86bd27b-2e83-ec11-8d21-000d3a64cba3` | Hemy CRM app ID |

### Sandbox & Permissions
- **Sandbox Attributes**:
  - `allow-same-origin` - Session sharing
  - `allow-scripts` - JavaScript execution
  - `allow-forms` - Form operations
  - `allow-popups` - Popup windows
  - `allow-popups-to-escape-sandbox` - External popups
  - `allow-presentation` - Presentation mode

- **API Permissions**:
  - `geolocation` - Location access
  - `microphone` - Audio capture
  - `camera` - Video capture

## Event Handlers

### `handleIframeLoad()`
Called when iframe loads successfully:
- Clears any existing errors
- Sets loading state to false
- Shows iframe content

### `handleIframeError()`
Called when iframe load fails:
- Sets user-friendly error message
- Sets loading state to false
- Displays error dialog

## Error Handling

```typescript
const handleIframeError = () => {
  setError('Failed to load Hemy X. Please check your connection or permissions.');
  setIsLoading(false);
};
```

### Error Messages
- Connection problems
- Permission issues
- Network failures

## Styling

Custom theme via Tailwind CSS:
- **Primary**: Navy blue (`#021838`)
- **Background**: Cream white (`#FAF8F2`)
- **Accent**: Brown (`#7C4D2F`)
- **Border**: Light gray (`#DDD4C0`)

### Key Classes
- `sticky top-0 z-40` - Fixed header
- `h-[calc(100vh-73px)]` - Full viewport minus header
- `animate-spin` - Loading spinner
- `flex-center` - Centered loading/error states

## Data Flow

```
Component Mount
    ↓
Set loading = true, error = null
    ↓
Render iframe (hidden)
    ↓
Iframe begins loading
    ├─ Success → onLoad → Set loading = false → Show iframe
    └─ Error → onError → Set error message → Show error dialog
```

## UI States

### 1. Loading State
```
┌─────────────────────────┐
│     Hemy X              │
│  (loading, yellow dot)  │
├─────────────────────────┤
│                         │
│    [spinning loader]    │
│   Loading Hemy X...     │
│                         │
└─────────────────────────┘
```

### 2. Connected State
```
┌─────────────────────────┐
│  Hemy X   (green dot)   │
├─────────────────────────┤
│  Full CRM Content...    │
│  (iframe)               │
└─────────────────────────┘
```

### 3. Error State
```
┌──────────────────────────────┐
│  Hemy X     (red dot)        │
├──────────────────────────────┤
│       ⚠️ Connection Error     │
│  Failed to load Hemy X.      │
│  Please check your           │
│  connection or permissions.  │
└──────────────────────────────┘
```

## Integration Points

### Authentication
- Inherits parent app authentication
- Uses session cookies
- CRM validates user permissions

### Navigation
- Main entry point to CRM
- Accessible from sidebar
- Can link to specific modules via URL parameters

## Usage Example

```tsx
import { HemyXPage } from '@/pages/HemyXPage';

// In routing
<Route path="/hemy-x" element={<HemyXPage />} />

// From navigation
<Link to="/hemy-x">Open Hemy X</Link>
```

## Error Recovery

### User Actions on Error
1. Check network connection
2. Verify CRM permissions
3. Refresh the page
4. Contact administrator if error persists

### Automatic Retry
Not currently implemented. Users must refresh page to retry.

## Performance Considerations

- Full viewport iframe loads entire CRM app
- Large CRM datasets may impact performance
- Memory usage scales with CRM data
- Initial load time depends on network and CRM server

## Security Considerations

### Sandbox Configuration
- Strict sandbox with necessary permissions only
- `allow-popups-to-escape-sandbox` allows external navigation
- Session-based authentication
- CRM enforces security roles

### Data Protection
- HTTPS connection to CRM
- Session tokens encrypted
- Row-level security enforced by CRM

## Limitations

- Cannot customize CRM view from React component
- No offline support
- Full CRM app loads regardless of needed functionality
- Cannot selectively load CRM modules

## Future Enhancements

- [ ] Implement automatic retry mechanism
- [ ] Add connection timeout handling
- [ ] Cache CRM state for offline support
- [ ] Add selective module loading
- [ ] Implement progressive CRM loading
- [ ] Add analytics for usage tracking
- [ ] Add keyboard shortcuts
- [ ] Improve accessibility features

## Troubleshooting

### Blank white page / Loading stuck
- **Solution**: Check network tab for CRM request status
- **Solution**: Verify CRM instance URL is accessible
- **Solution**: Check browser console for errors

### Error: "Failed to load Hemy X"
- **Cause**: Connection problem or permission denied
- **Solution**: Check internet connection
- **Solution**: Verify user permissions in CRM
- **Solution**: Contact administrator

### CRM content not interactive
- **Cause**: Sandbox restrictions or permission issue
- **Solution**: Check browser console for errors
- **Solution**: Verify user CRM role
- **Solution**: Refresh page

### Popups not working
- **Cause**: Browser popup blocker
- **Solution**: Allow popups for this domain
- **Solution**: Check sandbox `allow-popups` attribute

## Related Pages

- [HemyDataPage](./HemyDataPage.md) - Data view
- [HemyProjectsPage](./HemyProjectsPage.md) - Projects view
- [HemyReportsPage](./HemyReportsPage.md) - Reports view
- [MyActionPage](./MyActionPage.md) - Dashboard view
