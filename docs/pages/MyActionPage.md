# MyActionPage

## Overview
The **MyActionPage** embeds a Microsoft Dynamics CRM dashboard displaying user action items and personal dashboard metrics. This page provides a personalized view of critical information and tasks assigned to the current user.

## Location
`src/pages/MyActionPage.tsx`

## Features

### 1. **Dynamics CRM Dashboard Integration**
- Embeds personalized CRM dashboard
- Displays action items and metrics
- Real-time data updates from CRM

### 2. **Error Handling**
- Connection error detection and display
- User-friendly error messages
- Visual error state with retry information

### 3. **Loading States**
- Animated loading spinner
- Loading text indicator
- Status indicator in header (yellow/green/red)

### 4. **Connection Status**
- Header status indicator with color coding
- Real-time connection status feedback

## Props
No props. This is a route-level page component.

## Component Structure

### Header Section
- Title: "My Action"
- Lightning bolt icon (action/energy symbol)
- Status indicator:
  - 🟢 Green: Connected
  - 🟡 Yellow: Loading
  - 🔴 Red: Error

### Content Area
- Loading State: Spinner with "Loading dashboard..." text
- Error State: Error card with icon and message
- Connected State: Full CRM dashboard iframe

## State Management

```typescript
const [isLoading, setIsLoading] = useState(true);                    // Loading state
const [error, setError] = useState<string | null>(null);            // Error message
```

## Iframe Configuration

```typescript
const dashboardUrl = 'https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&navbar=off&pagetype=dashboard&id=94f6fb8a-af0f-f011-998a-000d3ab98ff7&type=system&_canOverride=true';

<iframe
  src={dashboardUrl}
  title="My Action - Dynamics Dashboard"
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

### URL Parameters
| Parameter | Value | Purpose |
|-----------|-------|---------|
| `appid` | `b86bd27b-2e83-ec11-8d21-000d3a64cba3` | CRM app ID |
| `navbar` | `off` | Hide CRM navbar |
| `pagetype` | `dashboard` | Display as dashboard |
| `id` | `94f6fb8a-af0f-f011-998a-000d3ab98ff7` | Dashboard ID |
| `type` | `system` | System dashboard |
| `_canOverride` | `true` | Allow dashboard customization |

### Sandbox & Permissions
- **Sandbox**: `allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation`
- **API Access**: `geolocation`, `microphone`, `camera`

## Event Handlers

### `handleIframeLoad()`
Triggered when dashboard loads successfully:
- Clears any previous errors
- Sets loading to false
- Displays dashboard content

### `handleIframeError()`
Triggered when dashboard fails to load:
- Sets user-friendly error message
- Sets loading to false
- Displays error dialog

```typescript
const handleIframeError = () => {
  setError('Failed to load dashboard. Please check your connection or permissions.');
  setIsLoading(false);
};
```

## Styling

Uses Tailwind CSS with custom theme:
- **Primary**: Navy blue (`#021838`)
- **Background**: Cream white (`#FAF8F2`)
- **Accent**: Brown (`#7C4D2F`)
- **Border**: Light gray (`#DDD4C0`)
- **Error**: Red (`#EF4444`)

### Key Classes
- `sticky top-0 z-40` - Fixed header positioning
- `h-[calc(100vh-73px)]` - Full viewport minus header
- `animate-spin` - Loading spinner animation
- `rounded-2xl` - Card border radius

## Dashboard Features

### Purpose
The "My Action" dashboard displays:
- Personal action items
- Assigned tasks and activities
- Key performance metrics
- Real-time notifications
- Quick access shortcuts

### User Benefits
- Centralized view of priorities
- Quick task management
- Personalized insights
- Real-time status updates

## Data Flow

```
Component Mount
    ↓
Set loading = true, error = null
    ↓
Render iframe (hidden)
    ↓
Dashboard begins loading
    ├─ Success: onLoad → Set loading = false
    └─ Error: onError → Set error message
    ↓
Display loaded state or error
```

## Integration Points

### Authentication
- Inherits parent app session
- Dashboard personalized per user
- CRM enforces row-level security

### Navigation
- Part of main sidebar navigation
- Accessible from main menu
- Can be default landing page

### User Context
- Dashboard displays logged-in user's data
- Real-time updates based on user permissions

## Usage Example

```tsx
import { MyActionPage } from '@/pages/MyActionPage';

// In routing
<Route path="/my-action" element={<MyActionPage />} />

// Sidebar navigation
<SidebarItem onClick={() => navigate('/my-action')}>
  My Action
</SidebarItem>

// As home/default page
<Route path="/" element={<MyActionPage />} />
```

## Error Recovery

### When Error Occurs
1. Check internet connection
2. Verify CRM permissions
3. Refresh page to retry
4. Check CRM server status

### Manual Retry
Users must refresh the page manually. Consider adding retry button in error state.

## Performance Considerations

- Full iframe viewport may consume significant memory
- Dashboard data loaded from CRM server
- Real-time updates require persistent connection
- Initial load time varies with dashboard complexity

## Security Considerations

### Sandbox Configuration
- Restrictive sandbox with necessary permissions
- `allow-popups-to-escape-sandbox` for external links
- Session-based authentication
- CRM enforces data access rules

### Data Privacy
- Dashboard shows only user's authorized data
- HTTPS encryption to CRM
- Row-level security enforced
- Audit trails maintained in CRM

## Limitations

- Cannot customize dashboard from React
- No offline support
- Load time depends on CRM server
- Cannot filter data from React layer
- No client-side caching

## Future Enhancements

- [ ] Add dashboard reload button
- [ ] Implement timeout with retry
- [ ] Add dashboard preset shortcuts
- [ ] Cache dashboard state locally
- [ ] Add keyboard shortcuts
- [ ] Implement analytics
- [ ] Add export functionality
- [ ] Improve accessibility

## Troubleshooting

### Loading stuck / blank page
- **Check**: Network tab for CRM requests
- **Check**: Browser console for errors
- **Try**: Refreshing the page
- **Verify**: CRM instance URL is accessible

### Error dialog appears
- **Cause**: Connection issue or permission denied
- **Action**: Check internet connection
- **Action**: Verify user has dashboard permissions
- **Action**: Contact administrator if issue persists

### Dashboard not updating
- **Cause**: Network latency or CRM server lag
- **Action**: Refresh page
- **Action**: Wait for real-time sync
- **Action**: Check CRM server status

### Cannot interact with dashboard
- **Cause**: Sandbox restrictions
- **Action**: Check browser console for CSP errors
- **Action**: Verify CRM role permissions
- **Action**: Try different browser

## Related Pages

- [HomePage](./HomePage.md) - Task management
- [HemyXPage](./HemyXPage.md) - Main CRM app
- [HemyDataPage](./HemyDataPage.md) - Data view
- [HemyProjectsPage](./HemyProjectsPage.md) - Projects view
- [HemyReportsPage](./HemyReportsPage.md) - Reports view
